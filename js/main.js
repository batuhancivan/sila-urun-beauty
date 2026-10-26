(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const overlay = document.querySelector(".overlay");
  const burger = document.querySelector(".burger");
  const closer = document.querySelector(".menu-close");

  function setMenu(open) {
    if (!overlay || !burger) return;
    overlay.classList.toggle("open", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    document.documentElement.classList.toggle("menu-open", open);
    if (open) closer && closer.focus();
  }
  burger && burger.addEventListener("click", () => setMenu(!overlay.classList.contains("open")));
  closer && closer.addEventListener("click", () => setMenu(false));

  document.querySelectorAll("[data-select]").forEach((wrap) => {
    const btn = wrap.querySelector(".field-btn");
    const menu = wrap.querySelector(".field-menu");
    const label = wrap.querySelector(".field-label");
    const input = wrap.querySelector('input[type="hidden"]');
    if (!btn || !menu || !input) return;

    btn.addEventListener("click", () => {
      const willOpen = !wrap.classList.contains("open");
      document.querySelectorAll("[data-select].open").forEach((other) => other.classList.remove("open"));
      wrap.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    menu.querySelectorAll("button").forEach((opt) => {
      opt.addEventListener("click", () => {
        input.value = opt.dataset.value || "";
        if (label) label.textContent = opt.textContent.trim();
        wrap.classList.add("filled");
        wrap.classList.remove("invalid", "open");
        btn.setAttribute("aria-expanded", "false");
        menu.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b === opt ? "true" : "false"));
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-select]")) {
      document.querySelectorAll("[data-select].open").forEach((wrap) => {
        wrap.classList.remove("open");
        const btn = wrap.querySelector(".field-btn");
        btn && btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.querySelectorAll('input[type="date"]').forEach((input) => {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    input.min = iso;
    const sync = () => input.classList.toggle("filled", Boolean(input.value));
    input.addEventListener("change", sync);
    input.addEventListener("input", sync);
    input.addEventListener("click", () => {
      if (typeof input.showPicker === "function") {
        try { input.showPicker(); } catch (err) { /* bazı tarayıcılar kullanıcı hareketi ister */ }
      }
    });
  });

  document.querySelectorAll('input[name="phone"]').forEach((input) => {
    input.addEventListener("input", () => {
      const digits = input.value.replace(/\D/g, "").slice(0, 11);
      const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)].filter(Boolean);
      input.value = parts.join(" ");
    });
  });

  document.querySelectorAll("[data-booking]").forEach((form) => {
    const book = form.closest(".book");
    const alertEl = form.querySelector(".form-alert");
    const summary = book && book.querySelector(".book-sum");
    const again = book && book.querySelector("[data-reset]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const missing = [];
      form.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));

      const need = [
        ["service", "hizmet"],
        ["expert", "uzman"],
        ["date", "tarih"],
        ["time", "saat"],
        ["name", "ad soyad"],
        ["phone", "telefon"],
      ];

      need.forEach(([name]) => {
        const el = form.querySelector(`[name="${name}"]`);
        if (!el) return;
        const value = (el.value || "").trim();
        let bad = !value;
        if (name === "name" && value.length < 3) bad = true;
        if (name === "phone" && value.replace(/\D/g, "").length < 10) bad = true;
        if (bad) {
          missing.push(name);
          const field = el.closest(".field");
          field && field.classList.add("invalid");
        }
      });

      if (missing.length) {
        if (alertEl) {
          alertEl.hidden = false;
          alertEl.textContent = "Lütfen işaretli alanları tamamlayın.";
        }
        book && book.classList.remove("shake");
        void (book && book.offsetWidth);
        book && book.classList.add("shake");
        const first = form.querySelector(".field.invalid .field-btn, .field.invalid input, .field.invalid textarea");
        first && first.focus();
        return;
      }

      if (alertEl) alertEl.hidden = true;
      const labelOf = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        if (!el || !el.value) return "";
        if (el.type === "date") {
          const date = new Date(el.value + "T00:00");
          return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
        }
        const fieldLabel = el.closest(".field") && el.closest(".field").querySelector(".field-label");
        return fieldLabel ? fieldLabel.textContent.trim() : el.value.trim();
      };
      const bits = [labelOf("service"), labelOf("date"), labelOf("time")].filter(Boolean);
      if (summary) {
        summary.textContent = bits.length
          ? bits.join(" · ") + " için talebiniz hazır."
          : "Talebiniz hazır.";
      }
      book && book.classList.add("is-done");
    });

    again && again.addEventListener("click", () => {
      form.reset();
      book.classList.remove("is-done", "shake");
      form.querySelectorAll("[data-select]").forEach((wrap) => {
        wrap.classList.remove("filled", "open", "invalid");
        const label = wrap.querySelector(".field-label");
        const input = wrap.querySelector('input[type="hidden"]');
        if (label && label.dataset.placeholder) label.textContent = label.dataset.placeholder;
        if (input) input.value = "";
        wrap.querySelectorAll(".field-menu button").forEach((b) => b.removeAttribute("aria-selected"));
      });
      form.querySelectorAll("input, textarea").forEach((el) => {
        el.classList.remove("filled");
        const field = el.closest(".field");
        field && field.classList.remove("invalid");
      });
      if (alertEl) alertEl.hidden = true;
    });
  });

  const revealNodes = document.querySelectorAll(".reveal");
  if (revealNodes.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px" });
    revealNodes.forEach((node) => io.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("in"));
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (!Number.isFinite(target) || reduce) return;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          io.disconnect();
        }
      }, { threshold: 0.6 });
      io.observe(el);
    } else {
      run();
    }
  });

  const slider = document.querySelector("[data-slider]");
  if (slider) {
    const slides = [...slider.querySelectorAll(".quote")];
    const dots = [...slider.querySelectorAll(".dot")];
    let index = 0;
    let timer = 0;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-on", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-on", i === index));
    };
    const play = () => {
      if (reduce || slides.length < 2) return;
      stop();
      timer = window.setInterval(() => show(index + 1), 7000);
    };
    const stop = () => timer && window.clearInterval(timer);
    slider.querySelector("[data-prev]")?.addEventListener("click", () => { show(index - 1); play(); });
    slider.querySelector("[data-next]")?.addEventListener("click", () => { show(index + 1); play(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); play(); }));
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    show(0);
    play();
  }

  document.querySelectorAll(".acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".acc");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const filters = document.querySelectorAll("[data-filter]");
  if (filters.length) {
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const cat = btn.dataset.filter;
        document.querySelectorAll(".shot").forEach((shot) => {
          const show = cat === "all" || shot.dataset.cat === cat;
          shot.classList.toggle("is-hide", !show);
        });
      });
    });
  }

  const lights = [...document.querySelectorAll("[data-lightbox]")];
  if (lights.length) {
    const lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = `
      <button class="lb-x" type="button" aria-label="Kapat">×</button>
      <button class="lb-nav prev" type="button" aria-label="Önceki">‹</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-nav next" type="button" aria-label="Sonraki">›</button>`;
    document.body.appendChild(lb);
    const img = lb.querySelector("img");
    const cap = lb.querySelector("figcaption");
    let cursor = 0;

    const visible = () => lights.filter((link) => !link.closest(".shot")?.classList.contains("is-hide"));
    const openAt = (link) => {
      const list = visible();
      cursor = Math.max(0, list.indexOf(link));
      const current = list[cursor];
      img.src = current.getAttribute("href");
      img.alt = current.querySelector("img")?.alt || "";
      cap.textContent = current.closest("figure")?.querySelector("figcaption")?.textContent || img.alt;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("menu-open");
    };
    const shut = () => {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("menu-open");
    };
    const step = (dir) => {
      const list = visible();
      if (!list.length) return;
      cursor = (cursor + dir + list.length) % list.length;
      openAt(list[cursor]);
    };
    lights.forEach((link) => link.addEventListener("click", (e) => { e.preventDefault(); openAt(link); }));
    lb.querySelector(".lb-x").addEventListener("click", shut);
    lb.querySelector(".prev").addEventListener("click", () => step(-1));
    lb.querySelector(".next").addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) shut(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") shut();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("open")) setMenu(false);
  });

  let leaving = false;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || leaving) return;
    const a = e.target.closest("a");
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    let url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (a.hasAttribute("data-lightbox")) return;
    if (url.pathname === location.pathname && url.hash) {
      setMenu(false);
      return;
    }
    if (reduce) return;
    e.preventDefault();
    leaving = true;
    setMenu(false);
    document.documentElement.classList.add("is-leaving");
    window.setTimeout(() => { location.href = a.href; }, 480);
  });
})();
