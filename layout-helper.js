/**
 * Layout Helper - Manages consistent layout across the site
 */
document.addEventListener("DOMContentLoaded", function () {
  // Adjust heights of paired panels to be equal
  function equalizeHeights() {
    // Dashboard panels
    const dashboardPanels = document.querySelectorAll(
      ".dashboard-container .dashboard-panel"
    );
    if (dashboardPanels.length >= 2 && window.innerWidth > 991) {
      let maxHeight = 0;
      dashboardPanels.forEach((panel) => {
        panel.style.height = "auto";
        maxHeight = Math.max(maxHeight, panel.offsetHeight);
      });
      dashboardPanels.forEach((panel) => {
        panel.style.height = maxHeight + "px";
      });
    } else {
      dashboardPanels.forEach((panel) => {
        panel.style.height = "auto";
      });
    }

    // Trading panels
    const marketView = document.querySelector(".market-view");
    const tradingPanel = document.querySelector(".trading-panel");
    if (marketView && tradingPanel && window.innerWidth > 991) {
      const maxHeight = Math.max(
        marketView.scrollHeight,
        tradingPanel.scrollHeight
      );
      marketView.style.height = maxHeight + "px";
      tradingPanel.style.height = maxHeight + "px";
    } else if (marketView && tradingPanel) {
      marketView.style.height = "auto";
      tradingPanel.style.height = "auto";
    }

    // Calculator panels
    const calculatorPanel = document.querySelector(".calculator-panel");
    const resultsPanel = document.querySelector(".results-panel");
    if (calculatorPanel && resultsPanel && window.innerWidth > 991) {
      const maxHeight = Math.max(
        calculatorPanel.scrollHeight,
        resultsPanel.scrollHeight
      );
      calculatorPanel.style.height = maxHeight + "px";
      resultsPanel.style.height = maxHeight + "px";
    } else if (calculatorPanel && resultsPanel) {
      calculatorPanel.style.height = "auto";
      resultsPanel.style.height = "auto";
    }
  }

  // Position and size blockchain explorer elements properly
  function adjustExplorerLayout() {
    const viewport = document.querySelector(".explorer-viewport");
    const controls = document.querySelector(".explorer-controls");

    if (viewport && controls) {
      if (window.innerWidth > 1200) {
        viewport.style.height = Math.max(controls.offsetHeight, 600) + "px";
      } else if (window.innerWidth > 768) {
        viewport.style.height = "450px";
      } else {
        viewport.style.height = "350px";
      }
    }
  }

  // Adjust timeline axis height
  function adjustTimelineAxis() {
    const timelineContainer = document.querySelector(".timeline-container");
    const timelineAxis = document.querySelector(".timeline-axis");

    if (timelineContainer && timelineAxis) {
      const height = timelineContainer.offsetHeight;
      timelineAxis.style.height = height + "px";
    }
  }

  // Position floating elements like block info panel
  function positionFloatingElements() {
    const blockInfoPanel = document.getElementById("blockInfoPanel");
    const explorerViewport = document.querySelector(".explorer-viewport");

    if (
      blockInfoPanel &&
      explorerViewport &&
      blockInfoPanel.style.display !== "none"
    ) {
      // Ensure the panel is properly positioned within viewport
      const viewportRect = explorerViewport.getBoundingClientRect();
      const panelRect = blockInfoPanel.getBoundingClientRect();

      // Keep panel inside viewport boundaries
      if (panelRect.right > viewportRect.right) {
        blockInfoPanel.style.left = "auto";
        blockInfoPanel.style.right = "20px";
      }

      if (panelRect.bottom > viewportRect.bottom) {
        blockInfoPanel.style.top = "auto";
        blockInfoPanel.style.bottom = "20px";
      }
    }
  }

  // Run all layout adjustments
  function adjustAllLayouts() {
    equalizeHeights();
    adjustExplorerLayout();
    adjustTimelineAxis();
    positionFloatingElements();
  }

  // Initial adjustments
  setTimeout(adjustAllLayouts, 500);

  // Adjust on window resize
  window.addEventListener("resize", function () {
    adjustAllLayouts();
  });

  // Adjust when tabs/sections become visible
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(adjustAllLayouts, 200);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Set active section in navigation based on scroll position
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 100; // Offset for fixed header

    // Find section currently in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all nav links
        document.querySelectorAll(".nav-menu a").forEach((link) => {
          link.classList.remove("active");
        });

        // Add active class to current section's nav link
        const activeLink = document.querySelector(
          `.nav-menu a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  // Highlight active section on scroll
  window.addEventListener("scroll", highlightActiveSection);

  // Add smooth scrolling to nav links
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navHeight = document.getElementById("navbar").offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Close mobile menu if open
          const navMenu = document.getElementById("navMenu");
          if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
          }
        }
      }
    });
  });
});
