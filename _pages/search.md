---
layout: page
title: 搜索
permalink: /search/
description: 搜索站内文章标题、标签、分类和全文内容
nav: false
_styles: >
  #search-input-wrapper {
    position: relative;
    margin-bottom: 1rem;
  }
  #search-input {
    width: 100%;
    padding: 0.85rem 2.8rem 0.85rem 2.75rem;
    font-size: 1.05rem;
    border: 1.5px solid var(--global-divider-color);
    border-radius: 0.5rem;
    background-color: var(--global-bg-color);
    color: var(--global-text-color);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  #search-input:focus {
    border-color: var(--global-theme-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--global-theme-color) 20%, transparent);
  }
  #search-input-icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--global-text-color-light);
    pointer-events: none;
    font-size: 1.1rem;
  }
  #search-clear-btn {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--global-text-color-light);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    display: none;
  }
  #search-clear-btn:hover {
    color: var(--global-theme-color);
  }
  #search-status {
    color: var(--global-text-color-light);
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
    min-height: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #search-results article {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--global-divider-color);
  }
  #search-results article:last-child {
    border-bottom: none;
  }
  #search-results h2 {
    font-size: 1.25rem;
    margin-bottom: 0.4rem;
  }
  #search-results h2 a {
    color: var(--global-text-color);
    text-decoration: none;
    font-weight: 600;
  }
  #search-results h2 a:hover {
    color: var(--global-theme-color);
  }
  #search-results .search-meta {
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    margin-bottom: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }
  #search-results .search-snippet {
    font-size: 0.92rem;
    color: var(--global-text-color-light);
    line-height: 1.6;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 0;
  }
  #search-results mark {
    background-color: color-mix(in srgb, var(--global-theme-color) 25%, transparent);
    color: var(--global-theme-color);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-weight: 600;
  }
---

<div id="search-input-wrapper">
  <span id="search-input-icon">
    <i class="fa-solid fa-magnifying-glass"></i>
  </span>
  <input
    type="search"
    id="search-input"
    placeholder="输入关键词搜索文章标题、标签或正文内容…"
    autocomplete="off"
    autofocus
  />
  <button id="search-clear-btn" type="button" title="清空输入" aria-label="清空">
    <i class="fa-solid fa-xmark"></i>
  </button>
</div>

<div id="search-status">
  <i class="fa-solid fa-spinner fa-spin"></i> 正在加载站内全文索引库，请稍候…
</div>
<div id="search-results"></div>

