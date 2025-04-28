/**
 * Debounce function to limit how often a processor-intensive task can be run
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Clear console to make debugging easier
  console.clear();
  console.log("Initializing application...");

  // Make debounce available globally to fix reference errors
  window.debounce = debounce;

  // Update timestamps with the specified date
  updateDateTimeElements();

  // Initialize blockchain loading animation
  initializeLoadingAnimation();

  // smooth‐scroll to sections for navbar links
  document.querySelectorAll(".nav-menu a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // redirect "Connect" button to login page
  document
    .querySelectorAll(".navbar-connect, a.connect-button")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // allow natural <a href="login.html"> behavior if it’s an <a>
        if (btn.tagName.toLowerCase() === "button") {
          window.location.href = "login.html";
        }
      });
    });

  // ensure hero‐section Connect link actually navigates
  document.querySelectorAll("a.hero-connect").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = el.href;
    });
  });

  // make sure navbar Connect always redirects
  document.querySelectorAll("a.navbar-connect").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = el.href;
    });
  });

  // Remove duplicate/old mobile nav logic if present
  // Ensure hamburger toggles .active, not .open
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navMenu = document.getElementById("navMenu");
  if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      hamburgerMenu.classList.toggle("active");
    });
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        navMenu.classList.remove("active");
        hamburgerMenu.classList.remove("active");
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbar = document.getElementById("navbar");
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const offset = window.innerWidth < 768 ? 80 : 20;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight -
            offset;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      });
    });
    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("active")) {
        const isClickInside =
          navMenu.contains(e.target) || hamburgerMenu.contains(e.target);
        if (!isClickInside) {
          navMenu.classList.remove("active");
          hamburgerMenu.classList.remove("active");
        }
      }
    });
  }
});

/**
 * Updates timestamp elements with the specified date
 */
function updateDateTimeElements() {
  const currentDateTime = "2025-04-11 18:05:30";
  const dateTimeElements = document.querySelectorAll(
    "#currentDateTime, #footerDateTime"
  );
  dateTimeElements.forEach((element) => {
    if (element) {
      element.textContent = currentDateTime;
    }
  });
}

/**
 * Sets up and handles the blockchain loading animation
 */
function initializeLoadingAnimation() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingStatus = document.getElementById("loadingStatus");

  // Add a "Skip" button
  addSkipButton(loadingOverlay);

  if (loadingOverlay && loadingStatus) {
    setupLoadingSequence(loadingOverlay, loadingStatus);
  } else {
    // Shorter fallback timeout if elements don't exist
    handleMissingLoadingElements(loadingOverlay);
  }
}

/**
 * Adds a skip button to the loading overlay
 */
function addSkipButton(loadingOverlay) {
  if (!loadingOverlay) return;

  const skipButton = document.createElement("button");
  skipButton.textContent = "Skip";
  skipButton.style.position = "absolute";
  skipButton.style.bottom = "20px";
  skipButton.style.right = "20px";
  skipButton.style.background = "var(--accent-color)";
  skipButton.style.color = "white";
  skipButton.style.border = "none";
  skipButton.style.padding = "8px 15px";
  skipButton.style.borderRadius = "4px";
  skipButton.style.cursor = "pointer";
  skipButton.style.zIndex = "9999";
  skipButton.onclick = function () {
    removeLoadingOverlay(loadingOverlay);
  };
  loadingOverlay.appendChild(skipButton);
}

/**
 * Removes the loading overlay
 */
function removeLoadingOverlay(loadingOverlay) {
  if (!loadingOverlay) {
    loadingOverlay = document.getElementById("loadingOverlay");
    if (!loadingOverlay) {
      return; // Exit the function if overlay doesn't exist
    }
  }

  loadingOverlay.classList.add("fade-out");

  // Ensure the overlay is removed even if the transition fails
  setTimeout(completeLoadingOverlayRemoval, 400, loadingOverlay);
}

// Extracted function to reduce nesting
function completeLoadingOverlayRemoval(loadingOverlay) {
  loadingOverlay?.parentNode?.removeChild(loadingOverlay);

  // Backup removal method if the first attempt fails
  if (document.getElementById("loadingOverlay")) {
    const overlay = document.getElementById("loadingOverlay");
    overlay?.parentNode?.removeChild(overlay);
  }
}

/**
 * Handles case when loading elements are missing
 */
function handleMissingLoadingElements(loadingOverlay) {
  setTimeout(function () {
    loadingOverlay?.classList.add("fade-out");
    setTimeout(() => {
      loadingOverlay?.parentNode?.removeChild(loadingOverlay);
    }, 400);
  }, 1500);
}

/**
 * Sets up the loading sequence with messages and animations
 */
function setupLoadingSequence(loadingOverlay, loadingStatus) {
  // Energy blockchain-related loading messages
  const loadingMessages = [
    "Initializing Energy Blockchain",
    "Connecting to Energy Grid Nodes",
    "Verifying Clean Energy Blocks",
    "Syncing Renewable Transactions",
    "Loading SEVER Energy Network",
  ];

  let messageIndex = 0;

  // Create function to update loading status messages
  function updateLoadingStatus() {
    try {
      loadingStatus.style.opacity = "0";

      setTimeout(() => {
        loadingStatus.textContent = loadingMessages[messageIndex];
        loadingStatus.style.opacity = "1";
        messageIndex++;

        if (messageIndex < loadingMessages.length) {
          setTimeout(updateLoadingStatus, 800);
        }
      }, 200);
    } catch (error) {
      // If any error happens during animation, ensure we still remove the overlay
      removeLoadingOverlay(loadingOverlay);
    }
  }

  try {
    // Start the loading sequence
    createLoadingParticles(loadingOverlay); // Pass loadingOverlay as argument
    setTimeout(updateLoadingStatus, 200);
    animateBlockchainStats();

    // Use multiple methods to ensure the loading screen gets removed
    // Decreased timeout to half for faster animation
    setTimeout(() => removeLoadingOverlay(loadingOverlay), 3500);

    // Backup timeout with a slightly shorter delay
    setTimeout(function () {
      if (document.getElementById("loadingOverlay")) {
        removeLoadingOverlay(loadingOverlay);
      }
    }, 4000);
  } catch (error) {
    // If any error occurs during initialization, remove the loading screen immediately
    removeLoadingOverlay(loadingOverlay);
    console.error("Loading animation error:", error);
  }
}

// Define all initialization functions outside the main event handler
function initThemeToggle() {
  /* ===== Theme Toggle and Color Management ===== */
  const themeToggleBtn = document.getElementById("themeToggle");
  const profileThemeToggleBtn = document.getElementById("profileThemeToggle");

  function toggleTheme() {
    // Alternative implementation with same result
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }

    // Add visual feedback
    const themeIcon = document.querySelector(
      "#themeToggle i, #profileThemeToggle i"
    );
    if (themeIcon) {
      themeIcon.classList.add("fa-spin");
      setTimeout(() => {
        themeIcon.classList.remove("fa-spin");
      }, 300);
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  if (profileThemeToggleBtn) {
    profileThemeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Check saved theme preference on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

function initThemeSelector() {
  /* ===== Floating Theme Selector ===== */
  const toggleThemePanel = document.getElementById("toggleThemePanel");
  const themePanel = document.getElementById("themePanel");
  const colorOptions = document.querySelectorAll(".color-option");

  if (toggleThemePanel && themePanel) {
    toggleThemePanel.addEventListener("click", function () {
      themePanel.classList.toggle("active");
      this.style.transform = themePanel.classList.contains("active")
        ? "rotate(180deg)"
        : "rotate(0deg)";
    });

    colorOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const theme = this.getAttribute("data-theme");

        // Remove all theme classes
        document.body.classList.remove(
          "theme-cyan",
          "theme-green",
          "theme-purple",
          "theme-orange"
        );

        // Add selected theme class
        document.body.classList.add(`theme-${theme}`);

        // Save preference
        localStorage.setItem("accentColor", theme);

        // Animation feedback
        this.style.transform = "scale(1.2)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 300);
      });
    });
  }

  // Load saved color theme
  const savedColor = localStorage.getItem("accentColor");
  if (savedColor) {
    document.body.classList.remove(
      "theme-cyan",
      "theme-green",
      "theme-purple",
      "theme-orange"
    );
    document.body.classList.add(`theme-${savedColor}`);
  } else {
    document.body.classList.add("theme-cyan"); // Default theme
  }
}

function initMobileNavigation() {
  /* ===== Mobile Navigation ===== */
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerMenu && navMenu) {
    // Mobile navigation code...
  }
}

