/* ═══════════════════════════════════════════════════════════════
   MAISON AURORE — Search Panel
   Concierge-style product search with keyboard navigation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const searchPanel = document.querySelector('.search-panel');
  const searchInput = document.querySelector('.search-panel__input');
  const searchResults = document.querySelector('.search-panel__results');

  if (!searchPanel || !searchInput || !searchResults) return;

  let isOpen = false;
  let activeResultIndex = -1;
  let debounceTimer = null;

  /* ─── Open / Close ─── */
  function openSearch() {
    searchPanel.classList.add('is-open');
    document.body.classList.add('no-scroll');
    isOpen = true;
    // Focus input after transition
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchPanel.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    isOpen = false;
    searchInput.value = '';
    searchResults.innerHTML = '';
    activeResultIndex = -1;
  }

  // Open triggers
  document.querySelectorAll('[data-open-search]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  // Close triggers
  const closeBtn = searchPanel.querySelector('.search-panel__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  // Escape key handled globally in cart.js, but also here for safety
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeSearch();
    }

    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) closeSearch();
      else openSearch();
    }
  });

  /* ─── Search Logic ─── */
  function performSearch(query) {
    const products = window.MAISON_PRODUCTS || [];
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const q = query.toLowerCase().trim();
    const results = products.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some(c => c.toLowerCase().includes(q))
      );
    });

    renderResults(results, query);
  }

  function renderResults(results, query) {
    activeResultIndex = -1;

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-panel__no-results">
          No objects found for "${query}"
        </div>
      `;
      return;
    }

    const COLOR_MAP = {
      'Ink': '#1B1B1B', 'Bone': '#F5F1EA', 'Sand': '#E8E0D4', 'Charcoal': '#333',
      'Ivory': '#FCFAF6', 'Wine': '#5B2E2E', 'Cognac': '#8B5E3C', 'Camel': '#C4A97D',
      'Espresso': '#3C2415', 'Stone': '#D8D1C7', 'Terracotta': '#C17C5E'
    };

    searchResults.innerHTML = results.map((product, index) => {
      const bgColor = COLOR_MAP[product.colors[0]] || '#E8E0D4';

      return `
        <div class="search-panel__result" data-index="${index}" data-product-id="${product.id}" tabindex="0">
          <div class="search-panel__result-image">
            <div style="width:100%;height:100%;background:${bgColor};display:flex;align-items:center;justify-content:center;">
              <span class="search-panel__result-placeholder">${product.name.charAt(0)}</span>
            </div>
          </div>
          <div class="search-panel__result-info">
            <div class="search-panel__result-name">${highlightMatch(product.name, query)}</div>
            <div class="search-panel__result-material">${product.material}</div>
          </div>
          <div class="search-panel__result-price">$${product.price.toLocaleString()}</div>
        </div>
      `;
    }).join('');
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ─── Input Handler with Debounce ─── */
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(searchInput.value);
    }, 200);
  });

  /* ─── Keyboard Navigation ─── */
  searchInput.addEventListener('keydown', (e) => {
    const resultElements = searchResults.querySelectorAll('.search-panel__result');
    if (resultElements.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeResultIndex = Math.min(activeResultIndex + 1, resultElements.length - 1);
      updateActiveResult(resultElements);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeResultIndex = Math.max(activeResultIndex - 1, 0);
      updateActiveResult(resultElements);
    } else if (e.key === 'Enter' && activeResultIndex >= 0) {
      e.preventDefault();
      const activeResult = resultElements[activeResultIndex];
      if (activeResult) {
        handleResultClick(activeResult);
      }
    }
  });

  function updateActiveResult(elements) {
    elements.forEach((el, i) => {
      el.style.background = i === activeResultIndex ? 'rgba(252,250,246,0.05)' : '';
    });

    if (elements[activeResultIndex]) {
      elements[activeResultIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  /* ─── Result Click ─── */
  searchResults.addEventListener('click', (e) => {
    const result = e.target.closest('.search-panel__result');
    if (result) handleResultClick(result);
  });

  function handleResultClick(resultEl) {
    const productId = resultEl.dataset.productId;
    closeSearch();

    // Scroll to product if on same page, or could navigate
    const productCard = document.querySelector(`[data-product="${productId}"]`);
    if (productCard) {
      productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      productCard.style.outline = '2px solid var(--brass)';
      setTimeout(() => { productCard.style.outline = ''; }, 2000);
    }
  }

});
