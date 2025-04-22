// Wait for DOM to be fully loaded before initializing admin features
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in admin.js');
    
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
        console.log('Admin user detected, initializing admin features');
        initAdminInterface();
        
        // Load products from database on page load
        loadProductsFromDatabase();
    } else {
        console.log('Not an admin user, skipping admin features');
    }
});

// Function to initialize admin interface
function initAdminInterface() {
    console.log('Initializing admin interface');
    
    // Setup admin UI elements
    setupAdminUI();
    
    // Setup add product functionality
    setupAddProduct();
    
    // Add delete buttons to existing products
    addDeleteButtonsToProducts();
}

// Function to set up admin UI elements
function setupAdminUI() {
    // Hide cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.display = 'none';
        console.log('Cart icon hidden');
    }
    
    // Create and add the "Add Product" button if it doesn't exist
    if (!document.querySelector('.add-product')) {
        const addProductBtn = document.createElement('div');
        addProductBtn.className = 'add-product';
        addProductBtn.innerHTML = '<button class="add-product-button">+</button>';
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(addProductBtn);
            console.log('Add product button created and added to nav');
        }
    }
}

// Function to set up add product functionality
function setupAddProduct() {
    // Check if modal exists already
    let addProductModal = document.getElementById('add-product-modal');
    
    // Create modal if it doesn't exist
    if (!addProductModal) {
        createAddProductModal();
        addProductModal = document.getElementById('add-product-modal');
    }
    
    // Add event listener to add product button
    const addProductBtn = document.querySelector('.add-product-button');
    if (addProductBtn) {
        // Remove existing event listeners by cloning
        const newBtn = addProductBtn.cloneNode(true);
        if (addProductBtn.parentNode) {
            addProductBtn.parentNode.replaceChild(newBtn, addProductBtn);
        }
        
        // Add click event listener
        newBtn.addEventListener('click', function() {
            console.log('Add product button clicked');
            if (addProductModal) {
                addProductModal.style.display = 'flex';
            } else {
                console.error('Add product modal not found');
            }
        });
        
        console.log('Event listener added to add product button');
    }
}

// Function to create add product modal
function createAddProductModal() {
    console.log('Creating add product modal');
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'add-product-modal';
    modal.className = 'modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add New Product</h2>
            <form id="add-product-form">
                <div class="form-group">
                    <label for="product-name">Product Name</label>
                    <input type="text" id="product-name" required>
                </div>
                
                <div class="form-group">
                    <label for="product-brand">Brand</label>
                    <input type="text" id="product-brand" required>
                </div>
                
                <div class="form-group">
                    <label for="product-category">Category</label>
                    <select id="product-category" required>
                        <option value="">Select a category</option>
                        <option value="cleanser">Cleanser</option>
                        <option value="moisturizer">Moisturizer</option>
                        <option value="treatment">Treatment</option>
                        <option value="sunscreen">Sunscreen</option>
                        <option value="toner">Toner</option>
                        <option value="face">Face</option>
                        <option value="eyes">Eyes</option>
                        <option value="lips">Lips</option>
                        <option value="cheeks">Cheeks</option>
                        <option value="brushes">Brushes</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="product-price">Price ($)</label>
                    <input type="number" id="product-price" step="0.01" min="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="product-description">Description</label>
                    <textarea id="product-description" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="product-image">Image URL</label>
                    <input type="text" id="product-image" required placeholder="Enter image URL">
                </div>
                
                <div class="form-group">
                    <label>Featured Tag</label>
                    <div class="radio-group">
                        <input type="radio" id="tag-none" name="product-tag" value="none" checked>
                        <label for="tag-none">None</label>
                        
                        <input type="radio" id="tag-featured" name="product-tag" value="featured">
                        <label for="tag-featured">Featured</label>
                        
                        <input type="radio" id="tag-sale" name="product-tag" value="sale">
                        <label for="tag-sale">Sale</label>
                        
                        <input type="radio" id="tag-new" name="product-tag" value="new">
                        <label for="tag-new">New</label>
                    </div>
                </div>
                
                <button type="submit" class="add-product-submit">Add Product</button>
            </form>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modal);
    console.log('Add product modal added to document');
    
    // Set up modal close button
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Set up form submission
    const form = modal.querySelector('#add-product-form');
    if (form) {
        form.addEventListener('submit', handleAddProductSubmit);
        console.log('Event listener added to add product form');
    }
}

