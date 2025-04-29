/**
 * Animation fix script - Ensures loading animations play properly
 */
(function () {
  // Mobile detection
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  document.addEventListener("DOMContentLoaded", function () {
    if (isMobile) {
      // Always show the animation canvas
      const bgCanvas = document.getElementById("bgCanvas");
      if (bgCanvas) {
        bgCanvas.style.display = "block";
        bgCanvas.style.opacity = "1";
        bgCanvas.style.zIndex = "0";
        bgCanvas.style.pointerEvents = "none";
      }
      // Always show the login loading overlay if present
      const loadingOverlay = document.getElementById("loadingOverlay");
      if (loadingOverlay) {
        loadingOverlay.style.display = "flex";
        loadingOverlay.style.opacity = "1";
        loadingOverlay.style.visibility = "visible";
        loadingOverlay.style.zIndex = "9999";
        loadingOverlay.style.pointerEvents = "auto";
      }
    }
  });
})();
