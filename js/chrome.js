/* Menü, saatler ve alt bilgi buradan düzenlenir. */
(function () {
  const page = (document.body && document.body.dataset.page) || "";
  const book = page === "home" ? "#randevu" : "index.html#randevu";
  const year = new Date().getFullYear();
  const hours = "Pazartesi – Cumartesi · 10:00–20:00";
  const closed = "Pazar günleri kapalıyız";
  const city = "İstanbul";

  function on(name) {
    return page === name ? " is-active" : "";
  }

  function logo() {
    return '<a class="logo" href="index.html"><span class="logo-name">Sıla Urun</span><span class="logo-sub">Beauty</span></a>';
  }

  function header() {
    return `
<div class="wipe" aria-hidden="true"></div>
<a class="skip" href="#icerik">İçeriğe geç</a>
<header class="header">
  <div class="header-inner">
    ${logo()}
    <nav class="nav" aria-label="Ana menü">
      <a class="${on("home")}" href="index.html">Ana Sayfa</a>
      <a class="${on("about")}" href="hakkimizda.html">Hakkımızda</a>
      <div class="has-sub">
        <a class="${on("services")}" href="hizmetler.html">Hizmetlerimiz
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </a>
        <div class="sub">
          <a href="cilt-bakimi.html">Cilt Bakımı</a>
          <a href="guzellik.html#makyaj">Kalıcı Makyaj</a>
          <a href="guzellik.html#lazer">Lazer Epilasyon</a>
          <a href="guzellik.html#kas">Kaş &amp; Kirpik</a>
          <a href="hizmetler.html">Tüm Hizmetler</a>
        </div>
      </div>
      <a class="${on("skin")}" href="cilt-bakimi.html">Cilt Bakımı</a>
      <a class="${on("beauty")}" href="guzellik.html">Güzellik</a>
      <a class="${on("gallery")}" href="galeri.html">Galeri</a>
      <a class="${on("blog")}" href="blog.html">Blog</a>
      <a class="${on("contact")}" href="iletisim.html">İletişim</a>
    </nav>
    <div class="header-actions">
      <a class="btn btn-dark" href="${book}">Randevu Al
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </a>
      <button class="burger" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<div class="overlay" id="menu" aria-hidden="true">
  <button class="menu-close" type="button" aria-label="Menüyü kapat"><span></span><span></span></button>
  <nav class="overlay-nav" aria-label="Tam menü">
    <a class="${on("home")}" href="index.html">Ana Sayfa</a>
    <a class="${on("about")}" href="hakkimizda.html">Hakkımızda</a>
    <a class="${on("services")}" href="hizmetler.html">Hizmetler</a>
    <a class="${on("skin")}" href="cilt-bakimi.html">Cilt Bakımı</a>
    <a class="${on("beauty")}" href="guzellik.html">Güzellik</a>
    <a class="${on("gallery")}" href="galeri.html">Galeri</a>
    <a class="${on("blog")}" href="blog.html">Blog</a>
    <a class="${on("contact")}" href="iletisim.html">İletişim</a>
  </nav>
  <aside class="overlay-aside">
    <div class="overlay-photo"></div>
    <p class="kicker">Doğal · Sağlıklı · Işıltılı</p>
    <p>Cildinizdeki ışıltıyı, acele etmeden keşfedelim.</p>
    <a class="btn btn-gold" href="${book}">Randevu Al</a>
  </aside>
</div>`;
  }

  function footer() {
    return `
<footer class="footer">
  <div class="wrap footer-grid">
    <div>
      ${logo()}
      <p>Bilim ve doğanın uyumunu, size özel dokunuşlarla buluşturuyoruz.</p>
    </div>
    <div>
      <h3>Keşfet</h3>
      <a href="index.html">Ana Sayfa</a>
      <a href="hakkimizda.html">Hakkımızda</a>
      <a href="galeri.html">Galeri</a>
      <a href="blog.html">Blog</a>
      <a href="iletisim.html">İletişim</a>
    </div>
    <div>
      <h3>Hizmetler</h3>
      <a href="cilt-bakimi.html">Cilt Bakımı</a>
      <a href="guzellik.html#makyaj">Kalıcı Makyaj</a>
      <a href="guzellik.html#lazer">Lazer Epilasyon</a>
      <a href="guzellik.html#kas">Kaş &amp; Kirpik</a>
      <a href="hizmetler.html">Tüm Hizmetler</a>
    </div>
    <div>
      <h3>Ziyaret</h3>
      <p>${city}</p>
      <p>${hours}</p>
      <p>${closed}</p>
      <a class="btn btn-gold" href="${book}">Randevu Al</a>
    </div>
  </div>
  <div class="wrap footer-base">
    <span>© ${year} Sıla Urun Beauty</span>
    <span>Doğal · Sağlıklı · Işıltılı</span>
  </div>
</footer>
<a class="dock btn btn-gold" href="${book}">Randevu Al</a>`;
  }

  if (!window.__suChrome) {
    window.__suChrome = true;
    document.write(header());
  } else {
    document.write(footer());
  }
})();