function initCustomCursor() {
  /* ===== Custom Cursor (Desktop Only) ===== */
  const customCursor = document.getElementById("customCursor");
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  if (!isMobile && customCursor) {
    document.addEventListener(
      "mousemove",
      (e) => {
        requestAnimationFrame(() => {
          customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
      },
      { passive: true }
    );
  }
}

function initMobileTickerControls() {
  /* ===== Mobile Ticker Controls ===== */
  const pauseTickerBtn = document.getElementById("pauseTicker");
  const playTickerBtn = document.getElementById("playTicker");
  const tickerContent = document.querySelector(".ticker-content");

  if (pauseTickerBtn && playTickerBtn && tickerContent) {
    // Ticker controls code...
  }
}

function initGlitchOverlay() {
  /* ===== Glitch Overlay and Text Animation ===== */
  const glitchTextEl = document.getElementById("glitchText");

  if (glitchTextEl) {
    const textToType = "BLOCKCHAIN SYNC: ACTIVE";
    glitchTextEl.setAttribute("data-text", textToType);

    let currentIndex = 0;
    function typeNextChar() {
      if (currentIndex < textToType.length) {
        glitchTextEl.textContent += textToType[currentIndex];
        glitchTextEl.setAttribute("data-text", glitchTextEl.textContent);
        currentIndex++;
        setTimeout(typeNextChar, 100 + Math.random() * 80);
      } else {
        // Add blinking cursor effect after typing
        glitchTextEl.classList.add("typing-done");

        // Start fading out the overlay after typing
        setTimeout(() => {
          const glitchOverlay = document.getElementById("glitchOverlay");
          if (glitchOverlay) {
            glitchOverlay.classList.add("fade-out");

            setTimeout(() => {
              if (glitchOverlay.parentNode) {
                glitchOverlay.parentNode.removeChild(glitchOverlay);
              }
            }, 500);
          }
        }, 600);
      }
    }

    // Start typing after a short delay
    setTimeout(typeNextChar, 500);
  } else {
    // If the text element doesn't exist, remove the overlay after a timeout
    setTimeout(function () {
      const glitchOverlay = document.getElementById("glitchOverlay");
      if (glitchOverlay?.parentNode) {
        glitchOverlay.classList.add("fade-out");
        setTimeout(() => {
          glitchOverlay.parentNode.removeChild(glitchOverlay);
        }, 500);
      }
    }, 2000);
  }
}

// Main event listener with reduced complexity
document.addEventListener("DOMContentLoaded", function () {
  // Initialize core functionality
  initializeCore();
});

// Break down initialization into smaller functions to reduce complexity
function initializeCore() {
  // Call all initialization functions
  initThemeToggle();
  initThemeSelector();
  initMobileNavigation();
  initCustomCursor();
  initMobileTickerControls();
  initGlitchOverlay();
  initializeBlockchainExplorer();
  injectAdditionalStyles();
  initializeTimeline();
  initializeAIAssistant();
  initConnectButtons();

  // Setup additional functionality
  setupNavigation();
  updateDateTimeElements();
  initializeLoadingAnimation();
}

// Separate function for navigation functionality
function setupNavigation() {
  /* ===== Navigation Functionality ===== */
  // Get navigation elements
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navMenu = document.getElementById("navMenu");

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.getElementById(targetId.substring(1));
      if (targetElement) {
        const navbarHeight = document.getElementById("navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          if (hamburgerMenu) hamburgerMenu.classList.remove("active");
        }
      }
    });
  });

  // Highlight active section based on scroll position
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".nav-menu a").forEach((link) => {
          link.classList.remove("active");
        });

        const activeLink = document.querySelector(
          `.nav-menu a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  // Listen for scroll events to highlight the active section
  window.addEventListener("scroll", debounce(highlightActiveSection, 100));

  // Initial call to highlight active section
  highlightActiveSection();

  /* ===== Improved Mobile Navigation ===== */
  if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener("click", function (e) {
      e.preventDefault();
      navMenu.classList.toggle("active");
      hamburgerMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        hamburgerMenu.classList.remove("active");
      }
    });

    // Close menu when clicking on menu items
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        hamburgerMenu.classList.remove("active");
      });
    });
  }

  // smooth‐scroll to sections for navbar links
  document.querySelectorAll(".nav-menu a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // redirect "Connect" button to login page
  document
    .querySelectorAll(".navbar-connect, a.connect-button")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // allow natural <a href="login.html"> behavior if it’s an <a>
        if (btn.tagName.toLowerCase() === "button") {
          window.location.href = "login.html";
        }
      });
    });
}

// Function that was flagged as unused but is actually used in initializeLoadingAnimation
function animateBlockchainStats() {
  const statCounters = document.querySelectorAll(".stat-counter");

  statCounters.forEach((counter) => {
    const finalValue = counter.textContent;
    counter.textContent = "0";

    setTimeout(() => {
      // Simple counter animation
      const finalNum = parseInt(finalValue.replace(/,/g, ""));
      const increment = Math.floor(finalNum / 20);
      let currentNum = 0;

      const interval = setInterval(() => {
        currentNum += increment;
        if (currentNum >= finalNum) {
          currentNum = finalNum;
          clearInterval(interval);
        }
        counter.textContent = currentNum.toLocaleString();
      }, 100);
    }, 1000);
  });
}

// Function that was flagged as unused but is called in setupLoadingSequence
function createLoadingParticles() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.zIndex = "-1";

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .particle {
      fill: var(--accent-color);
      opacity: 0.5;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(var(--x), var(--y)); }
    }
    @keyframes energyFlow {
      0% { transform: translateY(0) scale(0.8); opacity: 0.3; }
      50% { transform: translateY(-30px) scale(1.2); opacity: 0.7; }
      100% { transform: translateY(-60px) scale(0.8); opacity: 0.1; }
    }
  `;
  svg.appendChild(style);

  // Create standard particles
  for (let i = 0; i < 15; i++) {
    // reduced count for faster loading
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const r = Math.random() * 3 + 1;

    circle.setAttribute("class", "particle");
    circle.setAttribute("cx", `${x}%`);
    circle.setAttribute("cy", `${y}%`);
    circle.setAttribute("r", r);

    // Random movement
    const xMove = (Math.random() - 0.5) * 20;
    const yMove = (Math.random() - 0.5) * 20;
    circle.style.setProperty("--x", `${xMove}px`);
    circle.style.setProperty("--y", `${yMove}px`);

    // Animation (faster)
    const duration = 1.5 + Math.random() * 2; // Reduced animation time
    const delay = Math.random() * 0.8; // Shorter delay
    circle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    svg.appendChild(circle);
  }

  // Create energy trading visuals (arrows, energy symbols)
  for (let i = 0; i < 8; i++) {
    // Create energy arrows representing transactions
    const energyArrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    const x = 20 + Math.random() * 60; // Keep arrows more centered
    const y = 70 + Math.random() * 20; // Start from bottom area

    // Simple upward arrow path
    energyArrow.setAttribute("d", `M${x},${y} l-5,10 h3 v7 h4 v-7 h3 z`);
    energyArrow.setAttribute("class", "energy-particle");

    // Animation for flowing upward - faster to fit in 5 seconds
    const duration = 2 + Math.random() * 1.5; // Shorter duration
    const delay = Math.random() * 1.5; // Shorter delay
    energyArrow.style.animation = `energyFlow ${duration}s ease-in-out ${delay}s infinite`;

    svg.appendChild(energyArrow);
  }

  loadingOverlay.appendChild(svg);
}

// Fix for the unused body variable - use computedStyle directly
function getThemeColor() {
  // Force browser to calculate latest CSS variables by requesting layout
  document.body.getBoundingClientRect();

  // Get the computed style after forcing layout recalculation
  const computedStyle = getComputedStyle(document.documentElement);
  const accentColor = computedStyle.getPropertyValue("--accent-color").trim();

  // Add debug info for theme color detection
  console.log("Theme color detected: " + accentColor);

  // Store the most recently detected color in a global for cross-browser consistency
  window.lastDetectedThemeColor = accentColor || window.lastDetectedThemeColor;

  // Hard-coded fallbacks for better cross-browser compatibility
  if (!accentColor || accentColor === "") {
    // Use a default color based on current body classes
    const bodyClasses = document.body.classList;

    // Log all active classes for debugging
    console.log("Body classes for color detection: ", Array.from(bodyClasses));

    // Use hard-coded colors that don't rely on CSS variable processing
    if (bodyClasses.contains("theme-neon")) return "#0cff53";
    if (bodyClasses.contains("theme-purple")) return "#cc00ff";
    if (bodyClasses.contains("theme-blue")) return "#0055ff";
    if (bodyClasses.contains("theme-red")) return "#ff0055";
    if (bodyClasses.contains("theme-white")) return "#ffffff";
    if (bodyClasses.contains("theme-gold")) return "#ffd700";
    if (bodyClasses.contains("theme-green")) return "#00ff80";
    if (bodyClasses.contains("theme-orange")) return "#ff8000";

    // Default cyan if no theme is found
    return "#00ffff";
  }

  return accentColor;
}

/* ===== Theme Toggle and Color Management ===== */
// Theme toggle button (light/dark mode)
const themeToggleBtn = document.getElementById("themeToggle");
const profileThemeToggleBtn = document.getElementById("profileThemeToggle");

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const isLightMode = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLightMode ? "light" : "dark");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

if (profileThemeToggleBtn) {
  profileThemeToggleBtn.addEventListener("click", toggleTheme);
}

// Check saved theme preference on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

/* ===== Floating Theme Selector ===== */
const toggleThemePanel = document.getElementById("toggleThemePanel");
const themePanel = document.getElementById("themePanel");
const colorOptions = document.querySelectorAll(".color-option");

if (toggleThemePanel && themePanel) {
  toggleThemePanel.addEventListener("click", function () {
    themePanel.classList.toggle("active");
    this.style.transform = themePanel.classList.contains("active")
      ? "rotate(180deg)"
      : "rotate(0deg)";
  });

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme");

      // Remove all theme classes
      document.body.classList.remove(
        "theme-cyan",
        "theme-green",
        "theme-purple",
        "theme-orange"
      );

      // Add selected theme class
      document.body.classList.add(`theme-${theme}`);

      // Save preference
      localStorage.setItem("accentColor", theme);

      // Animation feedback
      this.style.transform = "scale(1.2)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 300);
    });
  });
}

// Load saved color theme
const savedColor = localStorage.getItem("accentColor");
if (savedColor) {
  document.body.classList.remove(
    "theme-cyan",
    "theme-green",
    "theme-purple",
    "theme-orange"
  );
  document.body.classList.add(`theme-${savedColor}`);
} else {
  document.body.classList.add("theme-cyan"); // Default theme
}

/* ===== Mobile Navigation ===== */
const hamburgerMenu = document.getElementById("hamburgerMenu");
const navMenu = document.getElementById("navMenu");
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

if (hamburgerMenu && navMenu) {
  hamburgerMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    navMenu.classList.toggle("active");
    hamburgerMenu.classList.toggle("active");
  });

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      navMenu.classList.remove("active");
      hamburgerMenu.classList.remove("active");

      if (targetElement) {
        const navbar = document.getElementById("navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const offset = isMobile ? 80 : 20;

        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight -
          offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (navMenu.classList.contains("active")) {
      const isClickInside =
        navMenu.contains(e.target) || hamburgerMenu.contains(e.target);
      if (!isClickInside) {
        navMenu.classList.remove("active");
        hamburgerMenu.classList.remove("active");
      }
    }
  });
}

