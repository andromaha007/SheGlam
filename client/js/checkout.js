class Checkout {
    constructor() {
        this.cart = [];
        this.total = 0;
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ product, quantity });
        }
        
        this.updateTotal();
        this.updateCartUI();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.product.id !== productId);
        this.updateTotal();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateTotal();
            this.updateCartUI();
        }
    }

    updateTotal() {
        this.total = this.cart.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total-amount');

        // Update cart count
        cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = '';
            this.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div>
                        <h4>${item.product.name}</h4>
                        <p>$${item.product.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="checkout.updateQuantity('${item.product.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="checkout.updateQuantity('${item.product.id}', ${item.quantity + 1})">+</button>
                        <i class="fas fa-trash remove-btn" onclick="checkout.removeFromCart('${item.product.id}')"></i>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });
        }

        // Update total
        if (cartTotal) {
            cartTotal.textContent = this.total.toFixed(2);
        }
    }

    processCheckout() {
        const checkoutModal = document.getElementById('checkout-modal');
        checkoutModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Checkout</h2>
                <form id="checkout-form" class="checkout-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" required pattern="[0-9]{16}">
                    </div>
                    <div class="form-group">
                        <label>Total Amount</label>
                        <input type="text" value="$${this.total.toFixed(2)}" readonly>
                    </div>
                    <button type="submit" class="checkout-btn">Complete Purchase</button>
                </form>
            </div>
        `;

        checkoutModal.style.display = 'block';

        // Handle form submission
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your purchase! Your order has been processed.');
            this.cart = [];
            this.updateTotal();
            this.updateCartUI();
            checkoutModal.style.display = 'none';
        });

        // Close modal functionality
        checkoutModal.querySelector('.close').addEventListener('click', () => {
            checkoutModal.style.display = 'none';
        });
    }
}

// Initialize checkout
const checkout = new Checkout(); 