<script>
  (function () {
    var input = document.getElementById("search-input");
    var clearBtn = document.getElementById("search-clear-btn");
    var status = document.getElementById("search-status");
    var results = document.getElementById("search-results");

    var searchIndex = null;
    var isLoadingIndex = true;
    var searchTimer = null;

    // Load search.json asynchronously
    var indexUrl = "{{ '/assets/js/data/search.json' | relative_url }}";

    fetch(indexUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(function (data) {
        searchIndex = data;
        isLoadingIndex = false;
        var postCount = data.length || 0;
        status.innerHTML =
          '<i class="fa-solid fa-circle-check text-success"></i> 索引库已加载（共 ' +
          postCount +
          " 篇博文），请输入关键词开始全文检索";

        // Check if there's query param in URL ?q=...
        var urlParams = new URLSearchParams(window.location.search);
        var qParam = urlParams.get("q") || urlParams.get("s");
        if (qParam) {
          input.value = qParam;
          triggerSearch();
        }
      })
      .catch(function (err) {
        isLoadingIndex = false;
        console.error("Failed to load search index:", err);
        status.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation text-danger"></i> 索引库加载失败，请刷新重试';
      });

    function escapeHtml(str) {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function createSnippet(content, terms) {
      if (!content) return "";
      var plainText = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");

      // Find first occurrence of any term
      var firstIdx = -1;
      var matchedTerm = "";
      for (var i = 0; i < terms.length; i++) {
        var idx = plainText.toLowerCase().indexOf(terms[i].toLowerCase());
        if (idx > -1 && (firstIdx === -1 || idx < firstIdx)) {
          firstIdx = idx;
          matchedTerm = terms[i];
        }
      }

      var start = Math.max(0, firstIdx - 50);
      var end = Math.min(plainText.length, firstIdx + 120);
      var snippet =
        (start > 0 ? "..." : "") +
        plainText.substring(start, end) +
        (end < plainText.length ? "..." : "");

      // Highlight all terms
      terms.forEach(function (term) {
        if (!term) return;
        var safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var regex = new RegExp("(" + safeTerm + ")", "gi");
        snippet = snippet.replace(regex, "<mark>$1</mark>");
      });

      return snippet;
    }

    function highlightTitle(title, terms) {
      var safeTitle = escapeHtml(title);
      terms.forEach(function (term) {
        if (!term) return;
        var safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var regex = new RegExp("(" + safeTerm + ")", "gi");
        safeTitle = safeTitle.replace(regex, "<mark>$1</mark>");
      });
      return safeTitle;
    }

    function performSearch(query) {
      if (!searchIndex) return;

      var trimmed = query.trim();
      if (!trimmed) {
        status.innerHTML =
          '<i class="fa-solid fa-circle-check text-success"></i> 索引库已就绪（共 ' +
          searchIndex.length +
          " 篇博文），请输入关键词搜索";
        results.innerHTML = "";
        clearBtn.style.display = "none";
        return;
      }

      clearBtn.style.display = "block";
      var terms = trimmed.split(/\s+/).filter(Boolean);

      var matchedPosts = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var post = searchIndex[i];
        var title = post.title || "";
        var categories = post.categories || "";
        var tags = post.tags || "";
        var content = post.content || "";

        var fullSearchString = (
          title +
          " " +
          categories +
          " " +
          tags +
          " " +
          content
        ).toLowerCase();

        // AND search: all terms must match
        var allMatch = true;
        for (var j = 0; j < terms.length; j++) {
          if (fullSearchString.indexOf(terms[j].toLowerCase()) === -1) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          matchedPosts.push(post);
        }
      }

      if (matchedPosts.length === 0) {
        status.innerHTML =
          '<i class="fa-solid fa-circle-exclamation text-warning"></i> 未找到与 “<strong>' +
          escapeHtml(trimmed) +
          "</strong>” 相关的文章，请尝试更换关键词";
        results.innerHTML = "";
      } else {
        status.innerHTML =
          '<i class="fa-solid fa-magnifying-glass"></i> 找到 <strong>' +
          matchedPosts.length +
          "</strong> 篇与 “<strong>" +
          escapeHtml(trimmed) +
          "</strong>” 相关的文章";

        var html = "";
        for (var k = 0; k < matchedPosts.length; k++) {
          var p = matchedPosts[k];
          var snippet = createSnippet(p.content, terms);
          var hTitle = highlightTitle(p.title, terms);

          html += "<article>";
          html += '<h2><a href="' + p.url + '">' + hTitle + "</a></h2>";
          html += '<div class="search-meta">';
          if (p.date) {
            html +=
              '<span><i class="fa-solid fa-calendar fa-xs"></i> ' +
              escapeHtml(p.date) +
              "</span>";
          }
          if (p.categories) {
            html +=
              '<span><i class="fa-solid fa-tag fa-xs"></i> ' +
              escapeHtml(p.categories) +
              "</span>";
          }
          if (p.tags) {
            html +=
              '<span><i class="fa-solid fa-hashtag fa-xs"></i> ' +
              escapeHtml(p.tags) +
              "</span>";
          }
          html += "</div>";
          if (snippet) {
            html += '<p class="search-snippet">' + snippet + "</p>";
          }
          html += "</article>";
        }
        results.innerHTML = html;
      }
    }

    function triggerSearch() {
      var q = input.value;
      if (isLoadingIndex) {
        status.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> 正在加载索引库并准备检索 “<strong>' +
          escapeHtml(q) +
          "</strong>”…";
        return;
      }

      if (q.trim().length > 0) {
        status.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> 正在检索 “<strong>' +
          escapeHtml(q.trim()) +
          "</strong>”…";
      }

      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        performSearch(q);
      }, 100);
    }

    input.addEventListener("input", triggerSearch);

    clearBtn.addEventListener("click", function () {
      input.value = "";
      input.focus();
      triggerSearch();
    });
  })();
</script>
