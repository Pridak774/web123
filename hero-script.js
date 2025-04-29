/**
 * Hero Section Interaction Script
 * Handles theme toggle and other hero section functionality
 */

document.addEventListener("DOMContentLoaded", function () {
  // Hero theme toggle functionality
  const heroThemeToggle = document.getElementById("heroThemeToggle");

  if (heroThemeToggle) {
    // Handle click for toggling theme
    heroThemeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      updateThemeIcon();

      // Also sync with main theme toggle if it exists
      const mainThemeToggle = document.getElementById("themeToggle");
      if (mainThemeToggle) {
        // Update main toggle icon to match current theme
        const icon = mainThemeToggle.querySelector("i");
        if (icon) {
          icon.className = document.body.classList.contains("light-mode")
            ? "fas fa-moon"
            : "fas fa-adjust";
        }
      }
    });

    // Handle double-click to reset to default theme
    heroThemeToggle.addEventListener("dblclick", function () {
      document.body.classList.remove("light-mode");
      document.body.classList.remove("theme-alt");
      updateThemeIcon();
    });

    // Initialize the button state
    updateThemeIcon();
  }

  // Update theme icon based on current theme
  function updateThemeIcon() {
    if (heroThemeToggle) {
      if (document.body.classList.contains("light-mode")) {
        heroThemeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        heroThemeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
      }
    }
  }

  // Initialize typing animation effect
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    // Reset the animation when the element becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "none";
            setTimeout(() => {
              entry.target.style.animation =
                "typing 3.5s steps(40, end) 1s forwards";
            }, 50);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(typingText);
  }

  // Ensure the hero section is properly aligned
  const heroSection = document.getElementById("hero");
  if (heroSection) {
    // Adjust hero section height based on viewport
    function adjustHeroHeight() {
      const windowHeight = window.innerHeight;
      const navHeight = document.getElementById("navbar")?.offsetHeight || 60;
      heroSection.style.minHeight = `${windowHeight - navHeight}px`;
    }

    // Call once on load and on window resize
    adjustHeroHeight();
    window.addEventListener("resize", adjustHeroHeight);
  }

  // Smooth scrolling for hero action buttons
  const heroActionButtons = document.querySelectorAll(".hero-actions a");
  heroActionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Add interactive effects to blockchain stats
  const blockchainStats = document.querySelectorAll(
    ".hero-stats .blockchain-stat"
  );
  blockchainStats.forEach((stat) => {
    stat.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    stat.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  // Theme selector functionality
  const themeButtons = document.querySelectorAll(".theme-btn");

  // Set current theme as active on load
  const currentTheme = localStorage.getItem("theme") || "theme-cyan";
  document.body.classList.add(currentTheme);
  themeButtons.forEach((button) => {
    if (button.dataset.theme === currentTheme) {
      button.classList.add("active");
    }
  });

  // Add click event to each theme button
  themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove all theme classes and active states
      themeButtons.forEach((btn) => btn.classList.remove("active"));

      // Remove all theme classes from body
      document.body.classList.remove(
        "theme-neon",
        "theme-purple",
        "theme-blue",
        "theme-red",
        "theme-cyan",
        "theme-white",
        "theme-gold",
        "theme-green",
        "theme-orange"
      );

      // Add new theme class and active state
      const newTheme = this.dataset.theme;
      document.body.classList.add(newTheme);
      this.classList.add("active");

      // Store theme preference
      localStorage.setItem("theme", newTheme);

      // Trigger background canvas update
      if (window.updateCanvasColors) {
        setTimeout(window.updateCanvasColors, 50); // Small delay to ensure CSS variables are updated
      }
    });
  });
});
