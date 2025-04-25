// Fix for the cart functionality and double-counting issue

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart fix script initialized');
    
    // ====================================================
    // 1. FIX CART FUNCTIONALITY
    // ====================================================
    
    // Fix addToCart function to prevent double counting
    window.addToCart = function(productId, quantity) {
        console.log("Adding to cart:", productId, quantity);
        
        let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        
        // Find product by ID
        const product = window.products.find(p => p.id === productId);
        
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name || product.title,
                    brand: product.brand,
                    price: product.price,
                    image: product.image || product.image_url,
                    quantity: quantity
                });
            }
            
            localStorage.setItem('beautyCart', JSON.stringify(cart));
            updateCartCount();
            
            // Show feedback
            showNotification("Product added to cart", "success");
        } else {
            console.error("Product not found:", productId);
            showNotification("Could not add product to cart", "error");
        }
    };
    
    // Fix updateCartCount function
    window.updateCartCount = function() {
        const cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };
    
    // Fix calculateCartTotal function
    window.calculateCartTotal = function() {
        const cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    // Fix showCartModal function
    window.showCartModal = function() {
        updateCartDisplay();
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'flex';
        }
    };
    
    // Fix updateCartDisplay function
    window.updateCartDisplay = function() {
        const cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        
        if (!cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            const cartTotalElement = document.getElementById('cart-total-amount');
            if (cartTotalElement) {
                cartTotalElement.textContent = '0.00';
            }
            return;
        }
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.setAttribute('data-product-id', item.id);
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <i class="fas fa-times remove-item"></i>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
            
            // Add event listeners for quantity buttons
            const decreaseBtn = itemElement.querySelector('.decrease');
            const increaseBtn = itemElement.querySelector('.increase');
            const removeBtn = itemElement.querySelector('.remove-item');
            
            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', () => updateItemQuantity(item.id, -1));
            }
            
            if (increaseBtn) {
                increaseBtn.addEventListener('click', () => updateItemQuantity(item.id, 1));
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => removeItemFromCart(item.id));
            }
        });
        
        // Update cart total
        const cartTotalElement = document.getElementById('cart-total-amount');
        if (cartTotalElement) {
            cartTotalElement.textContent = calculateCartTotal().toFixed(2);
        }
    };
    
    // Fix updateItemQuantity function
    window.updateItemQuantity = function(productId, change) {
        let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('beautyCart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    };
    
    // Fix removeItemFromCart function
    window.removeItemFromCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            localStorage.setItem('beautyCart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    };
    
    // Fix notification function
    window.showNotification = function(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.textContent = message;
        notification.className = type;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };
    
    // ====================================================
    // 2. FIX PRODUCT CARD QUICK ADD BUTTON
    // ====================================================
    
    // Fix quick add buttons to prevent double counting
    function fixQuickAddButtons() {
        const quickAddButtons = document.querySelectorAll('.quick-add');
        
        quickAddButtons.forEach(button => {
            // Remove any existing click event listeners by cloning and replacing
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add a new click event listener
            newButton.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Get the product ID from the parent card
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                const productId = parseInt(productCard.getAttribute('data-product-id'));
                if (isNaN(productId)) return;
                
                // Call addToCart function
                addToCart(productId, 1);
                
                // Animation feedback
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-plus"></i>';
                }, 1000);
            });
        });
    }
    
    // ====================================================
    // 3. FIX SKINCARE PAGE SPECIFIC ISSUES
    // ====================================================
    
    // Fix category filter for skincare products
    function fixCategoryFilter() {
        const filterButtons = document.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            // Remove any existing click event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new click event listener
            newButton.addEventListener('click', function() {
                // Update active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Initialize all the fixes
    updateCartCount(); // Update cart count on page load
    fixQuickAddButtons(); // Fix quick add buttons
    fixCategoryFilter(); // Fix category filter
    
    // Re-run fixes on any dynamic updates
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                fixQuickAddButtons();
            }
        });
    });
    
    // Start observing the products grid for changes
    const productsGrid = document.getElementById('makeup-products');
    if (productsGrid) {
        observer.observe(productsGrid, { childList: true });
    }
    
    console.log('Cart functionality fixes applied successfully');
});