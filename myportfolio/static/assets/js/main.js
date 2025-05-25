/**
* Template Name: MyResume
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);



  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a[href^="#"]').forEach(navLink => {
  navLink.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    

    // Smooth scroll to the section with offset
    const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop) || 35;
    window.scrollTo({
      top: target.offsetTop - scrollMarginTop,
      behavior: 'smooth'
    });

    // Update URL hash manually
    history.pushState(null, null, targetId);

    // Close mobile nav if open
    if (document.querySelector('#header').classList.contains('header-show')) {
      headerToggle();
    }
  });
});

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });


//   document.addEventListener("DOMContentLoaded", function () {
//     const menuToggle = document.getElementById("menuToggle");
//     const header = document.getElementById("header");

//     menuToggle.addEventListener("click", function () {
//         header.classList.toggle("header-show");
//     });
// });



// document.addEventListener("DOMContentLoaded", function () {
//   const menuToggle = document.querySelector(".header-toggle"); // Ensure correct selector
//   const header = document.querySelector(".header");

//   if (menuToggle && header) {
//       menuToggle.addEventListener("click", function () {
//           header.classList.toggle("header-show");
//       });
//   }
// });




  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


/**
 * hero-section slider
 */
const images = window.heroImages || [];
let currentIndex = 0;
const slider = document.getElementById("hero-slider");

function changeBackground() {
  if (!slider || images.length === 0) return;

  const imageUrl = images[currentIndex];
  slider.style.backgroundImage = `url('${imageUrl}')`;
  slider.style.backgroundSize = "cover";
  slider.style.backgroundPosition = "center";
  slider.style.transition = "background-image 0.5s ease-in-out";

  currentIndex = (currentIndex + 1) % images.length;
}

changeBackground();
setInterval(changeBackground, 5000); // Change image every 5 seconds

// Update background on window resize to maintain responsiveness
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(changeBackground, 200);
});

images.forEach((src) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
});


console.log("Main.js loaded");



/** Navbar Animation */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNavbar");
  const hamburger = document.getElementById("menuToggle");
  const navbarLinks = navbar.querySelectorAll("a, .navbar-brand"); // Select all links and brand text
  const logo = navbar.querySelector("img"); // Select the logo image
  const staticUrl = "/static/"; // Ensure static URL is set correctly

  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      // At the very top of the page
      navbar.classList.remove("mt-4", "border-animate");
      navbar.style.borderRadius = "0px";
      navbar.style.width = "100%"; // Reset width to full
      navbar.style.margin = "0 auto"; // Center the navbar
      navbar.style.backgroundColor = ""; // Reset to normal background color
      hamburger.style.color = ""; // Reset hamburger color
      navbarLinks.forEach(link => link.style.color = ""); // Reset text color
      if (logo) logo.src = staticUrl + "assets/img/logo.png"; // Reset logo to original
    } else {
      // Scrolled down
      navbar.classList.add("mt-4", "border-animate");
      navbar.style.borderRadius = "40px";
      navbar.style.width = "85%"; // Reduce width
      navbar.style.margin = "0 auto"; // Keep it centered
      navbar.style.setProperty("background-color", "#0563bb", "important"); // Change background color with !important
      hamburger.style.setProperty("color", "white", "important"); // Change hamburger color with !important
      navbarLinks.forEach(link => link.style.color = "white"); // Force text color to white
      if (logo) logo.src = staticUrl + "assets/img/white-logo.png"; // Change logo to white version
    }
  });
});


// Landing Page Contact Form

  document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const form = e.target;
    const data = new FormData(form);
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    // Prepare UI
    statusEl.classList.remove('hidden');
    statusEl.textContent = "";
    submitBtn.disabled = true;
    btnText.textContent = "Sending...";
    btnSpinner.classList.remove('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusEl.textContent = "Message sent successfully!";
        statusEl.style.color = "green";
        form.reset();
      } else {
        const result = await response.json();
        statusEl.textContent = result.errors ? result.errors.map(e => e.message).join(", ") : "Oops! Something went wrong.";
        statusEl.style.color = "red";
      }
    } catch (error) {
      statusEl.textContent = "Network error. Please try again.";
      statusEl.style.color = "red";
    }

    // Restore UI
    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 5000);

    submitBtn.disabled = false;
    btnText.textContent = "Send Message";
    btnSpinner.classList.add('hidden');
  });


  document.querySelectorAll('.navbar-nav .nav-link[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({ behavior: 'smooth' });

    // Update the URL hash manually
    history.pushState(null, null, targetId);
  });
});
