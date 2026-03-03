// Initialize medium zoom.
$(document).ready(function () {
  const zoomOptions = { background: "#000000dd", margin: 24 };

  // Explicit data-zoomable images (used in shortcodes / figure includes)
  mediumZoom("[data-zoomable]", zoomOptions);

  // All images inside markdown post content that are not already zoomable
  // and not inside a link (links should navigate, not zoom)
  document.querySelectorAll("#markdown-content img:not([data-zoomable])").forEach(function (img) {
    if (!img.closest("a")) {
      mediumZoom(img, zoomOptions);
    }
  });
});
