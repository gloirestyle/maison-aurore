/* ═══════════════════════════════════════════════════════════════
   MAISON AURORE — Shopping Cart System
   Client-side cart with localStorage persistence
   ═══════════════════════════════════════════════════════════════ */

/* ─── Product Catalog ─── */
const PRODUCTS = [
  {
    id: 'aurore-soft-carryall',
    name: 'Aurore Soft Carryall',
    material: 'Smooth Calfskin',
    price: 2850,
    category: 'women',
    colors: ['Ink', 'Bone', 'Sand'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-carryall.jpg'
  },
  {
    id: 'structured-tote',
    name: 'Structured Day Tote',
    material: 'Grained Calfskin',
    price: 3200,
    category: 'women',
    colors: ['Charcoal', 'Ivory'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-tote.jpg'
  },
  {
    id: 'evening-clutch',
    name: 'Evening Fold Clutch',
    material: 'Polished Leather',
    price: 1450,
    category: 'women',
    colors: ['Ink', 'Wine'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-clutch.jpg'
  },
  {
    id: 'travel-case',
    name: 'Atelier Travel Case',
    material: 'Vegetable-Tanned Leather',
    price: 980,
    category: 'objects',
    colors: ['Cognac', 'Ink'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-travel.jpg'
  },
  {
    id: 'wool-overcoat',
    name: 'Draped Wool Overcoat',
    material: 'Italian Wool Cashmere',
    price: 4800,
    category: 'men',
    colors: ['Charcoal', 'Camel'],
    sizes: ['46', '48', '50', '52', '54'],
    image: 'assets/images/products/product-overcoat.jpg'
  },
  {
    id: 'silk-dress',
    name: 'Bias-Cut Silk Dress',
    material: 'Heavy Sand Silk',
    price: 2200,
    category: 'women',
    colors: ['Sand', 'Ivory', 'Ink'],
    sizes: ['34', '36', '38', '40', '42'],
    image: 'assets/images/products/product-dress.jpg'
  },
  {
    id: 'leather-loafer',
    name: 'Soft Leather Loafer',
    material: 'Burnished Calfskin',
    price: 890,
    category: 'men',
    colors: ['Espresso', 'Ink'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    image: 'assets/images/products/product-loafer.jpg'
  },
  {
    id: 'cashmere-knit',
    name: 'Essential Cashmere Knit',
    material: 'Mongolian Cashmere',
    price: 1650,
    category: 'men',
    colors: ['Ivory', 'Charcoal', 'Camel'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/images/products/product-knit.jpg'
  },
  {
    id: 'desk-set',
    name: 'Leather Desk Set',
    material: 'Hand-Stitched Calfskin',
    price: 1200,
    category: 'objects',
    colors: ['Ink', 'Cognac'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-desk.jpg'
  },
  {
    id: 'fragrance',
    name: 'Eau de Maison — №1',
    material: 'Amber, Leather, Fig Leaf',
    price: 320,
    category: 'objects',
    colors: ['50ml', '100ml'],
    sizes: ['50ml', '100ml'],
    image: 'assets/images/products/product-fragrance.jpg'
  },
  {
    id: 'silk-scarf',
    name: 'Printed Silk Scarf',
    material: 'Twill Silk',
    price: 580,
    category: 'women',
    colors: ['Stone', 'Terracotta'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-scarf.jpg'
  },
  {
    id: 'weekend-bag',
    name: 'Weekender Holdall',
    material: 'Canvas & Leather',
    price: 2100,
    category: 'men',
    colors: ['Sand', 'Charcoal'],
    sizes: ['One Size'],
    image: 'assets/images/products/product-weekender.jpg'
  }
];

// Expose for search
window.MAISON_PRODUCTS = PRODUCTS;

/* ─── Utility ─── */
function formatPrice(amount) {
  return '$' + amount.toLocaleString('en-US');
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* Color map for placeholders */
const COLOR_MAP = {
  'Ink': '#1B1B1B', 'Bone': '#F5F1EA', 'Sand': '#E8E0D4', 'Charcoal': '#333',
  'Ivory': '#FCFAF6', 'Wine': '#5B2E2E', 'Cognac': '#8B5E3C', 'Camel': '#C4A97D',
  'Espresso': '#3C2415', 'Stone': '#D8D1C7', 'Terracotta': '#C17C5E',
  '50ml': '#D8D1C7', '100ml': '#8A8178'
};

/* ─── Cart State ─── */
const CART_KEY = 'maison-aurore-cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
}

function addToCart(productId, size, color) {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ productId, size, color, quantity: 1 });
  }

  saveCart(cart);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateQuantity(index, qty) {
  const cart = getCart();
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = qty;
  }
  saveCart(cart);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

/* ─── Cart UI Rendering ─── */
function renderCart() {
  const cart = getCart();
  const itemsContainer = document.querySelector('.cart-drawer__items');
  const footerEl = document.querySelector('.cart-drawer__footer');
  const countEls = document.querySelectorAll('.navbar__cart-count');
  const drawerCount = document.querySelector('.cart-drawer__count');

  // Update badge
  const count = getCartCount();
  countEls.forEach(el => {
    el.textContent = count;
    el.classList.toggle('is-visible', count > 0);
  });

  if (drawerCount) {
    drawerCount.textContent = count === 1 ? '1 item' : `${count} items`;
  }

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-drawer__empty">
        <div class="cart-drawer__empty-title">Your selection is empty</div>
        <div class="cart-drawer__empty-text">Objects chosen slowly are kept longest.</div>
      </div>
    `;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (footerEl) footerEl.style.display = '';

  itemsContainer.innerHTML = cart.map((item, index) => {
    const product = getProductById(item.productId);
    if (!product) return '';

    const bgColor = COLOR_MAP[item.color] || '#E8E0D4';

    return `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item__image">
          <div class="cart-item__image-placeholder" style="width:100%;height:100%;background:${bgColor};display:flex;align-items:center;justify-content:center;">
            <span style="font-family:var(--font-display);font-size:0.7rem;color:var(--taupe);opacity:0.5">${product.name.charAt(0)}</span>
          </div>
        </div>
        <div class="cart-item__details">
          <div class="cart-item__name">${product.name}</div>
          <div class="cart-item__material">${product.material}</div>
          <div class="cart-item__variant">${item.size}${item.size !== item.color ? ' · ' + item.color : ''}</div>
          <div class="cart-item__price">${formatPrice(product.price)}</div>
          <div class="cart-item__controls">
            <div class="cart-item__qty">
              <button class="cart-item__qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
              <span class="cart-item__qty-num">${item.quantity}</span>
              <button class="cart-item__qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item__remove" data-index="${index}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Update subtotal
  const subtotalEl = document.querySelector('.cart-drawer__subtotal-value');
  if (subtotalEl) subtotalEl.textContent = formatPrice(getCartTotal());
}

/* ─── Cart Drawer Open/Close ─── */
function openCart() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.cart-overlay');
  if (drawer) drawer.classList.add('is-open');
  if (overlay) overlay.classList.add('is-open');
  document.body.classList.add('no-scroll');
  renderCart();
}

function closeCart() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.cart-overlay');
  if (drawer) drawer.classList.remove('is-open');
  if (overlay) overlay.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

/* ─── Size Modal ─── */
let currentModalProduct = null;
let selectedSize = null;
let selectedColor = null;

function openSizeModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  currentModalProduct = product;
  selectedSize = product.sizes.length === 1 ? product.sizes[0] : null;
  selectedColor = product.colors.length === 1 ? product.colors[0] : product.colors[0];

  const modal = document.querySelector('.size-modal');
  if (!modal) return;

  const nameEl = modal.querySelector('.size-modal__name');
  const materialEl = modal.querySelector('.size-modal__material');
  const priceEl = modal.querySelector('.size-modal__price');
  const sizesContainer = modal.querySelector('.size-modal__sizes');
  const colorsContainer = modal.querySelector('.size-modal__colors');
  const sizeLabel = modal.querySelector('.size-modal__label--size');
  const colorLabel = modal.querySelector('.size-modal__label--color');

  if (nameEl) nameEl.textContent = product.name;
  if (materialEl) materialEl.textContent = product.material;
  if (priceEl) priceEl.textContent = formatPrice(product.price);

  // Sizes
  if (sizesContainer) {
    if (product.sizes.length <= 1 && product.sizes[0] === 'One Size') {
      sizesContainer.style.display = 'none';
      if (sizeLabel) sizeLabel.style.display = 'none';
    } else {
      sizesContainer.style.display = '';
      if (sizeLabel) sizeLabel.style.display = '';
      sizesContainer.innerHTML = product.sizes.map(size =>
        `<button class="size-modal__size ${selectedSize === size ? 'is-selected' : ''}" data-size="${size}">${size}</button>`
      ).join('');
    }
  }

  // Colors
  if (colorsContainer) {
    colorsContainer.innerHTML = product.colors.map(color =>
      `<button class="size-modal__color ${selectedColor === color ? 'is-selected' : ''}" data-color="${color}">${color}</button>`
    ).join('');
  }

  modal.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closeSizeModal() {
  const modal = document.querySelector('.size-modal');
  if (modal) modal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  currentModalProduct = null;
  selectedSize = null;
  selectedColor = null;
}

/* ─── Event Listeners ─── */
document.addEventListener('DOMContentLoaded', () => {

  // Cart icon click
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  });

  // Cart close
  document.querySelectorAll('.cart-drawer__close, .cart-overlay').forEach(el => {
    el.addEventListener('click', closeCart);
  });

  // Cart item interactions (delegated)
  document.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('.cart-item__qty-btn');
    if (qtyBtn) {
      const index = parseInt(qtyBtn.dataset.index);
      const action = qtyBtn.dataset.action;
      const cart = getCart();
      if (action === 'increase') {
        updateQuantity(index, cart[index].quantity + 1);
      } else if (action === 'decrease') {
        updateQuantity(index, cart[index].quantity - 1);
      }
      renderCart();
      return;
    }

    const removeBtn = e.target.closest('.cart-item__remove');
    if (removeBtn) {
      removeFromCart(parseInt(removeBtn.dataset.index));
      renderCart();
      return;
    }
  });

  // Add to cart buttons
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (!addBtn) return;

    e.preventDefault();
    const productId = addBtn.dataset.addToCart;
    const product = getProductById(productId);
    if (!product) return;

    // If only one size and one color, add directly
    if (product.sizes.length === 1 && product.sizes[0] === 'One Size' && product.colors.length === 1) {
      addToCart(productId, product.sizes[0], product.colors[0]);
      renderCart();
      // Brief visual feedback
      addBtn.textContent = 'Added';
      setTimeout(() => { addBtn.textContent = 'Add to Selection'; }, 1500);
    } else {
      openSizeModal(productId);
    }
  });

  // Size modal interactions
  document.addEventListener('click', (e) => {
    // Size selection
    const sizeBtn = e.target.closest('.size-modal__size');
    if (sizeBtn) {
      selectedSize = sizeBtn.dataset.size;
      document.querySelectorAll('.size-modal__size').forEach(b => b.classList.remove('is-selected'));
      sizeBtn.classList.add('is-selected');
      return;
    }

    // Color selection
    const colorBtn = e.target.closest('.size-modal__color');
    if (colorBtn) {
      selectedColor = colorBtn.dataset.color;
      document.querySelectorAll('.size-modal__color').forEach(b => b.classList.remove('is-selected'));
      colorBtn.classList.add('is-selected');
      return;
    }

    // Add button in modal
    const addModalBtn = e.target.closest('.size-modal__add');
    if (addModalBtn && currentModalProduct) {
      const size = selectedSize || currentModalProduct.sizes[0];
      const color = selectedColor || currentModalProduct.colors[0];

      if (!size && currentModalProduct.sizes.length > 1) {
        // Flash size section
        return;
      }

      addToCart(currentModalProduct.id, size, color);
      closeSizeModal();
      renderCart();
      openCart();
      return;
    }

    // Close modal overlay
    const modalOverlay = e.target.closest('.size-modal__overlay');
    if (modalOverlay) {
      closeSizeModal();
      return;
    }

    // Close modal button
    const modalClose = e.target.closest('.size-modal__close');
    if (modalClose) {
      closeSizeModal();
      return;
    }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sizeModal = document.querySelector('.size-modal.is-open');
      if (sizeModal) { closeSizeModal(); return; }

      const cartDrawer = document.querySelector('.cart-drawer.is-open');
      if (cartDrawer) { closeCart(); return; }
    }
  });

  // Listen for cart updates to sync badges
  window.addEventListener('cart:updated', () => {
    const count = getCartCount();
    document.querySelectorAll('.navbar__cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('is-visible', count > 0);
    });
  });

  // Initial render
  renderCart();
});
