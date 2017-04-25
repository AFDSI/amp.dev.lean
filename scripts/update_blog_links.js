#!/usr/bin/env node

// dependencies
var fs = require('fs');
var moment = require('moment');

// config
var blogSectionYamlPath = '../content/includes/list-blog.yaml';
var blogPostDirectory = '../content/latest/blog/';
var blogSectionCount = 5;
var authorGravatarHashes = {
  'Paul Bakaus': '9a2d68554d8d1655a3fb3e2a50aee909'
};

// import yaml files
var blogSectionBody = 'blogs:\n';
var blogEntries = [];

// import RSS feed from blog with feed parser
var FeedParser = require('feedparser');
var request = require('request');

// setup feed parser
var req = request('https://amphtml.wordpress.com/feed/');
var req2 = request('https://www.youtube.com/feeds/videos.xml?playlist_id=PLXTOW_XMsIDTIRIu4Af-bqfGkUhPSE75A');


var feedparser = new FeedParser();
var videoparser = new FeedParser();
var feedEnded = false;
var videoEnded = false;

req.on('response', function (res) {
  var stream = this;
  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
  stream.pipe(feedparser);
});

req2.on('response', function (res) {
  var stream = this;
  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
  stream.pipe(videoparser);
});

function wrapUp() {

  // sort by date
  blogEntries.sort(function (a, b) {
    return b.date - a.date;
  });

  // cap at 6
  blogEntries = blogEntries.slice(0,6);

  for (var index = 0; index < blogEntries.length; index++) {
    var blogEntry = blogEntries[index];
    blogSectionBody += blogEntry.content;
  }

  fs.writeFileSync(blogSectionYamlPath, blogSectionBody);

}

feedparser.on('end', function() {

  if (videoEnded) {
    wrapUp();
  }

  feedEnded = true;
  console.log("Blog posts successfully updated.");
});

videoparser.on('end', function () {

  if (feedEnded) {
    wrapUp();
  }

  videoEnded = true;
  console.log("Video uploads successfully updated.");
});

function writeBlogPage(item, id, author, role, description, avatar) {

  var body = item.description
    .replace(/\<[A-z]+\>Posted by([^\<]+)\<\/[A-z]+\>/, "")
    // Replace spans that make text bold to <strong> tags
    .replace(/<span style="font-weight:400;">(((?!<\/span>)[\s\S])*)<\/span>/g, "<strong>$1</strong>")
    // Replace spans that add underlines to <u> tags
    .replace(/<span style="text-decoration:underline;">(((?!<\/span>)[\s\S])*)<\/span>/g, "<u>$1</u>")
    // Convert centered p's to <center> tags
    .replace(/<p style="text-align:center;">(((?!<\/p>)[\s\S])*)<\/p>/g, "<center>$1</center>")
    // Replace Wordpress-style images with their AMP equivalents (don't try this at home)
    .replace(
      /<img[^>]+data-orig-size="([\d]+),([\d]+)"[^>]+class="([^"]+)"[^>]+src="([^"]+)"[^>]+srcset="([^"]+)[^>]+sizes="([^"]+)"[^>]+\/>/g,
      "<div class=\"wp-image $3\"><amp-img layout='responsive' width=\"$1\" height=\"$2\" src=\"$4\" srcset=\"$5\" sizes=\"$6\"></amp-img>"
    )
    // Replace Wordpress-style gifs with their AMP equivalents (don't try this at home)
    .replace(
      /<img[^>]+[^>]+class="([^"]+)"[^>]+src="([^"]+)"[^>]+width="([\d]+)"[^>]+height="([\d]+)"[^>]+\/>/g,
      "<div class=\"wp-image $1\"><amp-img layout='fixed' width=\"$3\" height=\"$4\" src=\"$2\"></amp-img>"
    )
    // Replace other style tags we didn't catch and hope for the best..
    .replace(/style="[^"]+"/g, "")
    // Remove the tracking meta at the bottom of the page
    .split('<a rel="nofollow"')[0];

  body = `---
class: post-blog post-detail
type: Blog
$title: ${ item.title }
id: ${ id }
author: ${ author }
role: ${ role }
origin: "${ item.link }amp/"
excerpt: "${ description }"
avatar: ${ avatar }
date_data: ${ moment(item.date).format() }
$date: ${ moment(item.date).format("MMMM D, YYYY") }
$parent: /content/latest/list-blog.html

components:
  - social-share
---

<div class="amp-wp-article-content">
${ body }
</div>

`;

  fs.writeFileSync(blogPostDirectory + id + '.md', body);

}

feedparser.on('readable', function () {
  var item;
  while (item = this.read()) {

    // write into the body for the blog listing page

    var description = item['rss:description']['#'].split("<img")[0];
    var id = item.link.substr(0, item.link.length - 1).split('/').pop();

    var author = item.author;
    var role = '';
    var authorInBody = item.description.match(/\>Posted by ([^,]+),([^\<]+)/);
    if (authorInBody) {
      author = authorInBody[1];
      role = authorInBody[2];
    }

    var avatar = authorGravatarHashes[author] ? 'https://www.gravatar.com/avatar/' + authorGravatarHashes[author] : item.enclosures[0].url;

    blogEntries.push({
      date: item.date,
      content: `
- type: Blog
  title: "${ item.title }"
  id: ${ id }
  author: ${ author }
  role: ${ role }
  origin: "${ item.link }amp/"
  excerpt: "${ description }"
  avatar: ${ avatar }
  datedata: ${ moment(item.date).format() }
  date: "${ moment(item.date).format("MMMM D, YYYY") }"
`
    });

    // write into its own individual file
    writeBlogPage(item, id, author, role, description, avatar);



  }
});

videoparser.on('readable', function () {
  var item;
  while (item = this.read()) {

    // write into the body for the blog listing page


    var id = item['yt:videoid']['#'];

    var author = item.author;
    var role = '';
    var thumbnail = item['media:group']['media:thumbnail']['@'].url;
    var description = item['media:group']['media:description']['#']
      .replace(/\"/g, "\\\"")
      .replace("Watch all Amplify episodes: https://goo.gl/B9CCl4", "")
      .replace("Subscribe to the The AMP Project YouTube channel for updates on new episodes of Amplify: https://goo.gl/g2Y8h7", "")
      .trim();

    blogEntries.push({
      date: item.pubdate,
      content: `
- type: Video
  title: "${ item.title.replace(/\"/g, "\\\"") }"
  id: ${ id }
  author: ${ author }
  role: ${ role }
  origin: "${ item.link }"
  excerpt: "${ description }"
  thumbnail: "${ thumbnail }"
  avatar:
  datedata: ${ moment(item.pubdate).format() }
  date: "${ moment(item.pubdate).format("MMMM D, YYYY") }"
`
    });

  }
});