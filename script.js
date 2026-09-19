/* =========================================================
   Crime Chronicles — shared JavaScript
   Loaded by every page. Everything here checks the visitor's
   "reduce motion" setting first: if they've asked for less
   movement, the page just stays still and readable.
========================================================= */

(function () {

  // Does this visitor want motion? true = yes, animate.
  var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;


  /* -------------------------------------------------------
     1. HEADER SHRINKS ON SCROLL
     Once you scroll past 60px, add a class to <header>.
     CSS does the rest (tighter padding, blurred backdrop).
  ------------------------------------------------------- */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }


  /* -------------------------------------------------------
     2. READING PROGRESS BAR (article pages)
     A thin amber bar across the very top that fills up as
     you read down the page.
  ------------------------------------------------------- */
  var article = document.querySelector('.article');
  if (article) {
    var bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      // How far down the page are we, as a number from 0 to 1?
      var scrollable = document.body.scrollHeight - window.innerHeight;
      var percent = scrollable > 0 ? (window.scrollY / scrollable) : 0;
      bar.style.transform = 'scaleX(' + percent + ')';
    });
  }


  /* -------------------------------------------------------
     3. BACK TO TOP BUTTON
     Fades in after you've scrolled a bit.
  ------------------------------------------------------- */
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '&uarr;';
  document.body.appendChild(toTop);

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: motionOK ? 'smooth' : 'auto' });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      toTop.classList.add('visible');
    } else {
      toTop.classList.remove('visible');
    }
  });


  /* -------------------------------------------------------
     Everything below is motion-only. If the visitor asked
     for reduced motion, we stop here and leave the page
     completely still.
  ------------------------------------------------------- */
  if (!motionOK) return;


  /* -------------------------------------------------------
     4. FLOATING DUST MOTES
     A handful of tiny specks drifting slowly upward, like
     dust caught in a beam of light. Created in JS so we
     don't have to hand-write 18 <div>s in every page.
  ------------------------------------------------------- */
  var dustLayer = document.createElement('div');
  dustLayer.className = 'dust';
  dustLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dustLayer);

  for (var i = 0; i < 18; i++) {
    var mote = document.createElement('span');
    // Random position, size, speed and delay so they don't
    // all move in lockstep.
    mote.style.left = Math.random() * 100 + 'vw';
    mote.style.width = mote.style.height = (Math.random() * 2 + 1.5) + 'px';
    mote.style.animationDuration = (Math.random() * 20 + 22) + 's';
    mote.style.animationDelay = (Math.random() * -30) + 's';
    mote.style.opacity = Math.random() * 0.35 + 0.1;
    dustLayer.appendChild(mote);
  }


  /* -------------------------------------------------------
     5. HERO TYPEWRITER
     Types the headline out character by character instead of
     animating a CSS width. That matters because a width-based
     trick needs "white-space: nowrap", which cannot wrap onto
     a second line — on a narrow window the sentence just runs
     off the edge of the screen instead. Typing real characters
     lets the browser wrap the text normally, at any width.
  ------------------------------------------------------- */
  var typeEl = document.querySelector('.type-line-1');
  var heroSection = document.querySelector('.hero');
  var subEl = document.querySelector('.hero .sub');

  if (typeEl && heroSection) {
    heroSection.classList.add('hero-animate'); // tells CSS to hide .sub until typing finishes
    var fullText = typeEl.textContent;
    typeEl.textContent = '';

    var charDelay = 45; // ms between each letter appearing
    var i = 0;
    function typeNextChar() {
      i++;
      typeEl.textContent = fullText.slice(0, i);
      if (i < fullText.length) {
        setTimeout(typeNextChar, charDelay);
      } else if (subEl) {
        subEl.classList.add('is-visible');
      }
    }
    setTimeout(typeNextChar, 300); // brief pause before typing starts
  }


  /* -------------------------------------------------------
     6. SCROLL REVEALS
     IntersectionObserver watches elements and adds a class
     the moment they scroll into view, which triggers their
     CSS animation. Used for the case cards on the homepage
     and for headings/paragraphs inside posts.
  ------------------------------------------------------- */
  function revealOnScroll(selector, threshold) {
    var items = document.querySelectorAll(selector);
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // only animate once
        }
      });
    }, { threshold: threshold });

    items.forEach(function (item) { observer.observe(item); });
  }

  // Homepage case cards (the "declassify" effect)
  var filesSection = document.querySelector('.files');
  if (filesSection) {
    filesSection.classList.add('reveal-ready');
    revealOnScroll('.file', 0.2);
  }

  // Article text fades up paragraph by paragraph
  if (article) {
    article.classList.add('reveal-ready');
    revealOnScroll('.article h2, .article p, .article .sources, .article .back-link', 0.1);
  }

})();
