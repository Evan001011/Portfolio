// =====================
// INTRO TYPING EFFECT
// =====================

// Main text to type out
const mainText = "WELCOME TO MY PORTFOLIO";

// DOM references for intro typing effect
const typedTextEl = document.getElementById("typed-text");
const cursor = document.getElementById("cursor");
const subtext = document.getElementById("subtext");
const typingBox = document.getElementById("typing-box");
const overlay = document.getElementById("transition-overlay");

// Screens used during intro
const introScreen = document.getElementById("intro-screen");
const titleScreen = document.getElementById("title-screen");

// Custom rotating cursor
const customCursor = document.getElementById("custom-cursor");

// Typing animation state
let index = 0;
let canContinue = false;

// Typing one character at a time
function type() {
    if (index < mainText.length) {
        typedTextEl.textContent = mainText.slice(0, index + 1);
        index++;
        setTimeout(type, 130);
    } else {
        cursor.style.display = "inline";
        setTimeout(() => {
            subtext.style.opacity = 1;
            canContinue = true;
        }, 2000);
    }
}

// Initialize typing effect
typingBox.style.minWidth = '0px';
type();


// =====================
// ENTER KEY TRANSITION
// =====================

// When Enter is pressed, fade to main screen
document.body.addEventListener("keydown", e => {
    if (e.key === "Enter" && canContinue && introScreen.style.display !== "none") {
        overlay.classList.add("active");
        customCursor.style.transition = "opacity 1s ease-in-out";
        customCursor.style.opacity = "0";

        setTimeout(() => {
            introScreen.style.display = "none";
            titleScreen.style.display = "flex";
            overlay.classList.remove("active");
            customCursor.style.opacity = "1";
        }, 1000);
    }
});


// =====================
// CUSTOM CURSOR BEHAVIOR
// =====================

// Follow and rotate with mouse position
document.addEventListener("mousemove", e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    customCursor.style.top = `${mouseY}px`;
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
});

// Hide cursor when leaving window or blurring
document.addEventListener("mouseleave", () => {
    customCursor.style.transition = "none";
    customCursor.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
    customCursor.style.transition = "none";
    customCursor.style.opacity = "1";
});
window.addEventListener("blur", () => {
    customCursor.style.transition = "none";
    customCursor.style.opacity = "0";
});
window.addEventListener("focus", () => {
    customCursor.style.transition = "none";
    customCursor.style.opacity = "1";
});


// =====================
// ROTATING WORDS
// =====================

const rotatingWords = ["Innovative", "Creative", "Visionary", "Analytical"];
let rotatingIndex = 0;
const rotatingSpan = document.getElementById("rotating-word");

rotatingSpan.textContent = rotatingWords[rotatingIndex];

function rotateWords() {
    rotatingSpan.style.opacity = '0';
    setTimeout(() => {
        rotatingIndex = (rotatingIndex + 1) % rotatingWords.length;
        rotatingSpan.textContent = rotatingWords[rotatingIndex];
        rotatingSpan.style.opacity = '1';
    }, 400);
}

// Start word rotation after 5s
setTimeout(() => {
    setInterval(rotateWords, 5000);
}, 5000);


// =====================
// PAGE NAVIGATION SETUP
// =====================

const pageSections = {
    home: document.getElementById("title-content"),
    about: document.getElementById("about-page"),
    skills: document.getElementById("skills-page"),
    builds: document.getElementById("builds-page"),
    projects: document.getElementById("projects-page"),
    photos: document.getElementById("photos-page"),
    contact: document.getElementById("contact-page"),
};

const navLinks = document.querySelectorAll("#sidebar nav a");
const currentPageDisplay = document.getElementById("current-page");
const videoContainer = document.getElementById("video-container");


// =====================
// PHOTO CAROUSEL
// =====================

const photoCarousel = document.getElementById("photo-carousel");
const carouselDotsContainer = document.getElementById("carousel-dots");
const photoSlides = document.querySelectorAll(".photo-slide");
const photosPerPage = 3;
let currentSlideIndex = 0;
let carouselInterval = null;
let isHoveringPhoto = false;

// Create dots for carousel navigation
const totalGroups = Math.ceil(photoSlides.length / photosPerPage);
for (let i = 0; i < totalGroups; i++) {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.dataset.index = i;
    carouselDotsContainer.appendChild(dot);
    dot.addEventListener("click", () => {
        currentSlideIndex = i;
        updateCarousel();
        resetCarouselTimer();
    });
}

