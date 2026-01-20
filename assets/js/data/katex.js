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

  // Convert kramdown's MathJax format to KaTeX
  // Handle inline math: <script type="math/tex">...</script>
  document.querySelectorAll("script[type='math/tex']").forEach(function(el) {
    var tex = el.textContent;
    var rendered = katex.renderToString(tex, {displayMode: false, throwOnError: false});
    var span = document.createElement("span");
    span.innerHTML = rendered;
    el.parentNode.replaceChild(span, el);
  });

  // Handle display math: <script type="math/tex; mode=display">...</script>
  document.querySelectorAll("script[type='math/tex; mode=display']").forEach(function(el) {
    var tex = el.textContent;
    var rendered = katex.renderToString(tex, {displayMode: true, throwOnError: false});
    var div = document.createElement("div");
    div.innerHTML = rendered;
    el.parentNode.replaceChild(div, el);
  });
});
