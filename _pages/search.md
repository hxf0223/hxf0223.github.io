---
layout: page
title: 搜索
permalink: /search/
description: 搜索站内文章内容
nav: true
nav_order: 6
_styles: >
  #search-input-wrapper {
    position: relative;
    margin-bottom: 2rem;
  }
  #search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    font-size: 1rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 0.5rem;
    background-color: var(--global-bg-color);
    color: var(--global-text-color);
    outline: none;
    transition: border-color 0.2s;
  }
  #search-input:focus {
    border-color: var(--global-theme-color);
  }
  #search-input-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--global-text-color-light);
    pointer-events: none;
  }
  #search-results article {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--global-divider-color);
  }
  #search-results article:last-child {
    border-bottom: none;
  }
  #search-results h2 {
    font-size: 1.15rem;
    margin-bottom: 0.35rem;
  }
  #search-results h2 a {
    color: var(--global-text-color);
    text-decoration: none;
  }
  #search-results h2 a:hover {
    color: var(--global-theme-color);
  }
  #search-results .search-meta {
    font-size: 0.8rem;
    color: var(--global-text-color-light);
    margin-bottom: 0.4rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  #search-results .search-snippet {
    font-size: 0.88rem;
    color: var(--global-text-color-light);
    line-height: 1.6;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  #search-hint {
    color: var(--global-text-color-light);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    min-height: 1.5rem;
  }
---

<div id="search-input-wrapper">
  <span id="search-input-icon">
    <i class="fa-solid fa-magnifying-glass"></i>
  </span>
  <input
    type="search"
    id="search-input"
    placeholder="输入关键词搜索文章标题和内容…"
    autocomplete="off"
    autofocus
  />
</div>

<p id="search-hint"></p>
<div id="search-results"></div>

<script src="https://cdn.jsdelivr.net/npm/simple-jekyll-search@1.10.0/dest/simple-jekyll-search.min.js"></script>
<script>
  (function () {
    var hint = document.getElementById("search-hint");

    SimpleJekyllSearch({
      searchInput: document.getElementById("search-input"),
      resultsContainer: document.getElementById("search-results"),
      json: "{{ '/assets/js/data/search.json' | relative_url }}",
      searchResultTemplate: `
        <article>
          <h2><a href="{url}">{title}</a></h2>
          <div class="search-meta">
            <span>{date}</span>
            <span>{categories}</span>
            <span>{tags}</span>
          </div>
          <p class="search-snippet">{content}</p>
        </article>`,
      noResultsText: "<p>没有找到相关文章。</p>",
      limit: 20,
      fuzzy: false,
      exclude: ["Welcome"],
      success: function () {},
    });

    var input = document.getElementById("search-input");
    input.addEventListener("input", function () {
      var q = input.value.trim();
      if (q.length === 0) {
        hint.textContent = "";
      } else {
        var count = document.querySelectorAll("#search-results article").length;
        hint.textContent = count > 0 ? "找到 " + count + " 篇相关文章" : "";
      }
    });
  })();
</script>