/* ===== Custom Cursor (Desktop Only) ===== */
const customCursor = document.getElementById("customCursor");
if (!isMobile && customCursor) {
  document.addEventListener(
    "mousemove",
    (e) => {
      requestAnimationFrame(() => {
        customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    },
    { passive: true }
  );
}

/* ===== Mobile Ticker Controls ===== */
const pauseTickerBtn = document.getElementById("pauseTicker");
const playTickerBtn = document.getElementById("playTicker");
const tickerContent = document.querySelector(".ticker-content");

if (pauseTickerBtn && playTickerBtn && tickerContent) {
  pauseTickerBtn.addEventListener("click", function () {
    tickerContent.classList.add("paused");
    pauseTickerBtn.style.display = "none";
    playTickerBtn.style.display = "block";
  });

  playTickerBtn.addEventListener("click", function () {
    tickerContent.classList.remove("paused");
    playTickerBtn.style.display = "none";
    pauseTickerBtn.style.display = "block";
  });
}

/* ===== Glitch Overlay and Text Animation ===== */
const glitchOverlay = document.getElementById("glitchOverlay");
const glitchTextEl = document.getElementById("glitchText");

if (glitchTextEl) {
  const textToType = "BLOCKCHAIN SYNC: ACTIVE";
  glitchTextEl.setAttribute("data-text", textToType);

  let currentIndex = 0;
  function typeNextChar() {
    if (currentIndex < textToType.length) {
      glitchTextEl.textContent += textToType[currentIndex];
      glitchTextEl.setAttribute("data-text", glitchTextEl.textContent);
      currentIndex++;
      setTimeout(typeNextChar, 100 + Math.random() * 80);
    } else {
      // Add blinking cursor effect after typing
      glitchTextEl.classList.add("typing-done");

      // Start fading out the overlay after typing
      setTimeout(() => {
        if (glitchOverlay) {
          glitchOverlay.classList.add("fade-out");

          setTimeout(() => {
            if (glitchOverlay.parentNode) {
              glitchOverlay.parentNode.removeChild(glitchOverlay);
            }
          }, 500);
        }
      }, 600);
    }
  }

  // Start typing after a short delay
  setTimeout(typeNextChar, 500);
} else {
  // If the text element doesn't exist, remove the overlay after a timeout
  setTimeout(removeGlitchOverlayWithDelay, 2000);
}

// Extracted function to reduce nesting
function removeGlitchOverlayWithDelay() {
  glitchOverlay?.classList.add("fade-out");
  setTimeout(() => {
    glitchOverlay?.parentNode?.removeChild(glitchOverlay);
  }, 500);
}

/* ===== Initialize Energy Dashboard Charts ===== */
if (document.getElementById("energyProductionChart")) {
  const energyProductionCtx = document
    .getElementById("energyProductionChart")
    .getContext("2d");
  const energyProductionChart = new Chart(energyProductionCtx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Solar",
          data: [120, 180, 240, 290, 350, 410, 430, 380, 320, 260, 190, 140],
          borderColor: "rgba(0, 255, 255, 1)",
          backgroundColor: "rgba(0, 255, 255, 0.2)",
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Wind",
          data: [350, 320, 280, 220, 180, 150, 140, 170, 210, 280, 320, 340],
          borderColor: "rgba(0, 255, 0, 1)",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Hydro",
          data: [200, 220, 240, 260, 230, 180, 160, 150, 170, 190, 210, 195],
          borderColor: "rgba(200, 0, 255, 1)",
          backgroundColor: "rgba(200, 0, 255, 0.2)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: document.body.classList.contains("light-mode")
              ? "#333"
              : "#ddd",
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: document.body.classList.contains("light-mode")
              ? "#333"
              : "#ddd",
          },
        },
      },
    },
  });

  // Network Activity Chart
  const networkActivityCtx = document
    .getElementById("networkActivityChart")
    .getContext("2d");
  const networkActivityChart = new Chart(networkActivityCtx, {
    type: "bar",
    data: {
      labels: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
      datasets: [
        {
          label: "Transactions",
          data: [124, 85, 97, 210, 325, 408, 380, 230],
          backgroundColor: "rgba(0, 255, 255, 0.6)",
          borderColor: "rgba(0, 255, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: document.body.classList.contains("light-mode")
              ? "#333"
              : "#ddd",
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: document.body.classList.contains("light-mode")
              ? "#333"
              : "#ddd",
          },
        },
      },
    },
  });

  // Refresh dashboard data button
  const refreshDashboardBtn = document.getElementById("refreshDashboard");
  if (refreshDashboardBtn) {
    refreshDashboardBtn.addEventListener("click", function () {
      // Add refreshing animation
      this.classList.add("refreshing");

      // Set a timeout to update the dashboard after a delay
      setTimeout(() => {
        updateEnergyProductionChart(energyProductionChart);

        // Update network activity chart
        updateNetworkActivityChart(networkActivityChart);

        // Update real-time stats
        updateRealTimeStats();

        // Remove refreshing animation
        this.classList.remove("refreshing");
      }, 800);
    });
  }

  // Extracted function to reduce nesting
  function updateEnergyProductionChart(chart) {
    // Generate new random data
    const newSolarData = chart.data.datasets[0].data.map(
      (value) => value * (0.95 + Math.random() * 0.1)
    );
    const newWindData = chart.data.datasets[1].data.map(
      (value) => value * (0.95 + Math.random() * 0.1)
    );
    const newHydroData = chart.data.datasets[2].data.map(
      (value) => value * (0.95 + Math.random() * 0.1)
    );

    // Update the charts
    chart.data.datasets[0].data = newSolarData;
    chart.data.datasets[1].data = newWindData;
    chart.data.datasets[2].data = newHydroData;
    chart.update();
  }

  // Extracted function to reduce nesting
  function updateNetworkActivityChart(chart) {
    chart.data.datasets[0].data = chart.data.datasets[0].data.map((value) =>
      Math.max(50, Math.min(500, value * (0.9 + Math.random() * 0.2)))
    );
    chart.update();
  }

  // Extracted function to reduce nesting
  function updateRealTimeStats() {
    document.getElementById("activeNodes").textContent =
      Math.floor(Math.random() * 50) + 220;
    document.getElementById("transactionRate").textContent =
      (Math.random() * 10 + 20).toFixed(1) + "/s";
    document.getElementById("networkHealth").textContent =
      (Math.random() * 3 + 96).toFixed(1) + "%";
  }

  // View mode toggle buttons
  const viewModeButtons = document.querySelectorAll(".toggle-btn[data-view]");
  if (viewModeButtons.length > 0) {
    viewModeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        viewModeButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Update chart data based on selected view mode
        const viewMode = this.getAttribute("data-view");
        updateChartsForViewMode(
          viewMode,
          energyProductionChart,
          networkActivityChart
        );
      });
    });
  }

  // Function to update charts based on view mode
  function updateChartsForViewMode(viewMode, productionChart, activityChart) {
    // Simulate loading state
    document.querySelectorAll(".chart-container").forEach((container) => {
      container.classList.add("loading");
    });

    setTimeout(() => {
      switch (viewMode) {
        case "realtime":
          productionChart.data.labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          activityChart.data.labels = [
            "00:00",
            "03:00",
            "06:00",
            "09:00",
            "12:00",
            "15:00",
            "18:00",
            "21:00",
          ];
          break;
        case "day":
          productionChart.data.labels = [
            "12AM",
            "3AM",
            "6AM",
            "9AM",
            "12PM",
            "3PM",
            "6PM",
            "9PM",
          ];
          activityChart.data.labels = [
            "12AM",
            "3AM",
            "6AM",
            "9AM",
            "12PM",
            "3PM",
            "6PM",
            "9PM",
          ];
          break;
        case "week":
          productionChart.data.labels = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ];
          activityChart.data.labels = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ];
          break;
        case "month":
          productionChart.data.labels = [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ];
          activityChart.data.labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          break;
      }

      // Generate new random data based on view mode
      productionChart.data.datasets.forEach((dataset) => {
        dataset.data = Array(productionChart.data.labels.length)
          .fill(0)
          .map(() => Math.floor(Math.random() * 300) + 100);
      });

      activityChart.data.datasets[0].data = Array(
        activityChart.data.labels.length
      )
        .fill(0)
        .map(() => Math.floor(Math.random() * 300) + 100);

      // Update charts
      productionChart.update();
      activityChart.update();

      // Remove loading state
      document.querySelectorAll(".chart-container").forEach((container) => {
        container.classList.remove("loading");
      });
    }, 600);
  }
}