// Function to handle add product form submission
async function handleAddProductSubmit(e) {
    e.preventDefault();
    console.log('Add product form submitted');
    
    // Get form values
    const name = document.getElementById('product-name').value;
    const brand = document.getElementById('product-brand').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const imageUrl = document.getElementById('product-image').value;
    const tagType = document.querySelector('input[name="product-tag"]:checked').value;
    
    console.log('Form data:', { name, brand, category, price, description, imageUrl, tagType });
    
    try {
        // Prepare data for database - match your products table schema exactly
        const productData = {
            title: name,
            product_description: description,
            price: parseInt(price), // Convert to integer since price is INT in your DB
            image_url: imageUrl,
            category: category,
            brand: brand // Save brand in localStorage for frontend use
        };
        
        console.log('Sending to database:', productData);
        
        // Send product data to server
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error('Failed to add product to database');
        }
        
        const result = await response.json();
        console.log('Product added successfully:', result);
        
        // Create product object for the UI with proper ID returned from server
        const productId = result.productId || result.id || Date.now();
        
        // Also save products to localStorage for persistence between page loads
        saveProductToLocalStorage({
            id: productId,
            brand: brand,
            name: name,
            category: category,
            price: price,
            description: description,
            image: imageUrl,
            tagType: tagType !== 'none' ? tagType : null
        });
        
        // Create UI product object
        const newProduct = {
            id: productId,
            brand: brand,
            name: name,
            category: category,
            price: price,
            description: description,
            image: imageUrl,
            tagType: tagType !== 'none' ? tagType : null
        };
        
        // Add product to page
        createProductCard(newProduct);
        
        // Reset form and close modal
        document.getElementById('add-product-form').reset();
        document.getElementById('add-product-modal').style.display = 'none';
        
        // Show success notification
        showNotification('Product added successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product: ' + error.message, 'error');
    }
}

// Function to save product to localStorage for persistence
function saveProductToLocalStorage(product) {
    // Get existing products
    let savedProducts = JSON.parse(localStorage.getItem('beautyProducts') || '[]');
    
    // Add new product
    savedProducts.push(product);
    
    // Save back to localStorage
    localStorage.setItem('beautyProducts', JSON.stringify(savedProducts));
    console.log('Product saved to localStorage:', product);
}

// Function to load products from localStorage
function loadProductsFromLocalStorage() {
    const savedProducts = JSON.parse(localStorage.getItem('beautyProducts') || '[]');
    console.log('Loaded products from localStorage:', savedProducts);
    
    // If page is skincare, only show skincare products
    // If page is makeup, only show makeup products
    const pageType = window.location.pathname.includes('skincare.html') ? 'skincare' : 
                    window.location.pathname.includes('makeup.html') ? 'makeup' : 'all';
    
    savedProducts.forEach(product => {
        const category = product.category.toLowerCase();
        
        // Filter by page type
        if (pageType === 'skincare' && (['cleanser', 'moisturizer', 'treatment', 'sunscreen', 'toner'].includes(category))) {
            createProductCard(product);
        } else if (pageType === 'makeup' && (['face', 'eyes', 'lips', 'cheeks', 'brushes'].includes(category))) {
            createProductCard(product);
        } else if (pageType === 'all') {
            createProductCard(product);
        }
    });
}

