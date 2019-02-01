---
$title: Memahami bagian dari artikel AMP
---

Artikel AMP adalah fitur bercerita visual dengan layar penuh yang menyampaikan informasi dengan gambar, video, grafik, audio, dan lainnya. Fitur ini sangat cocok untuk pengguna yang menginginkan konten berukuran kecil tetapi kaya secara visual.  

Bahan dasar yang termasuk dalam artikel AMP adalah masing-masing **halaman**. Masing-masing halaman ini terdiri dari **lapisan** individual yang berisi **elemen** AMP dan HTML dasar.

{{ image('/static/img/docs/tutorials/amp_story/story_parts.png', 1047, 452, align='center ninety') }}

Masing-masing bahan tersebut diubah menjadi komponen AMP, tempat artikel diwakili oleh [`amp-story`]({{g.doc('/content/amp-dev/documentation/components/reference/amp-story.md', locale=doc.locale).url.path}}), halaman diwakili oleh `amp-story-page`, dan lapisan diwakili oleh `amp-story-grid-layer`.

{{ image('/static/img/docs/amp-story-tag-hierarchy.png', 557, 355, align='center seventyfive' ) }}

Mari mulai membuat artikel kita dengan penampung [`amp-story`]({{g.doc('/content/amp-dev/documentation/components/reference/amp-story.md', locale=doc.locale).url.path}}).
