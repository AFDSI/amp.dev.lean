---
$title: Modify Presentation and Layout
$order: 2
---

## Modify the presentation

AMPs are web pages; any styling to the page and its elements is done using common CSS properties. Style elements using class or element selectors in an inline stylesheet in the `<head>`, called `<style amp-custom>`:

[sourcecode:html]
<style amp-custom>
  /* any custom style goes here */
  body {
    background-color: white;
  }
  amp-img {
    background-color: gray;
    border: 1px solid black;
  }
</style>
[/sourcecode]

Every AMP page can only have a single embedded stylesheet, and there are certain selectors you’re not allowed to use. [Learn all about styling](/docs/guides/author-develop/responsive/style_pages.html).

## Control the layout

AMP follows stricter rules when laying out elements on the page. On a normal HTML page, you almost exclusively use CSS to lay out elements. But for performance reasons, AMP requires all elements to have an explicit size set from the get-go.

Learn all about how AMP renders and layouts a page and how you can modify the layout in [How to Control Layout](/docs/guides/author-develop/responsive/control_layout.html).

<a class="button go-button" href="/docs/tutorials/create/preview_and_validate.html">Continue to Step 4</a>
