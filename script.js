/* ---------- Nav (mobile menu + scroll state) ---------- */
const hamburgerBtn = document.querySelector(".navbarHamburger");
const mobileMenu = document.querySelector(".navbarMenu");
const navbar = document.querySelector(".navbar");

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("isOpen");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll(".navbarLink").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("isOpen");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}

if (navbar) {
  const updateNavbarScrollState = () => {
    navbar.classList.toggle("navbarScrolled", window.scrollY > 8);
  };

  updateNavbarScrollState();
  window.addEventListener("scroll", updateNavbarScrollState, { passive: true });
}

/* ---------- Hero slideshow ---------- */
const heroSlider = document.querySelector("#heroSlider");

if (heroSlider) {
  const heroSlides = heroSlider.querySelectorAll(".heroSlide");
  const heroDots = heroSlider.querySelectorAll(".heroDot");
  const heroPrevBtn = heroSlider.querySelector(".heroPrevBtn");
  const heroNextBtn = heroSlider.querySelector(".heroNextBtn");
  const autoSlideDelayMs = 4500;
  let currentSlideIndex = 0;
  let autoSlideTimer = null;

  const showHeroSlide = (targetIndex) => {
    heroSlides.forEach((slide, index) => {
      const offset = (index - targetIndex) * 100;
      slide.style.transform = `translateX(${offset}%)`;
      slide.classList.toggle("isActive", index === targetIndex);
    });

    heroDots.forEach((dot, index) => {
      dot.classList.toggle("isActive", index === targetIndex);
    });

    currentSlideIndex = targetIndex;
  };

  const goToNextSlide = () => {
    const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    showHeroSlide(nextIndex);
  };

  const goToPreviousSlide = () => {
    const prevIndex = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(prevIndex);
  };

  const startAutoSlide = () => {
    autoSlideTimer = window.setInterval(goToNextSlide, autoSlideDelayMs);
  };

  const restartAutoSlide = () => {
    if (autoSlideTimer) {
      window.clearInterval(autoSlideTimer);
    }
    startAutoSlide();
  };

  heroNextBtn?.addEventListener("click", () => {
    goToNextSlide();
    restartAutoSlide();
  });

  heroPrevBtn?.addEventListener("click", () => {
    goToPreviousSlide();
    restartAutoSlide();
  });

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      restartAutoSlide();
    });
  });

  showHeroSlide(0);
  startAutoSlide();
}

/* ---------- Launch + products scroll (desktop only) ---------- */
const launchSection = document.querySelector(".launchSection");
const launchContainer = document.querySelector(".launchContainer");
const productsSection = document.querySelector(".productsSection");

if (launchSection && launchContainer) {
  const mobileLaunchMedia = window.matchMedia("(max-width: 768px)");

  const updateLaunchCameraProgress = () => {
    if (mobileLaunchMedia.matches) {
      launchContainer.style.setProperty("--cameraProgress", "0");
      if (productsSection) {
        productsSection.style.setProperty("--productsReveal", "0");
      }
      return;
    }

    const sectionRect = launchSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollRange = Math.max(1, sectionRect.height - viewportHeight);
    const progressRaw = (-sectionRect.top) / scrollRange;
    const progress = Math.max(0, Math.min(1, progressRaw));
    const cameraProgress = Math.min(1, progress / 0.5);
    launchContainer.style.setProperty("--cameraProgress", String(cameraProgress));

    if (productsSection) {
      const productsReveal = Math.max(0, Math.min(1, (progress - 0.12) / 0.42));
      productsSection.style.setProperty("--productsReveal", String(productsReveal));
    }
  };

  updateLaunchCameraProgress();
  window.addEventListener("scroll", updateLaunchCameraProgress, { passive: true });
  window.addEventListener("resize", updateLaunchCameraProgress);
  mobileLaunchMedia.addEventListener("change", updateLaunchCameraProgress);
}

