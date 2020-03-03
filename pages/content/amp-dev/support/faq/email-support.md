---
$title@: Supported Email Platforms
$order: 4
teaser:
  image:
    src: '/static/img/faq/faq-platform-and-vendor-partners.jpg'
    width: 570
    height: 320
    alt: FAQ – Supported Email Platforms
  label: Learn more
faq: !g.yaml /shared/data/faq.yaml
---

# Supported email platforms, clients and providers

A growing number of email platforms, clients and providers support AMP for Email within their platforms.

{% with sections = doc.faq.email.partners %}
{% include 'views/partials/accordion.j2' %}
{% endwith %}

{% with sections = [doc.faq.email.clients] %}
{% include 'views/partials/accordion.j2' %}
{% endwith %}