// Function to load products from the database
async function loadProductsFromDatabase() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        console.log('Products loaded from database:', products);
        
        // Clear localStorage products first 
        localStorage.removeItem('beautyProducts');
        
        // Process each product
        products.forEach(product => {
            // Convert database product to UI product
            const uiProduct = {
                id: product.product_id,
                name: product.title,
                brand: product.brand || 'Brand', // Fallback if brand not stored
                description: product.product_description,
                price: parseFloat(product.price),
                category: product.category,
                image: product.image_url,
                tagType: null // No tag by default
            };
            
            // Save to localStorage for persistence
            saveProductToLocalStorage(uiProduct);
            
            // Don't create cards here, loadProductsFromLocalStorage will do that
        });
        
        // Now load products from localStorage to display them
        loadProductsFromLocalStorage();
        
    } catch (error) {
        console.error('Error loading products from database:', error);
        
        // Fallback to localStorage if database fetch fails
        loadProductsFromLocalStorage();
    }
}

// Function to create a product card and add it to the page
function createProductCard(product) {
    console.log('Creating product card:', product);
    
    // Create product card element
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-product-id', product.id);
    productCard.setAttribute('data-category', product.category.toLowerCase());
    
    // Add tag if specified
    if (product.tagType) {
        const tagElement = document.createElement('div');
        tagElement.className = `${product.tagType}-tag`;
        tagElement.textContent = product.tagType === 'featured' ? 'Featured' : 
                               product.tagType === 'sale' ? '20% OFF' : 'New';
        productCard.appendChild(tagElement);
    }
    
    // Add product image
    const imageElement = document.createElement('img');
    imageElement.src = product.image;
    imageElement.alt = product.name;
    imageElement.className = 'product-image';
    productCard.appendChild(imageElement);
    
    // Add product info
    const infoElement = document.createElement('div');
    infoElement.className = 'product-info';
    
    const brandElement = document.createElement('div');
    brandElement.className = 'product-brand';
    brandElement.textContent = product.brand;
    infoElement.appendChild(brandElement);
    
    const nameElement = document.createElement('h3');
    nameElement.className = 'product-name';
    nameElement.textContent = product.name;
    infoElement.appendChild(nameElement);
    
    const categoryElement = document.createElement('span');
    categoryElement.className = 'product-category';
    categoryElement.textContent = product.category;
    infoElement.appendChild(categoryElement);
    
    const descElement = document.createElement('p');
    descElement.className = 'product-description';
    descElement.textContent = product.description;
    infoElement.appendChild(descElement);
    
    const priceElement = document.createElement('p');
    priceElement.className = 'product-price';
    priceElement.textContent = `$${product.price.toFixed(2)}`;
    infoElement.appendChild(priceElement);
    
    productCard.appendChild(infoElement);
    
    // Add quick add button
    const quickAddBtn = document.createElement('button');
    quickAddBtn.className = 'quick-add';
    quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
    quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Use existing addToCart function or create a simple one
        try {
            addToCart(product.id, 1);
            
            // Animation feedback
            quickAddBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
            }, 1000);
        } catch (err) {
            console.log('Error adding to cart, using simplified version');
            
            // Simple cart implementation if the page's addToCart doesn't exist
            let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('beautyCart', JSON.stringify(cart));
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const count = parseInt(cartCount.textContent || '0');
                cartCount.textContent = count + 1;
            }
            
            // Animation feedback
            quickAddBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
            }, 1000);
        }
    });
    productCard.appendChild(quickAddBtn);
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-product-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.onclick = async (e) => {
        e.stopPropagation();
        
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                // Send delete request to server
                const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                
                // Remove from localStorage
                removeProductFromLocalStorage(product.id);
                
                // Remove product card from DOM with animation
                productCard.style.opacity = '0.5';
                setTimeout(() => {
                    productCard.remove();
                }, 300);
                
                showNotification('Product deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Error deleting product: ' + error.message, 'error');
            }
        }
    };
    productCard.appendChild(deleteBtn);
    
    // Add click event to open modal
    productCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('quick-add') && !e.target.closest('.quick-add') &&
            !e.target.classList.contains('delete-product-btn') && !e.target.closest('.delete-product-btn')) {
            
            // Use existing openProductModal function or create a simple one
            try {
                openProductModal(product.id);
            } catch (err) {
                console.log('Error opening product modal, using simplified version');
                
                // Create a simple product modal if needed
                const modal = document.getElementById('product-modal');
                if (modal) {
                    document.getElementById('modal-product-image').src = product.image;
                    document.getElementById('modal-product-brand').textContent = product.brand;
                    document.getElementById('modal-product-name').textContent = product.name;
                    document.getElementById('modal-product-category').textContent = product.category;
                    document.getElementById('modal-product-description').textContent = product.description;
                    document.getElementById('modal-product-price').textContent = `$${product.price.toFixed(2)}`;
                    
                    // Set product ID for add to cart button
                    document.querySelector('.add-to-cart').setAttribute('data-product-id', product.id);
                    
                    modal.style.display = 'flex';
                }
            }
        }
    });
    
    // Add the card to the appropriate container based on category
    let productsContainer;
    
    // For skincare products
    if (['cleanser', 'moisturizer', 'treatment', 'sunscreen', 'toner'].includes(product.category.toLowerCase())) {
        productsContainer = document.getElementById('skincare-products');
    } 
    // For makeup products
    else if (['face', 'eyes', 'lips', 'cheeks', 'brushes'].includes(product.category.toLowerCase())) {
        productsContainer = document.getElementById('makeup-products');
    }
    
    // Fallback to any products grid if specific container not found
    if (!productsContainer) {
        productsContainer = document.querySelector('.products-grid');
    }
    
    // Add the product card to the container
    if (productsContainer) {
        productsContainer.appendChild(productCard);
        console.log('Product card added to container:', productsContainer.id || 'products-grid');
    } else {
        console.error('No suitable product container found');
    }
    
    return productCard;
}