// Scroll carousel to correct slide
function updateCarousel() {
    const scrollLeft = currentSlideIndex * (photoSlides[0].offsetWidth + 24) * photosPerPage;
    photoCarousel.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
    });

    const dots = carouselDotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentSlideIndex].classList.add("active");
}

// Autoplay logic
function startCarousel() {
    if (carouselInterval) return;
    carouselInterval = setInterval(() => {
        if (!isHoveringPhoto) {
            currentSlideIndex = (currentSlideIndex + 1) % totalGroups;
            updateCarousel();
        }
    }, 6000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function resetCarouselTimer() {
    stopCarousel();
    startCarousel();
}

// Pause carousel on hover
photoSlides.forEach(slide => {
    slide.addEventListener("mouseenter", () => {
        isHoveringPhoto = true;
        stopCarousel();
    });
    slide.addEventListener("mouseleave", () => {
        isHoveringPhoto = false;
        startCarousel();
    });
});

function onPhotosPageShow() {
    updateCarousel();
    startCarousel();
    carouselDotsContainer.style.display = "flex";
}

function onPhotosPageHide() {
    stopCarousel();
    carouselDotsContainer.style.display = "none";
}


// =====================
// NAVIGATION LINK CLICK EVENTS
// =====================

navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const pages = ["home", "about", "skills", "builds", "projects", "photos", "contact"];
        const pageKey = pages[index];
        showPage(pageKey);

        const pageNumber = (index + 1).toString().padStart(2, "0");
        currentPageDisplay.style.opacity = "0";
        setTimeout(() => {
            currentPageDisplay.textContent = `Page: ${pageNumber}`;
            currentPageDisplay.style.opacity = "1";
        }, 200);
    });
});


// =====================
// PAGE DISPLAY LOGIC
// =====================

function showPage(pageKey) {
    // Show only the selected page
    Object.entries(pageSections).forEach(([key, section]) => {
        section.style.display = key === pageKey ? "block" : "none";
    });

    // Background video only visible on home
    if (pageKey === "home") {
        videoContainer.style.display = "block";
        videoContainer.style.zIndex = "0";
    } else {
        videoContainer.style.display = "none";
    }

    // Special triggers for other pages
    if (pageKey === "photos") onPhotosPageShow();
    else onPhotosPageHide();

    if (pageKey === "skills") animateSkillBars();

    if (pageKey === "contact") {
        customCursor.style.transition = "none";
        customCursor.style.opacity = "1";
    }
}

// Animate skill bars from 0% to their set widths
function animateSkillBars() {
    const fills = document.querySelectorAll("#skills-page .skill-fill");
    fills.forEach(fill => {
        fill.style.transition = "none";
        fill.style.width = "0%";
        fill.offsetWidth; // force reflow
        fill.style.transition = "width 1.2s ease-in-out";
        const targetWidth = fill.getAttribute("data-fill");
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 50);
    });
}

// Show home page on initial load
showPage("home");


// =====================
// CONTACT PAGE CURSOR LOGIC
// =====================

const contactImages = document.querySelectorAll("#contact-images a, #contact-images img");
contactImages.forEach(img => {
    img.style.cursor = "pointer";
});

// Custom cursor adapts on contact page depending on hovered element
function updateCursorOnContactPage(e) {
    const target = e.target;

    if (
        target.closest("#contact-images a") ||
        target.closest("#contact-images img") ||
        target.closest(".carousel-dot")
    ) {
        customCursor.style.opacity = "0";
        document.body.style.cursor = "pointer";
        customCursor.style.transition = "none";
    } else if (target.closest("#sidebar")) {
        customCursor.style.opacity = "1";
        document.body.style.cursor = "none";
        customCursor.style.transition = "none";
    } else if (
        target.closest("#contact-form input") ||
        target.closest("#contact-form textarea") ||
        target.closest("#contact-form button")
    ) {
        customCursor.style.opacity = "0";
        document.body.style.cursor = "text";
        customCursor.style.transition = "none";
    } else {
        customCursor.style.opacity = "1";
        document.body.style.cursor = "none";
        customCursor.style.transition = "none";
    }
}

// Update cursor only when on contact page
document.addEventListener("mousemove", e => {
    if (pageSections.contact.style.display === "block") {
        updateCursorOnContactPage(e);
    }
});
