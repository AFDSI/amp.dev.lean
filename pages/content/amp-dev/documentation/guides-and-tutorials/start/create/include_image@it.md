---
$title: Aggiunta di un’immagine
---

La maggior parte dei tag HTML può essere utilizzata direttamente in HTML AMP, tuttavia alcuni tag, come `<img>`, vengono sostituiti con tag HTML AMP personalizzati equivalenti o leggermente ottimizzati (inoltre alcuni tag problematici sono stati del tutto esclusi, vedi [Tag HTML nelle specifiche]({{g.doc('/content/amp-dev/documentation/guides-and-tutorials/learn/spec/index.md', locale=doc.locale).url.path}})).

Per illustrare il possibile aspetto del markup supplementare, ecco il codice necessario per incorporare un’immagine nella pagina:

[sourcecode:html]
<amp-img src="welcome.jpg" alt="Welcome" height="400" width="800"></amp-img>
[/sourcecode]

Per capire perché stiamo sostituendo tag come `<img>` con [`<amp-img>`]({{g.doc('/content/amp-dev/documentation/components/reference/amp-img.md', locale=doc.locale).url.path}}) e quanti di essi sono disponibili, vai alla sezione [Includere Iframe ed elementi multimediali]({{g.doc('/content/amp-dev/documentation/guides-and-tutorials/develop/media_iframes_3p/amp_replacements.md', locale=doc.locale).url.path}}).
