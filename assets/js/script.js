'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

document.addEventListener("DOMContentLoaded", function () {
  const eventContainers = document.querySelectorAll(".onstage-events, .offstage-events");

  eventContainers.forEach(eventContainer => {
      let scrollSpeed = 3; // Adjust speed as needed
      let isPaused = false;
      
      function scrollEvents() {
          if (!isPaused) {
              eventContainer.scrollLeft += scrollSpeed;

              // Reset to start if reached end
              if (eventContainer.scrollLeft + eventContainer.clientWidth >= eventContainer.scrollWidth) {
                  eventContainer.scrollLeft = 0;
              }
          }
          requestAnimationFrame(scrollEvents); // Ensures continuous execution
      }

      // Pause scrolling when hovering
      eventContainer.addEventListener("mouseenter", () => isPaused = true);
      
      // Resume scrolling when mouse leaves
      eventContainer.addEventListener("mouseleave", () => isPaused = false);

      scrollEvents(); // Start infinite scrolling
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999"; 
  
  let particles = [];
  const maxParticles = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function createParticle(x, y) {
    particles.push({
      x,
      y,
      size: Math.random() * 2 + 0.5, // Smaller sparkles
      speedX: (Math.random() - 0.5) * 1.5, // Gentle spread effect
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: 1,
      decay: 0.015 + Math.random() * 0.015,
      color: `rgba(255, 204, 102, ${Math.random() * 0.8 + 0.2})` // Softer golden color
    });
    if (particles.length > maxParticles) particles.shift();
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.opacity -= particle.decay;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 6; // Soft glow effect
      ctx.shadowColor = "rgba(255, 215, 150, 0.6)"; // Light golden glow
      ctx.fill();

      if (particle.opacity <= 0) particles.splice(index, 1);
    });
    requestAnimationFrame(drawParticles);
  }

  document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 4; i++) createParticle(e.clientX, e.clientY);
  });

  drawParticles();
});
