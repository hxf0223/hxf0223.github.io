---
layout: compress
---

document.addEventListener("DOMContentLoaded", function() {
  // Render math in the document
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "\\[", right: "\\]", display: true},
      {left: "$", right: "$", display: false},
      {left: "\\(", right: "\\)", display: false}
    ],
    throwOnError: false,
    strict: false,
    trust: true,
    macros: {
      "\\text": "\\textrm"
    }
  });

  // Helper function to decode HTML entities
  function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  // Convert kramdown's MathJax format to KaTeX
  // Handle inline math: <script type="math/tex">...</script>
  document.querySelectorAll("script[type='math/tex']").forEach(function(el) {
    var tex = decodeHTMLEntities(el.textContent);
    var rendered = katex.renderToString(tex, {displayMode: false, throwOnError: false, strict: false, trust: true});
    var span = document.createElement("span");
    span.innerHTML = rendered;
    el.parentNode.replaceChild(span, el);
  });

  // Handle display math: <script type="math/tex; mode=display">...</script>
  document.querySelectorAll("script[type='math/tex; mode=display']").forEach(function(el) {
    var tex = decodeHTMLEntities(el.textContent);
    var rendered = katex.renderToString(tex, {displayMode: true, throwOnError: false, strict: false, trust: true});
    var div = document.createElement("div");
    div.innerHTML = rendered;
    el.parentNode.replaceChild(div, el);
  });
});
