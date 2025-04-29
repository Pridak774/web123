/**
 * Touch Interaction Helper - Improves mobile touch experience
 */
(function () {
  // Only run on touch devices
  if (!("ontouchstart" in window)) return;

  console.log("Touch interaction helper initialized");

  document.addEventListener("DOMContentLoaded", function () {
    // Only keep touch active state for buttons and interactive elements
    const touchElements = document.querySelectorAll(
      "button, .btn, .nav-menu a, .connect-button, .social-icon, .action-btn"
    );

    touchElements.forEach((element) => {
      // Add active state management
      element.addEventListener(
        "touchstart",
        function () {
          this.classList.add("touch-active");
        },
        { passive: true }
      );

      element.addEventListener(
        "touchend",
        function () {
          this.classList.remove("touch-active");
        },
        { passive: true }
      );
    });
  });
})();