/* ===== Energy Calculator ===== */
const energyCalculatorForm = document.getElementById("energyCalculatorForm");
if (energyCalculatorForm) {
  // Budget range slider
  const budgetRange = document.getElementById("budgetRange");
  const budgetRangeValue = document.getElementById("budgetRangeValue");

  if (budgetRange && budgetRangeValue) {
    budgetRange.addEventListener("input", function () {
      budgetRangeValue.textContent = "€" + this.value;
    });
  }

  // Calculate button
  const calculateButton = document.getElementById("calculateButton");
  if (calculateButton) {
    calculateButton.addEventListener("click", function () {
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
      this.disabled = true;

      // Simulate calculation delay
      setTimeout(() => {
        calculateEnergyNeeds();
        this.innerHTML =
          '<i class="fas fa-calculator"></i> Calculate Solutions';
        this.disabled = false;
      }, 1000);
    });
  }

  // Function to calculate energy needs and display results
  function calculateEnergyNeeds() {
    // Get form values
    const propertyType = document.getElementById("propertyType").value;
    const propertySize = parseFloat(
      document.getElementById("propertySize").value
    );
    const occupants = parseInt(document.getElementById("occupants").value);
    const region = document.getElementById("region").value;

    // Get selected appliances
    const applianceCheckboxes = document.querySelectorAll(
      'input[name="appliances"]:checked'
    );
    const appliances = Array.from(applianceCheckboxes).map((cb) => cb.value);

    // Calculate base energy consumption based on property type and size
    let baseConsumption = 0;
    switch (propertyType) {
      case "apartment":
        baseConsumption = propertySize * 25;
        break;
      case "house":
        baseConsumption = propertySize * 35;
        break;
      case "office":
        baseConsumption = propertySize * 80;
        break;
      case "commercial":
        baseConsumption = propertySize * 120;
        break;
    }

    // Add consumption for occupants
    baseConsumption += occupants * 500;

    // Adjust for region
    const regionFactors = {
      north: 1.2, // Higher heating needs
      central: 1.0, // Base case
      south: 0.8, // Lower heating, higher cooling
      eastern: 1.1, // Slightly higher energy needs
    };

    baseConsumption *= regionFactors[region] || 1.0;

    // Add for appliances
    const applianceConsumption = {
      heating: 2000,
      aircon: 1500,
      pool: 3000,
      ev: 3500,
    };

    let totalApplianceConsumption = 0;
    appliances.forEach((app) => {
      totalApplianceConsumption += applianceConsumption[app] || 0;
    });

    // Calculate total consumption
    const totalConsumption = Math.round(
      baseConsumption + totalApplianceConsumption
    );

    // Update the displayed consumption
    const consumptionElement = document.getElementById("estimatedConsumption");
    if (consumptionElement) {
      // Animate the change
      const oldValue = parseInt(
        consumptionElement.textContent.replace(/,/g, "")
      );
      animateNumberChange(consumptionElement, oldValue, totalConsumption);
    }

    // Create breakdown chart
    createConsumptionChart(baseConsumption, appliances, applianceConsumption);

    // Update recommended solutions
    updateRecommendedSolutions(
      totalConsumption,
      propertyType,
      region,
      appliances
    );
  }

  // Function to animate number change
  function animateNumberChange(element, startValue, endValue) {
    const duration = 1000; // ms
    const framesPerSecond = 60;
    const totalFrames = (duration / 1000) * framesPerSecond;
    const valueChange = endValue - startValue;
    let currentFrame = 0;

    const animate = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const currentValue = Math.round(startValue + valueChange * progress);

      element.textContent = currentValue.toLocaleString();

      if (currentFrame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // Function to create consumption breakdown chart
  function createConsumptionChart(
    baseConsumption,
    appliances,
    applianceConsumption
  ) {
    const canvasElement = document.getElementById("consumptionBreakdownChart");
    if (!canvasElement) return;

    // Clean up existing chart
    if (window.consumptionChart) {
      window.consumptionChart.destroy();
    }

    // Prepare data
    const chartData = {
      labels: ["Base Consumption"],
      datasets: [
        {
          data: [baseConsumption],
          backgroundColor: ["rgba(0, 255, 255, 0.7)"],
          borderColor: ["rgba(0, 255, 255, 1)"],
          borderWidth: 1,
        },
      ],
    };

    // Add appliance data if selected
    appliances.forEach((app) => {
      const consumption = applianceConsumption[app] || 0;
      if (consumption > 0) {
        let label, color;

        switch (app) {
          case "heating":
            label = "Electric Heating";
            color = "rgba(255, 99, 132, 0.7)";
            break;
          case "aircon":
            label = "Air Conditioning";
            color = "rgba(54, 162, 235, 0.7)";
            break;
          case "pool":
            label = "Swimming Pool";
            color = "rgba(75, 192, 192, 0.7)";
            break;
          case "ev":
            label = "Electric Vehicle";
            color = "rgba(153, 102, 255, 0.7)";
            break;
          default:
            label = "Other";
            color = "rgba(255, 159, 64, 0.7)";
        }

        chartData.labels.push(label);
        chartData.datasets[0].data.push(consumption);
        chartData.datasets[0].backgroundColor.push(color);
        chartData.datasets[0].borderColor.push(color.replace("0.7", "1"));
      }
    });

    // Create chart
    const ctx = canvasElement.getContext("2d");
    window.consumptionChart = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "left",
            labels: {
              color: document.body.classList.contains("light-mode")
                ? "#333"
                : "#ddd",
              font: {
                family: '"Source Code Pro", monospace',
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value.toLocaleString()} kWh (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  // Function to update recommended solutions
  function updateRecommendedSolutions(
    consumption,
    propertyType,
    region,
    appliances
  ) {
    const solutionsContainer = document.querySelector(".recommended-solutions");
    if (!solutionsContainer) return;

    // Calculate solar system size
    let solarSize = consumption / 1000; // rough kWp needed

    // Adjust for region efficiency
    const regionEfficiency = {
      north: 0.8,
      central: 1.0,
      south: 1.2,
      eastern: 0.9,
    };

    solarSize = solarSize / (regionEfficiency[region] || 1.0);

    // Battery size calculation
    const batterySize = Math.round((consumption * 0.7) / 365); // daily consumption * storage factor

    // Update solar card
    const solarCard = solutionsContainer.querySelector(
      ".solution-card.primary-solution"
    );
    if (solarCard) {
      const solarDetails = solarCard.querySelectorAll(".detail-value");

      // System size
      solarDetails[0].textContent = `${solarSize.toFixed(1)} kWp`;

      // Production
      const annualProduction = Math.round(
        solarSize * 1100 * (regionEfficiency[region] || 1.0)
      );
      solarDetails[1].textContent = `${annualProduction.toLocaleString()} kWh/year`;

      // Cost
      const solarCostLow = Math.round(solarSize * 1200);
      const solarCostHigh = Math.round(solarSize * 1400);
      solarDetails[2].textContent = `€${solarCostLow.toLocaleString()} - €${solarCostHigh.toLocaleString()}`;

      // Payback
      let payback;
      switch (region) {
        case "south":
          payback = "4-6";
          break;
        case "central":
          payback = "6-8";
          break;
        case "eastern":
          payback = "7-9";
          break;
        case "north":
          payback = "8-10";
          break;
        default:
          payback = "6-8";
      }
      solarDetails[3].textContent = `${payback} years`;

      // Match percentage
      const matchElement = solarCard.querySelector(".solution-match");
      if (matchElement) {
        const matchPercentage = Math.min(
          98,
          Math.max(60, Math.round((annualProduction / consumption) * 100))
        );
        matchElement.textContent = `${matchPercentage}% Match`;
      }
    }

    // Update battery card
    const batteryCard =
      solutionsContainer.querySelectorAll(".solution-card")[1];
    if (batteryCard) {
      const batteryDetails = batteryCard.querySelectorAll(".detail-value");

      // Battery size
      batteryDetails[0].textContent = `${Math.round(batterySize)} kWh`;

      // Self-consumption increase
      batteryDetails[1].textContent = `+${Math.min(
        65,
        Math.max(25, Math.round(batterySize * 3.5))
      )}%`;

      // Cost
      const batteryCostLow = Math.round(batterySize * 700);
      const batteryCostHigh = Math.round(batterySize * 850);
      batteryDetails[2].textContent = `€${batteryCostLow.toLocaleString()} - €${batteryCostHigh.toLocaleString()}`;

      // Match percentage
      const matchElement = batteryCard.querySelector(".solution-match");
      if (matchElement) {
        const batteryMatch = Math.min(
          95,
          Math.max(70, Math.round(batterySize * 5))
        );
        matchElement.textContent = `${batteryMatch}% Match`;
      }
    }
  }
}

/* ===== 3D Blockchain Explorer ===== */
function initializeBlockchainExplorer() {
  console.log("Setting up blockchain explorer initialization...");

  // Get all required DOM elements
  const blockchainContainer = document.getElementById("blockchain3DContainer");
  const blockInfoPanel = document.getElementById("blockInfoPanel");
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  const resetViewBtn = document.getElementById("resetView");
  const visualizationMode = document.getElementById("visualizationMode");
  const timeRangeSlider = document.getElementById("timeRangeSlider");
  const timeRangeValue = document.getElementById("timeRangeValue");

  // Log which elements were found for debugging
  console.log("DOM elements found:", {
    blockchainContainer: !!blockchainContainer,
    blockInfoPanel: !!blockInfoPanel,
    zoomInBtn: !!zoomInBtn,
    zoomOutBtn: !!zoomOutBtn,
    resetViewBtn: !!resetViewBtn,
    visualizationMode: !!visualizationMode,
    timeRangeSlider: !!timeRangeSlider,
    timeRangeValue: !!timeRangeValue,
  });

  if (blockchainContainer) {
    // Check if Three.js is loaded by testing actual functionality
    if (typeof THREE === "undefined") {
      console.error(
        "Three.js library not loaded! Loading fallback visualization."
      );
      blockchainContainer.innerHTML = `
        <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;gap:20px;">
          <div style="color:var(--accent-color);font-size:2rem;"><i class="fas fa-exclamation-triangle"></i></div>
          <div>3D visualization could not be loaded.</div>
          <div>Please check if Three.js library is correctly loaded.</div>
        </div>
      `;
      return; // Exit the function to prevent further errors
    }

    console.log("THREE.js detected, initializing 3D explorer");

    // Scene setup variables
    let scene, camera, renderer, controls;
    let blockObjects = [];
    let currentBlockSelected = null;

    // Function to get CSS variable values with fallback
    function getCSSVariable(varName, fallback) {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      return value || fallback;
    }

    // Get theme color as THREE.Color
    function getThemeColor() {
      // Get accent color from CSS variable
      const accentColor = getCSSVariable("--accent-color", "#00ffff");
      console.log("Using theme color:", accentColor);
      return new THREE.Color(accentColor);
    }

    // Initialize the THREE.js scene
    function initThreeScene() {
      try {
        console.log("Creating THREE.js scene");

        // Create scene with pure black background
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Create camera with improved field of view
        camera = new THREE.PerspectiveCamera(
          65, // increased field of view for better perspective
          blockchainContainer.clientWidth / blockchainContainer.clientHeight,
          0.1,
          1000
        );
        camera.position.set(0, 5, 50); // Better initial position

        // Create renderer with improved settings
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(
          blockchainContainer.clientWidth,
          blockchainContainer.clientHeight
        );
        renderer.setPixelRatio(window.devicePixelRatio);

        // Clear container before adding new canvas
        while (blockchainContainer.firstChild) {
          blockchainContainer.removeChild(blockchainContainer.firstChild);
        }

        blockchainContainer.appendChild(renderer.domElement);

        // Get theme color
        const themeColor = getThemeColor();

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        // More dramatic directional light
        const directionalLight = new THREE.DirectionalLight(themeColor, 1.0);
        directionalLight.position.set(5, 15, 15);
        scene.add(directionalLight);

        // Add multiple point lights with theme color for enhanced glow effect
        const pointLight = new THREE.PointLight(themeColor, 1.2, 100);
        pointLight.position.set(0, 0, 20);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(themeColor, 0.8, 50);
        pointLight2.position.set(-15, -10, 10);
        scene.add(pointLight2);

        // Add orbit controls
        console.log("Setting up OrbitControls");
        try {
          if (typeof THREE.OrbitControls === "function") {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 20;
            controls.maxDistance = 100;
            console.log("OrbitControls created successfully");
          } else {
            console.warn(
              "THREE.OrbitControls not available, using basic camera controls"
            );
            // Simple camera rotation as fallback
          }
        } catch (controlError) {
          console.error("Failed to create OrbitControls:", controlError);
        }

        // Watch for theme changes
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
              // Update colors when theme changes
              updateVisualizationColors();
            }
          });
        });
        observer.observe(document.body, { attributes: true });

        return true;
      } catch (error) {
        console.error("Error creating THREE.js scene:", error);
        return false;
      }
    }

    // Helper function to update a single block's color
    function updateBlockColor(block, themeColor) {
      if (!block.material) return;

      if (block.userData?.type) {
        // If it's a typed block, update its color based on type
        const type = block.userData.type;
        if (type === "normal") {
          block.material.color = new THREE.Color(0x777777);
        } else {
          // For special types, use a variant of the theme color
          block.material.color = themeColor.clone();

          // Adjust hue slightly based on type
          if (type === "wind") {
            block.material.color.offsetHSL(0.1, 0, 0);
          } else if (type === "hydro") {
            block.material.color.offsetHSL(-0.1, 0, 0);
          }
          // Solar uses the base theme color
        }
      } else {
        // For non-typed objects, use theme color directly
        block.material.color = themeColor;
      }

      // Update emissive colors for glow effect
      if (block.material.emissive) {
        block.material.emissive.set(themeColor).multiplyScalar(0.2);
      }
    }

    // Update colors in the visualization when theme changes
    function updateVisualizationColors() {
      if (!scene) return;

      const themeColor = getThemeColor();
      console.log("Updating visualization colors to:", themeColor);

      // Update all lights
      scene.children.forEach((child) => {
        if (child instanceof THREE.Light && child.color) {
          if (child instanceof THREE.AmbientLight) {
            // Keep ambient light white
            return;
          }
          child.color = themeColor;
        }
      });

      // Update all block objects
      blockObjects.forEach((block) => updateBlockColor(block, themeColor));

      // Update connections
      scene.children.forEach((child) => {
        if (child instanceof THREE.Line && child.material) {
          child.material.color = themeColor;
        }
      });
    }

    // Colors for different block types based on theme
    function getBlockColors() {
      const themeColor = getThemeColor();
      const solarColor = themeColor.clone();
      const windColor = themeColor.clone().offsetHSL(0.1, 0, 0);
      const hydroColor = themeColor.clone().offsetHSL(-0.1, 0, 0);

      return {
        solar: solarColor.getHex(),
        wind: windColor.getHex(),
        hydro: hydroColor.getHex(),
        normal: 0x777777,
      };
    }

    // Create blocks visualization
    function createBlocksVisualization(blockCount) {
      // Get colors based on current theme
      const blockColors = getBlockColors();

      // Block types for random generation
      const blockTypes = ["solar", "wind", "hydro", "normal"];

      for (let i = 0; i < blockCount; i++) {
        const blockType =
          blockTypes[Math.floor(Math.random() * blockTypes.length)];
        const blockColor = blockColors[blockType];

        // Create block geometry and material
        const geometry = new THREE.BoxGeometry(4, 3, 2);
        const material = new THREE.MeshPhongMaterial({
          color: blockColor,
          transparent: true,
          opacity: 0.8,
          specular: 0xffffff,
          shininess: 50,
          emissive: new THREE.Color(blockColor).multiplyScalar(0.2),
        });

        // Create mesh
        const block = new THREE.Mesh(geometry, material);

        // Position blocks in a spiral pattern
        const angle = i * 0.2;
        const radius = 15 + i * 0.05;
        block.position.x = Math.cos(angle) * radius;
        block.position.z = Math.sin(angle) * radius;
        block.position.y = i * 0.5 - blockCount * 0.25;

        block.userData = {
          id: 3487621 - i,
          type: blockType,
          transactions: Math.floor(Math.random() * 50) + 1,
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
          size: (Math.random() * 2 + 0.5).toFixed(2) + " MB",
          hash: "0x" + Math.random().toString(16).substring(2, 12) + "...",
          energyVolume: Math.floor(Math.random() * 500) + 50 + " kWh",
        };

        scene.add(block);
        blockObjects.push(block);

        // Create connection to previous block with theme color
        if (i > 0) {
          const themeColor = getThemeColor();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: themeColor,
            opacity: 0.7,
            transparent: true,
          });

          const points = [];
          points.push(blockObjects[i - 1].position);
          points.push(block.position);

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        }
      }
    }

    // Create network visualization with themed colors
    function createNetworkVisualization(nodeCount) {
      const themeColor = getThemeColor();

      for (let i = 0; i < nodeCount; i++) {
        const radius = i === 0 ? 2 : 1; // First node is larger
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const nodeType = i % 4;

        // Create colors based on theme with subtle variations
        const colors = [
          themeColor.clone().getHex(),
          themeColor.clone().offsetHSL(0.1, 0, 0).getHex(),
          themeColor.clone().offsetHSL(-0.1, 0, 0).getHex(),
          0x777777,
        ];

        const material = new THREE.MeshPhongMaterial({
          color: colors[nodeType],
          transparent: true,
          opacity: 0.8,
          specular: 0xffffff,
          shininess: 60,
          emissive: new THREE.Color(colors[nodeType]).multiplyScalar(0.15),
        });

        const node = new THREE.Mesh(geometry, material);

        // Position nodes randomly in 3D space
        const spreadFactor = 30;
        node.position.set(
          (Math.random() - 0.5) * spreadFactor,
          (Math.random() - 0.5) * spreadFactor,
          (Math.random() - 0.5) * spreadFactor
        );

        node.userData = {
          type: ["solar", "wind", "hydro", "normal"][nodeType],
        };

        scene.add(node);
        blockObjects.push(node);

        if (i > 0) {
          // Connect to random previous node
          const randomPrev = Math.floor(Math.random() * i);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x333333,
            opacity: 0.3,
            transparent: true,
          });

          const points = [];
          points.push(node.position);
          points.push(blockObjects[randomPrev].position);

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        }
      }
    }

    // Create energy flow visualization with theme colors
    function createEnergyFlowVisualization(nodeCount) {
      const themeColor = getThemeColor();

      // Create producer nodes (top) and consumer nodes (bottom)
      const producers = [];
      const consumers = [];

      // Add producer and consumer nodes
      for (let i = 0; i < Math.floor(nodeCount / 2); i++) {
        // Create producer with a color based on theme
        const producerColor = new THREE.Color()
          .copy(themeColor)
          .offsetHSL(i * 0.1, 0, 0);
        const producerGeometry = new THREE.BoxGeometry(2, 2, 2);
        const producerMaterial = new THREE.MeshPhongMaterial({
          color: producerColor,
          transparent: true,
          opacity: 0.8,
          emissive: producerColor.clone().multiplyScalar(0.2),
        });

        const producer = new THREE.Mesh(producerGeometry, producerMaterial);
        producer.position.set(
          (Math.random() - 0.5) * 30,
          15,
          (Math.random() - 0.5) * 30
        );

        producer.userData = { type: "producer" };
        producers.push(producer);
        blockObjects.push(producer);
        scene.add(producer);

        // Create consumer
        const consumerGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const consumerMaterial = new THREE.MeshPhongMaterial({
          color: 0x777777,
          transparent: true,
          opacity: 0.7,
        });

        const consumer = new THREE.Mesh(consumerGeometry, consumerMaterial);
        consumer.position.set(
          (Math.random() - 0.5) * 30,
          -15,
          (Math.random() - 0.5) * 30
        );

        consumer.userData = { type: "consumer" };
        consumers.push(consumer);
        blockObjects.push(consumer);
        scene.add(consumer);
      }

      // Create connections between producers and consumers
      producers.forEach((producer, i) => {
        const connections = Math.floor(Math.random() * 2) + 1;

        for (let c = 0; c < connections && c < consumers.length; c++) {
          const consumer = consumers[(i + c) % consumers.length];

          // Create energy flow line using producer's color
          const lineMaterial = new THREE.LineBasicMaterial({
            color: producer.material.color,
            opacity: 0.4,
            transparent: true,
          });

          const points = [];
          points.push(producer.position);
          points.push(consumer.position);

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);

          // Add energy particles flowing along the line
          for (let p = 0; p < 3; p++) {
            const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
              color: producer.material.color,
              transparent: true,
              opacity: 0.8,
              emissive: producer.material.color,
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            // Position along the line
            const progress = p / 3;
            particle.position.lerpVectors(
              producer.position,
              consumer.position,
              progress
            );

            // Add animation data
            particle.userData = {
              start: producer.position.clone(),
              end: consumer.position.clone(),
              speed: 0.005 + Math.random() * 0.005,
              progress: progress,
              type: "particle",
            };

            scene.add(particle);
            blockObjects.push(particle);
          }
        }
      });
    }

    // Create visualization based on mode
    function createBlockchainVisualization() {
      console.log("Creating blockchain visualization");

      // Clear existing objects
      blockObjects.forEach((block) => {
        scene.remove(block);
      });

      blockObjects = [];

      // Remove any lines/connections
      scene.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          scene.remove(child);
        }
      });

      // Get current mode
      const mode = visualizationMode ? visualizationMode.value : "blocks";
      const blockCount = timeRangeSlider
        ? parseInt(timeRangeSlider.value) || 20
        : 20;

      console.log(
        `Creating visualization in "${mode}" mode with ${blockCount} blocks/nodes`
      );

      // Create visualization based on mode
      switch (mode) {
        case "blocks":
          createBlocksVisualization(blockCount);
          break;
        case "network":
          createNetworkVisualization(blockCount);
          break;
        case "energy":
          createEnergyFlowVisualization(blockCount);
          break;
        default:
          createBlocksVisualization(blockCount);
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Update controls if they exist
      if (controls && typeof controls.update === "function") {
        controls.update();
      }

      // Enhanced rotation and animation for blocks and particles
      if (blockObjects) {
        blockObjects.forEach((object) => {
          // Only process objects with geometry of specific types
          if (
            object.geometry &&
            (object.geometry.type === "BoxGeometry" ||
              object.geometry.type === "SphereGeometry")
          ) {
            // Apply standard geometry object processing
            processGeometryObject(object);

            // Handle particle animation if applicable
            if (object.userData?.type === "particle") {
              processParticleAnimation(object);
            }
          }
        });
      }

      // Render the scene
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    // Refactor: Extract processing for different object types into separate functions
    function processGeometryObject(object) {
      // Different rotation speeds for different axes
      object.rotation.y += 0.006;

      // Type-specific rotation
      if (object.userData?.type === "producer") {
        object.rotation.x += 0.003;
      } else if (object.userData?.type === "consumer") {
        object.rotation.z += 0.002;
      }

      // Apply pulsing effect for objects with type
      if (object.userData?.type) {
        const pulseScale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        object.scale.set(pulseScale, pulseScale, pulseScale);
      }
    }

    // Process particle animation separately
    function processParticleAnimation(object) {
      if (object.userData?.type !== "particle") return;

      object.userData.progress += object.userData.speed * 1.2;
      handleParticleProgress(object);
      animateParticlePath(object);
    }

    // Handle particle progress
    function handleParticleProgress(object) {
      if (object.userData.progress > 1) {
        object.userData.progress = 0;

        // Randomize particle opacity for twinkling effect
        if (object.material) {
          object.material.opacity = 0.5 + Math.random() * 0.5;
        }
      }
    }

    // Handle curved path animation for particles
    function animateParticlePath(object) {
      const progress = object.userData.progress;
      const midPoint = new THREE.Vector3().lerpVectors(
        object.userData.start,
        object.userData.end,
        0.5
      );
      midPoint.y += 3 * Math.sin(progress * Math.PI);

      if (progress < 0.5) {
        object.position.lerpVectors(
          object.userData.start,
          midPoint,
          progress * 2
        );
      } else {
        object.position.lerpVectors(
          midPoint,
          object.userData.end,
          (progress - 0.5) * 2
        );
      }
    }

    // Window resize handler - extracted to reduce nesting
    function onWindowResize() {
      updateCanvasSize();
    }

    // Extracted function to handle canvas resizing
    function updateCanvasSize() {
      if (
        camera?.aspect !== undefined &&
        typeof camera?.updateProjectionMatrix === "function" &&
        typeof renderer?.setSize === "function" &&
        blockchainContainer?.clientWidth &&
        blockchainContainer?.clientHeight
      ) {
        camera.aspect =
          blockchainContainer.clientWidth / blockchainContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          blockchainContainer.clientWidth,
          blockchainContainer.clientHeight
        );
      }
    }

    // Setup control buttons
    function setupExplorerControls() {
      console.log("Setting up explorer control buttons");

      // Setup mode selector
      if (visualizationMode) {
        console.log("Adding event listener to visualization mode selector");
        visualizationMode.addEventListener("change", function () {
          console.log("Mode changed to:", this.value);
          createBlockchainVisualization();
        });
      }

      // Setup time range slider
      if (timeRangeSlider && timeRangeValue) {
        console.log("Adding event listeners to time range slider");

        timeRangeSlider.addEventListener("input", function () {
          console.log("Slider input:", this.value);
          timeRangeValue.textContent = `Last ${this.value} Blocks`;
        });

        timeRangeSlider.addEventListener("change", function () {
          console.log(
            "Slider changed, recreating visualization with",
            this.value,
            "blocks"
          );
          createBlockchainVisualization();
        });
      }

      // Setup zoom buttons with better logging
      if (zoomInBtn) {
        console.log("Adding event listener to zoom in button");
        zoomInBtn.addEventListener("click", function () {
          console.log("Zoom in clicked");
          if (camera?.position) {
            console.log("Current z position:", camera.position.z);
            if (camera.position.z > 20) {
              camera.position.z -= 10;
              console.log("New z position:", camera.position.z);
            }
          } else {
            console.error("Camera not available for zoom");
          }
        });
      }

      if (zoomOutBtn) {
        console.log("Adding event listener to zoom out button");
        zoomOutBtn.addEventListener("click", function () {
          console.log("Zoom out clicked");
          if (camera?.position) {
            console.log("Current z position:", camera.position.z);
            if (camera.position.z < 100) {
              camera.position.z += 10;
              console.log("New z position:", camera.position.z);
            }
          } else {
            console.error("Camera not available for zoom");
          }
        });
      }

      if (resetViewBtn) {
        console.log("Adding event listener to reset view button");
        resetViewBtn.addEventListener("click", function () {
          console.log("Reset view clicked");
          if (camera?.position) {
            camera.position.set(0, 0, 50);
            console.log("Camera position reset to (0, 0, 50)");

            if (controls?.target) {
              controls.target.set(0, 0, 0);
              controls.update();
              console.log("OrbitControls target reset");
            }
          } else {
            console.error("Camera not available for reset");
          }
        });
      }

      // Setup block selection
      renderer?.domElement?.addEventListener("click", onBlockClick);
    }

    // Calculate mouse position in normalized device coordinates
    function getMousePosition(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return new THREE.Vector2(mouseX, mouseY);
    }

    // Reset highlighting on the previously selected object
    function resetHighlight() {
      if (currentBlockSelected) {
        currentBlockSelected.material.emissive.setHex(0x000000);
      }
    }

    // Highlight the selected object
    function highlightObject(object) {
      resetHighlight();
      object.material.emissive.setHex(0x333333);
      currentBlockSelected = object;
    }

    // Generate basic object info HTML
    function generateObjectInfoHTML(data) {
      let html = `<h3>${data.id ? "Block #" + data.id : "Node"}</h3>`;

      Object.keys(data).forEach((key) => {
        if (
          key !== "id" &&
          key !== "start" &&
          key !== "end" &&
          key !== "progress" &&
          key !== "speed"
        ) {
          html += `
          <div class="info-row">
            <span class="info-label">${
              key.charAt(0).toUpperCase() + key.slice(1)
            }:</span>
            <span class="info-value">${data[key]}</span>
          </div>`;
        }
      });

      return html;
    }

    // Generate transaction items HTML
    function generateTransactionsHTML(blockType) {
      let html = `<div class="transaction-list">`;

      for (let i = 0; i < 3; i++) {
        html += `
        <div class="tx-item">
          <span class="tx-hash">0x${Math.random()
            .toString(16)
            .substring(2, 6)}...</span>
          <span class="tx-type">${blockType}</span>
          <span class="tx-amount">${
            Math.floor(Math.random() * 100) + 5
          } kWh</span>
        </div>`;
      }

      html += `</div>`;
      return html;
    }

    // Update the info panel with object data
    function updateInfoPanel(object) {
      if (!blockInfoPanel || !object.userData) return;

      const data = object.userData;
      let html = generateObjectInfoHTML(data);

      // Add transaction items if this is a block with a recognized type
      if (
        data.type &&
        ["solar", "wind", "hydro", "normal"].includes(data.type)
      ) {
        html += generateTransactionsHTML(data.type);
      }

      blockInfoPanel.innerHTML = html;
      blockInfoPanel.style.display = "block";
    }

    // Handle no selection case
    function handleNoSelection() {
      resetHighlight();
      currentBlockSelected = null;

      if (blockInfoPanel) {
        blockInfoPanel.style.display = "none";
      }
    }

    // Handle block click with reduced complexity
    function onBlockClick(event) {
      // Get mouse position and set up raycaster
      const mouse = getMousePosition(event);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Find intersected objects
      const intersects = raycaster.intersectObjects(blockObjects);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        highlightObject(selectedObject);
        updateInfoPanel(selectedObject);
      } else {
        handleNoSelection();
      }
    }

    // Start everything
    function start() {
      console.log("Starting blockchain explorer");

      // Initialize scene
      const sceneInitialized = initThreeScene();

      if (sceneInitialized) {
        // Create visualization
        createBlockchainVisualization();

        // Start animation loop
        animate();

        // Add event listeners
        window.addEventListener("resize", onWindowResize);
        setupExplorerControls();

        console.log("Blockchain explorer started successfully");
      } else {
        console.error("Failed to initialize blockchain explorer scene");
        blockchainContainer.innerHTML = `
          <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;gap:20px;">
            <div style="color:var(--accent-color);font-size:2rem;"><i class="fas fa-exclamation-triangle"></i></div>
            <div>Failed to initialize 3D scene.</div>
            <div>Please check your browser console for errors.</div>
          </div>
        `;
      }
    }

    // Start the explorer after a short delay to ensure DOM is fully ready
    setTimeout(start, 100);
  }
}

