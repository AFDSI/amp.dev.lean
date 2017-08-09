---
$title: ปรับเปลี่ยนการนำเสนอและเค้าโครง
---

## ปรับเปลี่ยนการนำเสนอ

AMP คือหน้าเว็บที่มีการจัดรูปแบบหน้าและอิลิเมนต์ต่างๆ โดยใช้คุณสมบัติ CSS ทั่วไป อิลิเมนต์การจัดรูปแบบจะใช้ตัวเลือกคลาสหรืออิลิเมนต์ในสไตล์ชีทแบบอินไลน์ในส่วน `<head>` ที่เรียกว่า `<style amp-custom>`

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

หน้า AMP ทุกหน้าสามารถมีสไตล์ชีทที่ฝังไว้ได้เพียงรายการเดียวโดยคุณจะไม่สามารถใช้ตัวเลือกบางอย่างได้ [เรียนรู้เกี่ยวกับการจัดรูปแบบทั้งหมด](/th/docs/guides/author-develop/responsive/style_pages.html)

## ควบคุมเค้าโครง

AMP มีกฎที่เข้มงวดกว่าในการจัดเค้าโครงของอิลิเมนต์บนหน้าเว็บ บนหน้าเว็บ HTML ปกติ คุณสามารถใช้ CSS ในการจัดเค้าโครงของอิลิเมนต์ได้อย่างเต็มที่ อย่างไรก็ตาม ด้วยเหตุผลด้านประสิทธิภาพ AMP กำหนดให้อิลิเมนต์ทั้งหมดต้องมีขนาดที่ชัดเจนตั้งแต่ต้น

เรียนรู้เกี่ยวกับวิธีการแสดงผลและการจัดเค้าโครงหน้าเว็บใน AMP และวิธีการปรับเปลี่ยนเค้าโครงใน[วิธีควบคุมเค้าโครง](/th/docs/guides/author-develop/responsive/control_layout.html)

<div class="prev-next-buttons">
  <a class="button prev-button" href="/th/docs/tutorials/create/include_image.html"><span class="arrow-prev">ก่อนหน้า</span></a>
  <a class="button next-button" href="/th/docs/tutorials/create/preview_and_validate.html"><span class="arrow-next">ถัดไป</span></a>
</div>
