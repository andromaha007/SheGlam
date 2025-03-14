document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            setActiveLink(this);
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            // Show search results section
            showSection('search-results');
            
            // Clear previous results
            const searchContainer = document.getElementById('search-products');
            searchContainer.innerHTML = '';
            
            // Combine all products for searching
            const allProducts = [...products.skincare, ...products.makeup];
            
            // Filter products
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    searchContainer.appendChild(createProductCard(product));
                });
            } else {
                searchContainer.innerHTML = '<p class="no-results">No products found</p>';
            }
        }
    });

    // Show/Hide Sections
    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Load Products
    function loadProducts() {
        // Load popular products
        const popularContainer = document.getElementById('popular-products');
        popularProducts.forEach(product => {
            popularContainer.appendChild(createProductCard(product));
        });

        // Load skincare products
        const skincareContainer = document.getElementById('skincare-products');
        products.skincare.forEach(product => {
            skincareContainer.appendChild(createProductCard(product));
        });

        // Load makeup products
        const makeupContainer = document.getElementById('makeup-products');
        products.makeup.forEach(product => {
            makeupContainer.appendChild(createProductCard(product));
        });
    }

    // Create Product Card
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
        `;
        card.addEventListener('click', () => showProductModal(product));
        return card;
    }

    // Product Modal
    function showProductModal(product) {
        const modal = document.getElementById('product-modal');
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-price').textContent = `$${product.price.toFixed(2)}`;
        
        const addToCartBtn = modal.querySelector('.add-to-cart');
        addToCartBtn.onclick = () => addToCart(product);
        
        modal.style.display = 'block';
    }

    // Cart Functions
    function addToCart(product) {
        cart.push(product);
        updateCartCount();
    }

    function updateCartCount() {
        document.querySelector('.cart-count').textContent = cart.length;
    }

    // Cart Modal
    document.querySelector('.cart-icon').addEventListener('click', showCartModal);

    function showCartModal() {
        const modal = document.getElementById('cart-modal');
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        document.getElementById('cart-total-amount').textContent = total.toFixed(2);
        modal.style.display = 'block';

        document.querySelector('.checkout-btn').addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }

    // Close Modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Initialize
    loadProducts();
}); 