// Function to remove product from localStorage
function removeProductFromLocalStorage(productId) {
    let savedProducts = JSON.parse(localStorage.getItem('beautyProducts') || '[]');
    savedProducts = savedProducts.filter(product => product.id !== productId);
    localStorage.setItem('beautyProducts', JSON.stringify(savedProducts));
    console.log('Product removed from localStorage:', productId);
}

// Function to add delete buttons to existing products
function addDeleteButtonsToProducts() {
    console.log('Adding delete buttons to existing products');
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (!card.querySelector('.delete-product-btn')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-product-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                
                if (confirm('Are you sure you want to delete this product?')) {
                    const productId = card.getAttribute('data-product-id');
                    
                    // Send delete request to server
                    fetch(`http://localhost:5000/api/products/${productId}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            // Remove from localStorage
                            removeProductFromLocalStorage(parseInt(productId));
                            
                            // Remove from DOM
                            card.style.opacity = '0.5';
                            setTimeout(() => {
                                card.remove();
                            }, 300);
                            showNotification('Product deleted successfully', 'success');
                        } else {
                            throw new Error('Failed to delete product');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('Error deleting product', 'error');
                    });
                }
            };
            card.appendChild(deleteBtn);
        }
    });
}

// Function to show notification
function showNotification(message, type) {
    console.log('Showing notification:', message, type);
    
    // Create notification element if it doesn't exist
    let notification = document.getElementById('admin-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'admin-notification';
        
        // Add styles for notification
        const style = document.createElement('style');
        style.textContent = `
            #admin-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                transform: translateY(-100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            #admin-notification.success {
                background-color: #4CAF50;
            }
            #admin-notification.error {
                background-color: #f44336;
            }
            #admin-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
    }
    
    // Set notification content and class
    notification.textContent = message;
    notification.className = type;
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}