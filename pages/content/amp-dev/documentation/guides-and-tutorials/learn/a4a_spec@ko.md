---
"$title": AMP for Ads specification
order: '3'
formats:
- ads
teaser:
  text: |2-

 "_If you'd like to propose changes to the standard, please comment on the"
    [Intent
toc: 'true'
---

<!--
This file is imported from https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/amp-a4a-format.md.
Please do not change this file.
If you have found a bug or an issue please
have a look and request a pull request there.
-->

<!---
Copyright 2016 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

*표준에 대한 변경 사항을 제안하려면 [구현 목적](https://github.com/ampproject/amphtml/issues/4264)* 문서에 코멘트를 남겨주세요.

AMPHTML 광고는 AMP 페이지에서 빠르고 효과적인 광고를 렌더링하는 데 적합한 메커니즘입니다. 브라우저에서 AMPHTML 광고 문서(이하 "AMP 광고")를 빠르고 원활하게 렌더링하고 사용자 경험의 품질 저하를 방지하려면 AMP 광고에서 일련의 유효성 검사 규칙이 준수되어야 합니다. [AMP 형식 규칙](https://amp.dev/documentation/guides-and-tutorials/learn/spec/amphtml)과 유사하게 AMPHTML 광고는 허용된 태그, 기능 및 확장 프로그램의 제한된 집합에 액세스할 수 있습니다.

## AMPHTML 광고 형식 규칙<a name="amphtml-ad-format-rules"></a>

하단에서 달리 명시되지 않는 한 이곳에 참조용으로 포함된 [AMP 형식 규칙](https://amp.dev/documentation/guides-and-tutorials/learn/spec/amphtml.html)이 광고에서 준수되어야 합니다. 예를 들어, AMPHTML 광고 [상용구](#boilerplate)는 AMP 표준 상용구와는 차이가 있습니다.

또한 광고에서 다음 규칙이 준수되어야 합니다.

<table>
<thead><tr>
  <th>Rule</th>
  <th>Rationale</th>
</tr></thead>
<tbody>
<tr>
<td>Must use <code><html ⚡4ads></code> or <code><html amp4ads></code> as its enclosing tags.</td>
<td>Allows validators to identify a creative document as either a general AMP doc or a restricted AMPHTML ad doc and to dispatch appropriately.</td>
</tr>
<tr>
<td>런타임 스크립트로 <code>https://cdn.ampproject.org/v0.js</code> 대신 <code><script async src="https://cdn.ampproject.org/amp4ads-v0.js"></script></code> 포함.</td>
<td>Allows tailored runtime behaviors for AMPHTML ads served in cross-origin iframes.</td>
</tr>
<tr>
<td>Must not include a <code><link rel="canonical"></code> tag.</td>
<td>Ad creatives don't have a "non-AMP canonical version" and won't be independently search-indexed, so self-referencing would be useless.</td>
</tr>
<tr>
<td>Can include optional meta tags in HTML head as identifiers, in the format of <code><meta name="amp4ads-id" content="vendor=${vendor},type=${type},id=${id}"></code>. Those meta tags must be placed before the <code>amp4ads-v0.js</code> script. The value of <code>vendor</code> and <code>id</code> are strings containing only [0-9a-zA-Z_-]. The value of <code>type</code> is either <code>creative-id</code> or <code>impression-id</code>.</td>
<td>Those custom identifiers can be used to identify the impression or the creative. They can be helpful for reporting and debugging.<br><br><p>Example:</p>
<pre>
<meta name="amp4ads-id"
  content="vendor=adsense,type=creative-id,id=1283474">
<meta name="amp4ads-id"
  content="vendor=adsense,type=impression-id,id=xIsjdf921S"></pre>
</td>
</tr>
<tr>
<td>
<code><amp-analytics></code> viewability tracking may only target the full-ad selector, via  <code>"visibilitySpec": { "selector": "amp-ad" }</code> as defined in <a href="https://github.com/ampproject/amphtml/issues/4018">Issue #4018</a> and <a href="https://github.com/ampproject/amphtml/pull/4368">PR #4368</a>. In particular, it may not target any selectors for elements within the ad creative.</td>
<td>In some cases, AMPHTML ads may choose to render an ad creative in an iframe.In those cases, host page analytics can only target the entire iframe anyway, and won’t have access to any finer-grained selectors.<br><br> <p>Example:</p> <pre>
<amp-analytics id="nestedAnalytics">
  <script type="application/json">
  {
    "requests": {
      "visibility": "https://example.com/nestedAmpAnalytics"
    },
    "triggers": {
      "visibilitySpec": {
      "selector": "amp-ad",
      "visiblePercentageMin": 50,
      "continuousTimeMin": 1000
      }
    }
  }
  </script>
</amp-analytics>
</pre> <p>This configuration sends a request to the <code>https://example.com/nestedAmpAnalytics</code> URL when 50% of the enclosing ad has been continuously visible on the screen for 1 second.</p> </td>
</tr>
</tbody>
</table>

### 상용구 <a name="boilerplate"></a>

AMPHTML 광고에는 [일반 AMP 문서](https://github.com/ampproject/amphtml/blob/master/spec/amp-boilerplate.md)와는 다르고 훨씬 단순한 상용구 스타일 라인이 필요합니다.

[sourcecode:html]
<style amp4ads-boilerplate>
  body {
    visibility: hidden;
  }
</style>
[/sourcecode]

<em>설명:</em> <code>amp-boilerplate</code> 스타일은 AMP 런타임이 준비되고 숨김 처리를 해제할 수 있을 때까지 본문 콘텐츠를 숨깁니다. Javascript가 비활성화되거나 AMP 런타임이 로딩에 실패하더라도 기본 상용구를 통해 콘텐츠가 최종적으로 표시될 수 있습니다. 하지만 AMPHTML 광고에서는 Javascript가 전적으로 비활성화된 경우 AMPHTML 광고는 실행되지 않으며 어떤 광고도 표시되지 않습니다. 그렇기에 <code><noscript></code> 섹션도 필요 없는 것이죠. AMP 런타임 없는 경우 AMPHTML 광고가 의존하는 대다수의 요소(예: 가시성 추적을 위한 분석, 콘텐츠 표시를 위한 <code>amp-img</code>)는 지원되지 않으므로 오류가 있는 광고를 표시하기보단 아무 광고도 표시하지 않는 편이 낫습니다.

마지막으로 AMPHTML 광고 상용구는 <code>amp-boilerplate</code>보다는 <code>amp-a4a-boilerplate</code>를 사용합니다. 따라서 검사기가 쉽게 이를 식별하며 더 정확한 오류 메시지를 생성할 수 있어 개발자에게 유용합니다.

<a>일반 AMP 상용구</a>에 적용되는 상용구 텍스트 전환 규칙과 동일한 규칙이 적용됩니다.

### CSS <a name="css"></a>

<table>
<thead><tr>
  <th>Rule</th>
  <th>Rationale</th>
</tr></thead>
<tbody>
  <tr>
    <td>크리에이티브 CSS에서 <code>position:fixed</code> 및<code>position:sticky</code> 사용 금지.</td>
    <td>
<code>position:fixed</code> breaks out of shadow DOM, which AMPHTML ads depend on. lso, ads in AMP are already not allowed to use fixed position.</td>
  </tr>
  <tr>
    <td> <code>touch-action</code> 사용 금지.</td>
    <td>An ad that can manipulate <code>touch-action</code> can interfere with    the user's ability to scroll the host document.</td>
  </tr>
  <tr>
    <td>Creative CSS is limited to 20,000 bytes.</td>
    <td>Large CSS blocks bloat the creative, increase network    latency, and degrade page performance. </td>
  </tr>
  <tr>
    <td>Transition and animation are subject to additional restrictions.</td>
    <td>AMP must be able to control all animations belonging to an    ad, so that it can stop them when the ad is not on screen or system resources are very low.</td>
  </tr>
  <tr>
    <td>Vendor-specific prefixes are considered aliases for the same symbol    without the prefix for the purposes of validation.  This means that if    a symbol <code>foo</code> is prohibited by CSS validation rules, then the symbol <code>-vendor-foo</code> will also be prohibited.</td>
    <td>Some vendor-prefixed properties provide equivalent functionality to properties that are otherwise prohibited or constrained under these rules.<br><br><p>Example: <code>-webkit-transition</code> and <code>-moz-transition</code> are both considered aliases for <code>transition</code>.  They will only be allowed in contexts where bare <code>transition</code> would be allowed (see <a href="#selectors">Selectors</a> section below).</p>
</td>
  </tr>
</tbody>
</table>

#### CSS 애니메이션 및 트랜지션 <a name="css-animations-and-transitions"></a>

##### 선택자 <a name="selectors"></a>

마지막으로 AMPHTML 광고는 `amp-boilerplate`보다는 `amp-a4a-boilerplate`를 사용하므로 검사기에서 쉽게 식별할 수 있으며 보다 정확한 오류 메시지가 생성하여 개발자를 지원합니다.

- Contain only `transition`, `animation`, `transform`, `visibility`, or `opacity` properties.

    *Rationale:* This allows the AMP runtime to remove this class from context to deactivate animations, when necessary for page performance.

**Good**

[sourcecode:css]
.box {
  transform: rotate(180deg);
  transition: transform 2s;
}
[/sourcecode]

**Bad**

Property not allowed in CSS class.

[sourcecode:css]
.box {
  color: red; // non-animation property not allowed in animation selector
  transform: rotate(180deg);
  transition: transform 2s;
}
[/sourcecode]

##### Transitionable and animatable properties <a name="transitionable-and-animatable-properties"></a>

The only properties that may be transitioned are opacity and transform. ([Rationale](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/))

**Good**

[sourcecode:css]
transition: transform 2s;
[/sourcecode]

**Bad**

[sourcecode:css]
transition: background-color 2s;
[/sourcecode]

**Good**

[sourcecode:css]
@keyframes turn {
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(90deg);
  }
}
[/sourcecode]

**Bad**

[sourcecode:css]
@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
[/sourcecode]

### Allowed AMP extensions and builtins <a name="allowed-amp-extensions-and-builtins"></a>

The following are *allowed* AMP extension modules and AMP built-in tags in an AMPHTML ad creative. Extensions or builtin tags not explicitly listed are prohibited.

- [amp-accordion](https://amp.dev/documentation/components/amp-accordion)
- [amp-ad-exit](https://amp.dev/documentation/components/amp-ad-exit)
- [amp-analytics](https://amp.dev/documentation/components/amp-analytics)
- [amp-anim](https://amp.dev/documentation/components/amp-anim)
- [amp-animation](https://amp.dev/documentation/components/amp-animation)
- [amp-audio](https://amp.dev/documentation/components/amp-audio)
- [amp-bind](https://amp.dev/documentation/components/amp-bind)
- [amp-carousel](https://amp.dev/documentation/components/amp-carousel)
- [amp-fit-text](https://amp.dev/documentation/components/amp-fit-text)
- [amp-font](https://amp.dev/documentation/components/amp-font)
- [amp-form](https://amp.dev/documentation/components/amp-form)
- [amp-img](https://amp.dev/documentation/components/amp-img)
- [amp-layout](https://amp.dev/documentation/components/amp-layout)
- [amp-lightbox](https://amp.dev/documentation/components/amp-lightbox)
- amp-mraid: 실험적으로 지원. 이 태그를 사용하려는 경우 [wg-monetization](https://github.com/ampproject/wg-monetization/issues/new)에서 이슈를 생성하세요.
- [amp-mustache](https://amp.dev/documentation/components/amp-mustache)
- [amp-pixel](https://amp.dev/documentation/components/amp-pixel)
- [amp-position-observer](https://amp.dev/documentation/components/amp-position-observer)
- [amp-selector](https://amp.dev/documentation/components/amp-selector)
- [amp-social-share](https://amp.dev/documentation/components/amp-social-share)
- [amp-video](https://amp.dev/documentation/components/amp-video)

Most of the omissions are either for performance or to make AMPHTML ads simpler to analyze.

*Example:* `<amp-ad>` is omitted from this list. It is explicitly disallowed because allowing an `<amp-ad>` inside an `<amp-ad>` could potentially lead to unbounded waterfalls of ad loading, which does not meet AMPHTML ads performance goals.

*Example:* `<amp-iframe>` is omitted from this list. It is disallowed because ads could use it to execute arbitrary Javascript and load arbitrary content. Ads wanting to use such capabilities should return `false` from their [a4aRegistry](https://github.com/ampproject/amphtml/blob/master/ads/_a4a-config.js#L40) entry and use the existing '3p iframe' ad rendering mechanism.

*Example:* `<amp-facebook>`, `<amp-instagram>`, `<amp-twitter>`, and `<amp-youtube>` are all omitted for the same reason as `<amp-iframe>`: They all create iframes and can potentially consume unbounded resources in them.

*Example:* `<amp-ad-network-*-impl>` are omitted from this list. The `<amp-ad>` tag handles delegation to these implementation tags; creatives should not attempt to include them directly.

*Example:* `<amp-lightbox>` is not yet included because even some AMPHTML ads creatives may be rendered in an iframe and there is currently no mechanism for an ad to expand beyond an iframe. Support may be added for this in the future, if there is demonstrated desire for it.

### HTML tags <a name="html-tags"></a>

The following are *allowed* tags in an AMPHTML ads creative. Tags not explicitly allowed are prohibited. This list is a subset of the general [AMP tag addendum allowlist](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/../../spec/amp-tag-addendum.md). Like that list, it is ordered consistent with HTML5 spec in section 4 [The Elements of HTML](http://www.w3.org/TR/html5/single-page.html#html-elements).

Most of the omissions are either for performance or because the tags are not HTML5 standard. For example, `<noscript>` is omitted because AMPHTML ads depends on JavaScript being enabled, so a `<noscript>` block will never execute and, therefore, will only bloat the creative and cost bandwidth and latency. Similarly, `<acronym>`, `<big>`, et al. are prohibited because they are not HTML5 compatible.

#### 4.1 The root element <a name="41-the-root-element"></a>

4.1.1 `<html>`

- Must use types `<html ⚡4ads>` or `<html amp4ads>`

#### 4.2 Document metadata <a name="42-document-metadata"></a>

4.2.1 `<head>`

4.2.2 `<title>`

4.2.4 `<link>`

- `<link rel=...>` tags are disallowed, except for `<link rel=stylesheet>`.

- **Note:** Unlike in general AMP, `<link rel="canonical">` tags are prohibited.

    4.2.5 `<style>` 4.2.6 `<meta>`

#### 4.3 Sections <a name="43-sections"></a>

4.3.1 `<body>` 4.3.2 `<article>` 4.3.3 `<section>` 4.3.4 `<nav>` 4.3.5 `<aside>` 4.3.6 `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, and `<h6>` 4.3.7 `<header>` 4.3.8 `<footer>` 4.3.9 `<address>`

#### 4.4 Grouping Content <a name="44-grouping-content"></a>

4.4.1 `<p>` 4.4.2 `<hr>` 4.4.3 `<pre>` 4.4.4 `<blockquote>` 4.4.5 `<ol>` 4.4.6 `<ul>` 4.4.7 `<li>` 4.4.8 `<dl>` 4.4.9 `<dt>` 4.4.10 `<dd>` 4.4.11 `<figure>` 4.4.12 `<figcaption>` 4.4.13 `<div>` 4.4.14 `<main>`

#### 4.5 Text-level semantics <a name="45-text-level-semantics"></a>

4.5.1 `<a>` 4.5.2 `<em>` 4.5.3 `<strong>` 4.5.4 `<small>` 4.5.5 `<s>` 4.5.6 `<cite>` 4.5.7 `<q>` 4.5.8 `<dfn>` 4.5.9 `<abbr>` 4.5.10 `<data>` 4.5.11 `<time>` 4.5.12 `<code>` 4.5.13 `<var>` 4.5.14 `<samp>` 4.5.15 `<kbd >` 4.5.16 `<sub>` and `<sup>` 4.5.17 `<i>` 4.5.18 `<b>` 4.5.19 `<u>` 4.5.20 `<mark>` 4.5.21 `<ruby>` 4.5.22 `<rb>` 4.5.23 `<rt>` 4.5.24 `<rtc>` 4.5.25 `<rp>` 4.5.26 `<bdi>` 4.5.27 `<bdo>` 4.5.28 `<span>` 4.5.29 `<br>` 4.5.30 `<wbr>`

#### 4.6 Edits <a name="46-edits"></a>

4.6.1 `<ins>` 4.6.2 `<del>`

#### 4.7 Embedded Content <a name="47-embedded-content"></a>

- Embedded content is supported only via AMP tags, such as `<amp-img>` or `<amp-video>`.

#### 4.7.4 `<source>` <a name="474-source"></a>

#### 4.7.18 SVG <a name="4718-svg"></a>

SVG tags are not in the HTML5 namespace. They are listed below without section ids.

`<svg>``<g>``<path>``<glyph>``<glyphref>``<marker>``<view>``<circle>``<line>``<polygon>``<polyline>``<rect>``<text>``<textpath>``<tref>``<tspan>``<clippath>``<filter>``<lineargradient>``<radialgradient>``<mask>``<pattern>``<vkern>``<hkern>``<defs>``<use>``<symbol>``<desc>``<title>`

#### 4.9 Tabular data <a name="49-tabular-data"></a>

4.9.1 `<table>` 4.9.2 `<caption>` 4.9.3 `<colgroup>` 4.9.4 `<col>` 4.9.5 `<tbody>` 4.9.6 `<thead>` 4.9.7 `<tfoot>` 4.9.8 `<tr>` 4.9.9 `<td>` 4.9.10 `<th>`

#### 4.10 Forms <a name="410-forms"></a>

4.10.8 `<button>`

#### 4.11 Scripting <a name="411-scripting"></a>

- Like a general AMP document, the creative's `<head>` tag must contain a `<script async src="https://cdn.ampproject.org/amp4ads-v0.js"></script>` tag.
- Unlike general AMP, `<noscript>` is prohibited.
    - *Rationale:* Since AMPHTML ads requires Javascript to be enabled to function at all, `<noscript>` blocks serve no purpose in AMPHTML ads and only cost network bandwidth.
- Unlike general AMP, `<script type="application/ld+json">` is prohibited.
    - *Rationale:* JSON LD is used for structured data markup on host pages, but ad creatives are not standalone documents and don't contain structured data. JSON LD blocks in them would just cost network bandwidth.
- All other scripting rules and exclusions are carried over from general AMP.