/* ---------- Best sellers: thumbs, carousel, filters ---------- */
document.querySelectorAll(".bestCard").forEach((card) => {
  const mainImg = card.querySelector(".bestMainImg");
  const thumbs = card.querySelectorAll(".bestThumbRowThumbs img");
  if (!mainImg || thumbs.length === 0) return;

  const setSelectedThumb = (thumb) => {
    thumbs.forEach((t) => t.classList.remove("bestThumbSelected"));
    thumb.classList.add("bestThumbSelected");
    mainImg.src = thumb.currentSrc || thumb.src;
    const alt = thumb.getAttribute("alt");
    if (alt) {
      mainImg.alt = alt;
    }
    card.classList.add("bestCardThumbChosen");
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => setSelectedThumb(thumb));
  });

  thumbs[0].classList.add("bestThumbSelected");
});

const bestCardsRow = document.querySelector(".bestCardsRow");
const bestNavPrev = document.querySelector(".bestNavPrev");
const bestNavNext = document.querySelector(".bestNavNext");

if (bestCardsRow && bestNavPrev && bestNavNext) {
  const getBestScrollStep = () => {
    const card = bestCardsRow.querySelector(".bestCard");
    if (!card) return 320;
    const styles = window.getComputedStyle(bestCardsRow);
    const gap = parseFloat(styles.columnGap || styles.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  };

  const updateBestNavEmphasis = () => {
    const el = bestCardsRow;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const eps = 4;
    const canScrollPrev = el.scrollLeft > eps;
    const canScrollNext = el.scrollLeft < maxScroll - eps;
    bestNavPrev.classList.toggle("bestNavEmphasized", canScrollPrev);
    bestNavNext.classList.toggle("bestNavEmphasized", canScrollNext);
  };

  bestNavPrev.addEventListener("click", () => {
    bestCardsRow.scrollBy({ left: -getBestScrollStep(), behavior: "smooth" });
  });

  bestNavNext.addEventListener("click", () => {
    bestCardsRow.scrollBy({ left: getBestScrollStep(), behavior: "smooth" });
  });

  bestCardsRow.addEventListener("scroll", updateBestNavEmphasis, { passive: true });
  window.addEventListener("resize", updateBestNavEmphasis);
  updateBestNavEmphasis();
}

document.querySelectorAll(".bestFilters").forEach((group) => {
  const tabs = group.querySelectorAll("button");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("isActive", active);
        b.setAttribute("aria-selected", String(active));
      });
    });
  });
});

/* ---------- Testimonials marquee ---------- */
const testimonialsRowTop = document.querySelector(".testimonialsRowTop");
const testimonialsRowBottom = document.querySelector(".testimonialsRowBottom");

if (testimonialsRowTop && testimonialsRowBottom) {
  const isSmall = window.matchMedia("(max-width: 520px)");

  const setupMarquee = (row, direction) => {
    if (row.dataset.marqueeInit === "true") return;
    row.dataset.marqueeInit = "true";

    const viewport = row.closest(".testimonialsViewport");
    if (!viewport) return;

    const originalCards = Array.from(row.children).filter((el) => el.classList?.contains("testimonialCard"));
    if (originalCards.length === 0) return;

    const cloneOnce = () => {
      originalCards.forEach((card) => row.appendChild(card.cloneNode(true)));
    };

    cloneOnce();

    const allCards = Array.from(row.children).filter((el) => el.classList?.contains("testimonialCard"));
    const firstSetCount = originalCards.length;
    const secondSetFirst = allCards[firstSetCount];
    if (!secondSetFirst) return;

    const setWidth = secondSetFirst.offsetLeft;
    const safeSetWidth = Math.max(1, setWidth);

    while (row.scrollWidth < viewport.clientWidth * 2 && allCards.length < 200) {
      cloneOnce();
    }

    let x = direction < 0 ? 0 : -safeSetWidth;
    let lastT = performance.now();

    const tick = (t) => {
      const dt = (t - lastT) / 1000;
      lastT = t;
      const speed = isSmall.matches ? 35 : 50;
      x += direction * speed * dt;

      if (direction < 0) {
        if (x <= -safeSetWidth) x = 0;
      } else if (x >= 0) {
        x = -safeSetWidth;
      }
      row.style.transform = `translateX(${x}px)`;

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  setupMarquee(testimonialsRowTop, -1);
  setupMarquee(testimonialsRowBottom, 1);
}
