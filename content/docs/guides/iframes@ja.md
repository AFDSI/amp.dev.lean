---
$title: iframe の追加
$order: 2
$category: Develop
components:
- iframe
toc: true
---
[TOC]

ここでは、ページにメディア コンテンツを含めたり、iframe を使用して AMP の制限を受けずに高度なコンテンツを表示したりする方法について解説します。

## 基本

[`amp-iframe`](/ja/docs/reference/components/amp-iframe.html) 要素を使用すると、ページに iframe を表示できます。

iframe は、メインページのコンテキストでサポートされていないコンテンツ（ユーザー作成の JavaScript を必要とするコンテンツなど）を AMP で表示する場合に特に便利です。

###`amp-iframe` の要件:

* 最初のビューポートが上部から **600 ピクセル** または **75%** 以上離れていること。
* HTTPS 経由でのみリソースをリクエストできること（allow-same-origin を指定している場合を除き、リソースのオリジンはコンテナとは別である必要があります）。

{% call callout('ヒント', type='read') %}
[<code>amp-iframe</code>](/ja/docs/reference/components/amp-iframe.html) の仕様もご確認ください。
{% endcall %}

### スクリプトを追加する

ページに `amp-iframe` を含めるには、
まず `<head>` に以下のスクリプトを追加します。これにより、拡張コンポーネントの追加コードが読み込まれます。

[sourcecode:html]
<script async custom-element="amp-iframe"
    src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
[/sourcecode]

### マークアップを作成する

`amp-iframe` の例:

```html
<amp-iframe width="200" height="100"
    sandbox="allow-scripts allow-same-origin"
    layout="responsive"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDG9YXIhKBhqclZizcSzJ0ROiE0qgVfwzI&q=europe">
</amp-iframe>
```

Preview: 

<amp-iframe width="200" height="100"
    sandbox="allow-scripts allow-same-origin"
    layout="responsive"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDG9YXIhKBhqclZizcSzJ0ROiE0qgVfwzI&q=europe">
</amp-iframe>

## 例

[デモページ（**上級編**）](https://ampbyexample.com/components/amp-iframe/)では、さらに高度なサンプルをご覧いただけます。