// Initialize blockchain explorer when document is ready
initializeBlockchainExplorer();

/* ===== Inject Additional CSS Styles ===== */
function injectAdditionalStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    body.light-mode .action-btn {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .action-btn:hover {
      background: var(--accent-color);
      color: #000;
    }
    
    .response-content {
      font-size: 0.9rem;
      line-height: 1.7;
    }
    
    .response-content code {
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 5px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.85rem;
    }
    
    body.light-mode .response-content code {
      background: rgba(0, 0, 0, 0.1);
    }
    
    .response-content pre.code-block {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 0.85rem;
      margin: 15px 0;
    }
    
    body.light-mode .response-content pre.code-block {
      background: rgba(0, 0, 0, 0.1);
    }
    
    .placeholder-text {
      opacity: 0.5;
      text-align: center;
      margin-top: 50px;
    }
    
    .thinking {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 50px;
    }
    
    .thinking .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-color);
      animation: dotPulse 1.5s infinite;
    }
    
    .thinking .dot:nth-child(2) {
      animation-delay: 0.5s;
    }
    
    .thinking .dot:nth-child(3) {
      animation-delay: 1s;
    }
    
    /* Contact Section */
    .contact-container {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 30px;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .contact-card {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 20px;
      box-shadow: var(--shadow);
    }
    
    body.light-mode .contact-card {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .contact-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      gap: 10px;
    }
    
    .contact-header i {
      color: var(--accent-color);
      font-size: 1.5rem;
    }
    
    .contact-header h3 {
      color: var(--accent-color);
      margin-bottom: 0;
    }
    
    .contact-details {
      margin-left: 10px;
    }
    
    .detail-item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .detail-item i {
      color: var(--accent-color);
      width: 20px;
      text-align: center;
    }
    
    .social-connections h3 {
      color: var(--accent-color);
      margin-bottom: 15px;
    }
    
    .social-icons {
      display: flex;
      gap: 15px;
    }
    
    .social-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-color);
      transition: all 0.3s ease;
    }
    
    body.light-mode .social-icon {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .social-icon:hover {
      transform: translateY(-5px);
      background: var(--accent-color);
      color: #000;
    }
    
    .contact-form-container {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 30px;
      box-shadow: var(--shadow);
    }
    
    body.light-mode .contact-form-container {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .submit-btn {
      width: 100%;
      padding: 12px;
      background: var(--accent-color);
      color: #000;
      font-weight: bold;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .submit-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    /* Footer */
    #siteFooter {
      position: relative;
      z-index: 10;
      background: rgba(0, 0, 0, 0.3);
      padding: 40px 0 20px;
      margin-top: 100px;
      border-top: 1px solid var(--accent-color);
    }
    
    body.light-mode #siteFooter {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 40px;
    }
    
    .footer-brand {
      margin-bottom: 20px;
    }
    
    .footer-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    
    .accent-dot {
      color: var(--accent-color);
    }
    
    .footer-tagline {
      font-style: italic;
      opacity: 0.7;
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
    
    .link-column h4 {
      color: var(--accent-color);
      margin-bottom: 15px;
    }
    
    .link-column ul {
      list-style: none;
    }
    
    .link-column li {
      margin-bottom: 8px;
    }
    
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 0.8rem;
    }
    
    .copyright {
      opacity: 0.7;
    }
    
    .footer-info {
      display: flex;
      gap: 20px;
      opacity: 0.7;
    }
    
    .user-name {
      color: var(--accent-color);
    }
    
    /* Animations */
    @keyframes pulseVerified {
      0% {
        stroke-width: 2;
        stroke-opacity: 0.8;
      }
      50% {
        stroke-width: 3;
        stroke-opacity: 1;
      }
      100% {
        stroke-width: 2;
        stroke-opacity: 0.8;
      }
    }
    
    @keyframes tickerAnimation {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    
    @keyframes glitchShake {
      0% {
        transform: translate(0);
      }
      20% {
        transform: translate(-2px, 2px);
      }
      40% {
        transform: translate(-2px, -2px);
      }
      60% {
        transform: translate(2px, 2px);
      }
      80% {
        transform: translate(2px, -2px);
      }
      100% {
        transform: translate(0);
      }
    }
    
    @keyframes glitchEffect {
      0% {
        text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
      }
      15% {
        text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      50% {
        text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      100% {
        text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
    }
    
    @keyframes glitchTop {
      0% {
        clip-path: rect(0, 9999px, 2px, 0);
        transform: translate(0, -3px);
      }
      100% {
        clip-path: rect(0, 9999px, 2px, 0);
        transform: translate(0, -6px);
      }
    }
    
    @keyframes glitchBottom {
      0% {
        clip-path: rect(0, 9999px, 2px, 0);
        transform: translate(0, 3px);
      }
      100% {
        clip-path: rect(0, 9999px, 2px, 0);
        transform: translate(0, 6px);
      }
    }
    
    @keyframes blinkCursor {
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes highlight {
      0% {
        background: rgba(var(--accent-color-rgb), 0.3);
      }
      100% {
        background: rgba(0, 0, 0, 0.2);
      }
    }
    
    @keyframes newBlockHighlight {
      0% {
        box-shadow: 0 0 20px var(--accent-color);
      }
      100% {
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
      }
    }
    
    @keyframes rotating {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes dotPulse {
      0%, 100% {
        opacity: 0.2;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }
    
    @keyframes pulse {
      0% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
      100% {
        opacity: 0.5;
        transform: scale(1);
      }
    }
    
    /* Responsive Design */
    @media screen and (max-width: 1200px) {
      .container {
        max-width: 95%;
      }
      
      .explorer-interface {
        grid-template-columns: 1fr;
      }
      
      .explorer-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .blockchain-stats {
        margin-top: 0;
      }
    }
    
    @media screen and (max-width: 991px) {
      .dashboard-container,
      .simulator-container, 
      .calculator-container,
      .assistant-interface {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    
      .footer-content {
        grid-template-columns: 1fr;
      }
    
      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .explorer-controls {
        grid-template-columns: 1fr;
      }
    }
    
    @media screen and (max-width: 768px) {
      .nav-container {
        justify-content: flex-start;
      }
      
      .hamburger-menu {
        display: block;
      }
      
      .nav-menu {
        position: fixed;
        top: 60px;
        right: -300px;
        width: 250px;
        background: var(--navbar-bg);
        backdrop-filter: blur(10px);
        height: calc(100vh - 60px);
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        transition: right 0.3s ease;
        z-index: 999;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
        gap: 15px;
      }
      
      .nav-menu.active {
        right: 0;
      }
      
      .profile-container {
        flex-direction: column;
        text-align: center;
      }
      
      .contact-container {
        grid-template-columns: 1fr;
      }
      
      .news-ticker {
        display: block;
      }
    
      .energy-sources {
        grid-template-columns: 1fr;
      }
    
      .footer-links {
        grid-template-columns: 1fr;
      }
    }
    
    @media screen and (max-width: 480px) {
      .timeline-node .node-content {
        width: 80%;
      }
      
      .timeline-node:nth-child(even) .node-content {
        margin-left: auto;
      }
      
      .timeline-node:nth-child(odd) .node-content {
        margin-left: auto;
      }
      
      .timeline-node:nth-child(even) .node-content::before {
        left: -10px;
        right: auto;
        border-right: 10px solid rgba(0, 0, 0, 0.2);
        border-left: none;
      }
      
      body.light-mode .timeline-node:nth-child(even) .node-content::before {
        border-right-color: rgba(0, 0, 0, 0.05);
      }
      
      .profile-stats {
        flex-direction: column;
        gap: 15px;
      }
      
      .energy-stats-banner {
        flex-direction: column;
        align-items: center;
      }
      
      .terminal-heading {
        font-size: 1.5rem;
      }
    }
  `;
  document.head.appendChild(styleElement);
}
// Move helper functions to module level to reduce nesting depth
function animateTimelineProgress(progress) {
  progress.style.height = "100%";
  progress.style.transition = "height 2s ease-out";
}

function animateNodeDot(dot) {
  dot.style.transform = "translateX(-50%) scale(1)";
}

function animateTimelineNode(node) {
  node.classList.add("animate");
  node.style.opacity = "1";
  node.style.transform = "translateY(0)";
  node.style.transition = "opacity 0.7s ease, transform 0.7s ease";

  // Animate the dot after the node appears
  const dot = node.querySelector(".node-dot");
  if (dot) {
    dot.style.transform = "translateX(-50%) scale(0)";
    setTimeout(animateNodeDot, 150, dot);
  }
}

function animateDot(dot) {
  dot.style.transform = "translateX(-50%) scale(0)";
  setTimeout(animateNodeDot, 150, dot);
}

function showNodeAndAnimate(node) {
  node.style.opacity = "1";
  node.style.transform = "translateY(0)";
  node.classList.add("animate");

  // Animate the dot
  const dot = node.querySelector(".node-dot");
  if (dot) {
    animateDot(dot);
  }
}

function showNodeDelayed(node, visibleNodeIndex) {
  const delay = 100 * visibleNodeIndex;
  setTimeout(showNodeAndAnimate, delay, node);
}

function removeButtonPulse(button) {
  button.classList.remove("button-pulse");
}

function processNodeFiltering(node, filter) {
  const categories = node.getAttribute("data-categories").split(",");

  if (filter === "all" || categories.includes(filter)) {
    // Show nodes that match the filter
    node.classList.remove("hidden");
    return true;
  } else {
    // Hide nodes that don't match
    node.classList.add("hidden");
    return false;
  }
}
function initializeTimeline() {
  const timelineNodes = document.querySelectorAll(".timeline-node");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const timelineAxis = document.querySelector(".timeline-axis");

  // Add animated progress to timeline axis
  if (timelineAxis) {
    timelineAxis.innerHTML = '<div class="timeline-progress"></div>';
    const progress = timelineAxis.querySelector(".timeline-progress");

    // Set initial height to 0 and animate it
    progress.style.height = "0%";
    setTimeout(animateTimelineProgress, 500, progress);
  }

  // Initial animation sequence for nodes - staggered entrance
  timelineNodes.forEach((node, index) => {
    // Set initial state - hidden
    node.style.opacity = "0";
    node.style.transform = "translateY(30px)";
    setTimeout(showNodeAndAnimate, 100 * index, node);
  });

  function processNodeAndScheduleAnimation(node, filter, visibleNodeIndex) {
    if (processNodeFiltering(node, filter)) {
      showNodeDelayed(node, visibleNodeIndex);
      return true;
    }
    return false;
  }

  function resetProgress(progress) {
    progress.style.height = "100%";
  }

  // Enhanced filter functionality with animations
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Visual feedback for the clicked button
      this.classList.add("button-pulse");
      setTimeout(removeButtonPulse, 500, this);

      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Counter for visible nodes (for staggered animations)
      let visibleNodeIndex = 0;

      // Filter timeline nodes with enhanced animations
      timelineNodes.forEach((node) => {
        if (processNodeAndScheduleAnimation(node, filter, visibleNodeIndex)) {
          visibleNodeIndex++;
        }
      });

      // Update timeline axis animation
      if (timelineAxis) {
        const progress = timelineAxis.querySelector(".timeline-progress");
        if (progress) {
          progress.style.height = "0%";
          setTimeout(resetProgress, 300, progress);
        }
      }
    });
  });

  function removePulseHighlight(element) {
    element.classList.remove("pulse-highlight");
  }

  function resetDotStyle(dot) {
    dot.style.transform = "translateX(-50%) scale(1)";
    dot.style.boxShadow = "0 0 10px var(--accent-color)";
  }

  function hideDetails(details) {
    details.style.display = "none";
  }

  function handleNodeClick(node) {
    const details = node.querySelector(".node-expanded-details");

    if (details.style.display === "none") {
      // Open details with animation
      details.style.display = "block";
      // Trigger reflow by getting dimensions (forces browser to recalculate layout)
      details.getBoundingClientRect();
      details.style.opacity = "1";
      details.style.transform = "translateY(0)";

      // Add a highlighting pulse to the node
      const nodeContent = node.querySelector(".node-content");
      nodeContent.classList.add("pulse-highlight");
      setTimeout(removePulseHighlight, 1000, nodeContent);

      // Animate dot
      const dot = node.querySelector(".node-dot");
      if (dot) {
        dot.style.transform = "translateX(-50%) scale(1.3)";
        dot.style.boxShadow = "0 0 15px var(--accent-color)";
        setTimeout(resetDotStyle, 500, dot);
      }
    } else {
      // Close details with animation
      details.style.opacity = "0";
      details.style.transform = "translateY(10px)";
      setTimeout(hideDetails, 500, details);
    }
  }

  function handleNodeMouseEnter(node) {
    const dot = node.querySelector(".node-dot");
    const nodeContent = node.querySelector(".node-content");

    if (dot) {
      dot.style.transform = "translateX(-50%) scale(1.2)";
      dot.style.transition = "transform 0.3s ease";
    }

    if (nodeContent) {
      nodeContent.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
      nodeContent.style.transition =
        "transform 0.3s ease, box-shadow 0.3s ease";
    }
  }

  function handleNodeMouseLeave(node) {
    const dot = node.querySelector(".node-dot");
    const nodeContent = node.querySelector(".node-content");

    if (
      dot &&
      node.querySelector(".node-expanded-details").style.display !== "block"
    ) {
      dot.style.transform = "translateX(-50%) scale(1)";
    }

    if (nodeContent) {
      nodeContent.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    }
  }

  function createDetailContainer(node) {
    const detailDiv = document.createElement("div");
    detailDiv.className = "node-expanded-details";
    detailDiv.style.display = "none";
    detailDiv.style.opacity = "0";
    detailDiv.style.transform = "translateY(10px)";
    detailDiv.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    // Get project name from the node
    const projectName = node.querySelector(".node-title").textContent;

    // Create detailed info based on project name
    const detailContent = getProjectDetail(projectName);
    detailDiv.innerHTML = detailContent;

    return detailDiv;
  }

  function handleCloseButtonClick(e, node) {
    e.stopPropagation(); // Prevent the node click event
    const details = node.querySelector(".node-expanded-details");

    details.style.opacity = "0";
    details.style.transform = "translateY(10px)";
    setTimeout(hideDetails, 500, details);
  }

  function setupCloseButton(node, detailDiv) {
    const closeButton = document.createElement("button");
    closeButton.className = "close-details-btn";
    closeButton.innerHTML =
      '<i class="fas fa-chevron-up"></i> Collapse Details';

    // Use bind to create a new function with the node parameter pre-set
    closeButton.addEventListener("click", function (e) {
      handleCloseButtonClick(e, node);
    });

    detailDiv.appendChild(closeButton);
  }

  // Setup nodes with event listeners
  timelineNodes.forEach((node) => {
    // Create expanded details container
    const detailDiv = createDetailContainer(node);
    setupCloseButton(node, detailDiv);
    node.querySelector(".node-content").appendChild(detailDiv);

    // Toggle details on click with improved animation
    node.addEventListener("click", function () {
      handleNodeClick(this);
    });

    node.addEventListener("mouseenter", function () {
      handleNodeMouseEnter(this);
    });

    node.addEventListener("mouseleave", function () {
      handleNodeMouseLeave(this);
    });
  });
}

// Function to get detailed information for each project with enhanced content
function getProjectDetail(projectName) {
  // Default structure for project details
  let detailContent = `
    <div class="detail-header">
      <h4>${projectName}</h4>
    </div>
    <div class="detail-description">
      <p>Detailed information about this project is being loaded...</p>
    </div>
  `;

  // Match project name to provide specific content
  switch (projectName) {
    case "Energy Systems Market Research":
      detailContent = `
        <div class="detail-header">
          <h4>Energy Systems Market Research</h4>
          <span class="detail-date">2012 - 2013</span>
        </div>
        <div class="detail-description">
          <p>Comprehensive analysis of renewable energy markets across Europe focusing on integration potential and market readiness for decentralized solutions.</p>
          <p>Research identified key growth areas in solar PV and decentralized grid technologies with significant potential for blockchain applications.</p>
        </div>
        <div class="detail-stats">
          <div class="stat-item"><span>14</span> Markets Analyzed</div>
          <div class="stat-item"><span>23%</span> Growth Potential</div>
          <div class="stat-item"><span>18</span> Technologies Assessed</div>
          <div class="stat-item"><span>4</span> Published Papers</div>
        </div>
      `;
      break;

    case "Smart Grid Integration Study":
      detailContent = `
        <div class="detail-header">
          <h4>Smart Grid Integration Study</h4>
          <span class="detail-date">2014 - 2015</span>
        </div>
        <div class="detail-description">
          <p>Research focused on optimizing the integration of renewable energy sources into existing power grids through smart technologies and predictive algorithms.</p>
        </div>
        <div class="milestone-list">
          <h5>Key Research Milestones</h5>
          <div class="milestone">
            <div class="milestone-date">March 2014</div>
            <div class="milestone-content">Initial grid impact assessment model</div>
          </div>
          <div class="milestone">
            <div class="milestone-date">August 2014</div>
            <div class="milestone-content">Algorithmic balancing prototype</div>
          </div>
          <div class="milestone">
            <div class="milestone-date">January 2015</div>
            <div class="milestone-content">Smart grid simulation model</div>
          </div>
          <div class="milestone">
            <div class="milestone-date">May 2015</div>
            <div class="milestone-content">Final research paper publication</div>
          </div>
        </div>
      `;
      break;

    case "Blockchain Energy Trading Concept":
      detailContent = `
        <div class="detail-header">
          <h4>Blockchain Energy Trading Concept</h4>
          <span class="detail-date">2016 - 2017</span>
        </div>
        <div class="detail-description">
          <p>Development of theoretical framework for blockchain-based peer-to-peer energy trading, with focus on transaction security, smart contracts, and grid compliance.</p>
        </div>
        <div class="detail-quote">
          "The decentralization of energy markets represents the single greatest opportunity for democratizing access to sustainable power while incentivizing renewable production."<br>- From the "Decentralizing Energy Markets" white paper
        </div>
        <div class="technical-specifications">
          <h5>Technical Framework</h5>
          <div class="spec-grid">
            <div class="spec-item">
              <div class="spec-label">Blockchain Platform</div>
              <div>Ethereum / Private Networks</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Smart Contract Standard</div>
              <div>ERC-20 / Custom</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Transaction Speed</div>
              <div>~15 TPS</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Consensus Mechanism</div>
              <div>PoA / PoS Hybrid</div>
            </div>
          </div>
        </div>
      `;
      break;

    case "SEVER Network Prototype":
      detailContent = `
        <div class="detail-header">
          <h4>SEVER Network Prototype</h4>
          <span class="detail-date">2018 - 2019</span>
        </div>
        <div class="detail-description">
          <p>First implementation of the decentralized energy trading platform, deployed in a residential neighborhood to enable peer-to-peer energy transactions using blockchain technology.</p>
        </div>
        <div class="implementation-phases">
          <h5>Implementation Phases</h5>
          <div class="phase">
            <div class="phase-indicator">Phase 1</div>
            <div class="phase-content">
              Smart meter integration
              <p>37 households equipped with blockchain-enabled smart meters</p>
            </div>
          </div>
          <div class="phase">
            <div class="phase-indicator">Phase 2</div>
            <div class="phase-content">
              Network deployment
              <p>Local energy trading network with self-executing smart contracts</p>
            </div>
          </div>
          <div class="phase">
            <div class="phase-indicator">Phase 3</div>
            <div class="phase-content">
              Platform testing
              <p>6-month trial period with real energy trading and financial settlements</p>
            </div>
          </div>
          <div class="phase">
            <div class="phase-indicator">Results</div>
            <div class="phase-content">
              Success metrics
              <p>28% cost savings for participants, 42% increased solar utilization</p>
            </div>
          </div>
        </div>
      `;
      break;

    // Add more cases for other projects

    default:
      detailContent = `
        <div class="detail-header">
          <h4>${projectName}</h4>
        </div>
        <div class="detail-description">
          <p>This project was part of the SEVER Network development roadmap, focusing on innovative blockchain and renewable energy integration solutions.</p>
          <p>More detailed information about this specific project will be available soon.</p>
        </div>
      `;
  }

  return detailContent;
}

/**
 * Initializes the AI assistant functionality
 */
function initializeAIAssistant() {
  console.log("Initializing AI Assistant...");

  const assistantInput = document.getElementById("assistantInput");
  const sendQueryBtn = document.getElementById("sendQuery");
  const voiceInputBtn = document.getElementById("voiceInputToggle");
  const conversationHistory = document.getElementById("conversationHistory");
  const aiResponseContent = document.getElementById("aiResponseContent");
  const querySuggestions = document.querySelectorAll(".query-suggestion");

  if (!assistantInput || !sendQueryBtn) {
    console.warn("AI Assistant elements not found");
    return;
  }

  // Process user query and display response
  function processQuery(query) {
    if (!query.trim()) return;

    // Add user message to conversation
    addMessage(query, "user");

    // Clear input field
    assistantInput.value = "";

    // Show thinking indicator
    const thinkingMessage = addMessage("Thinking...", "system");

    // Simulate AI processing time
    setTimeout(() => {
      // Remove thinking message
      if (thinkingMessage && thinkingMessage.parentNode) {
        thinkingMessage.parentNode.removeChild(thinkingMessage);
      }

      // Generate AI response based on query keywords
      const response = generateAIResponse(query);

      // Add AI response to conversation
      addMessage(response, "ai");

      // Update the AI analysis panel
      updateAIAnalysisPanel(query, response);

      // Scroll conversation to bottom
      scrollConversationToBottom();
    }, 1000);
  }

  // Add message to conversation history
  function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";

    // Get current time in HH:MM:SS format
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    timeDiv.textContent = `${hours}:${minutes}:${seconds}`;

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);

    if (conversationHistory) {
      conversationHistory.appendChild(messageDiv);
      scrollConversationToBottom();
    }

    return messageDiv;
  }

  // Scroll conversation to bottom
  function scrollConversationToBottom() {
    if (conversationHistory) {
      conversationHistory.scrollTop = conversationHistory.scrollHeight;
    }
  }

  // Update the AI analysis panel with response
  function updateAIAnalysisPanel(query, response) {
    if (aiResponseContent) {
      aiResponseContent.innerHTML = `
        <h4>Analysis for: "${query}"</h4>
        <p>${response}</p>
        <div class="analysis-metadata">
          <div class="metadata-item">
            <span class="metadata-label">Confidence:</span>
            <span class="metadata-value">92%</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Sources:</span>
            <span class="metadata-value">SEVER Network Database</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Processing time:</span>
            <span class="metadata-value">0.8s</span>
          </div>
        </div>
      `;
    }
  }

  // Generate AI response based on user query
  function generateAIResponse(query) {
    query = query.toLowerCase();

    if (
      query.includes("sever network") ||
      query.includes("how does") ||
      query.includes("function")
    ) {
      return "The SEVER Network is a decentralized energy trading platform that connects energy producers and consumers through blockchain technology. It enables peer-to-peer transactions without intermediaries, reduces costs by 15-30%, and ensures transparency through smart contracts. The network currently operates across 12 countries with over 500,000 connected users.";
    } else if (query.includes("roi") || query.includes("solar")) {
      return "Solar panel ROI typically ranges from 5-10 years depending on location, installation size, and energy costs. In Southern Europe, ROI can be as low as 4-6 years due to higher solar irradiance. The SEVER Network can improve ROI by an additional 18% through optimized energy trading capabilities.";
    } else if (query.includes("tokenization") || query.includes("token")) {
      return "Energy tokenization converts renewable energy into digital tokens on the blockchain. Each token represents a specific amount of energy produced (typically 1 kWh). These tokens can be traded, creating a liquid market for renewable energy. The SEVER Network uses ERC-compliant tokens with integrated certificates of origin for regulatory compliance.";
    } else {
      return (
        'Thank you for your question about "' +
        query +
        "\". The SEVER AI assistant can provide information about renewable energy systems, blockchain technology, energy markets, and the SEVER Network platform. Could you please specify which aspect you'd like to know more about?"
      );
    }
  }

  // Event listeners
  if (sendQueryBtn) {
    sendQueryBtn.addEventListener("click", () => {
      processQuery(assistantInput.value);
    });
  }

  if (assistantInput) {
    assistantInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        processQuery(assistantInput.value);
      }
    });
  }

  // Voice input button
  if (voiceInputBtn) {
    voiceInputBtn.addEventListener("click", () => {
      toggleVoiceInput();
    });
  }

  // Toggle voice input
  function toggleVoiceInput() {
    const voiceIndicator = document.getElementById("voiceIndicator");
    const voiceStatus = document.getElementById("voiceStatus");

    // Check if Speech Recognition is available
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      voiceInputBtn.classList.toggle("active");

      if (voiceInputBtn.classList.contains("active")) {
        // Activate voice input
        if (voiceIndicator) voiceIndicator.classList.add("active");
        if (voiceStatus) voiceStatus.textContent = "Listening...";

        // Just a simulation - in a real app would use actual speech recognition
        setTimeout(() => {
          // Simulate end of voice input
          voiceInputBtn.classList.remove("active");
          if (voiceIndicator) voiceIndicator.classList.remove("active");
          if (voiceStatus) voiceStatus.textContent = "Voice input ready";

          // Simulate a query
          assistantInput.value = "How does the SEVER Network function?";
          processQuery(assistantInput.value);
        }, 3000);
      } else {
        // Deactivate voice input
        if (voiceIndicator) voiceIndicator.classList.remove("active");
        if (voiceStatus) voiceStatus.textContent = "Voice input ready";
      }
    } else {
      // Speech Recognition not supported
      if (voiceStatus)
        voiceStatus.textContent = "Voice input not supported in this browser";
      alert("Speech recognition is not supported in your browser.");
    }
  }

  // Set up query suggestions
  querySuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const query = suggestion.getAttribute("data-query");
      assistantInput.value = query;
      processQuery(query);
    });
  });

  console.log("AI Assistant initialized successfully");
}

/* ===== Connect Button Animation ===== */
function initConnectButtons() {
  const connectButtons = document.querySelectorAll(".connect-button");

  connectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Add clicked animation class
      this.classList.add("button-clicked");

      // Remove the class after animation completes
      setTimeout(() => {
        this.classList.remove("button-clicked");
      }, 300);
    });
  });
}
