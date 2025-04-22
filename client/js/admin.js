// Wait for DOM to be fully loaded before initializing admin features
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in admin.js');
    
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('Is admin status:', isAdmin);
    
    if (isAdmin) {
        console.log('Admin user detected, initializing admin features');
        initAdminInterface();
    } else {
        console.log('Not an admin user, skipping admin features');
    }
});

// Function to initialize admin interface
function initAdminInterface() {
    console.log('Initializing admin interface');
    
    // First create or ensure the add product modal exists
    ensureAddProductModalExists();
    
    // Setup admin UI elements
    setupAdminUI();
    
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
        addProductBtn.style.display = 'flex';
        addProductBtn.innerHTML = '<button class="add-product-button">+</button>';
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(addProductBtn);
            console.log('Add product button created and added to nav');
        }
    }
    
    // Set up the add product button
    setupAddProductButton();
}

// Function to ensure the add product modal exists
function ensureAddProductModalExists() {
    if (!document.getElementById('add-product-modal')) {
        console.log('Add product modal not found, creating it');
        createAddProductModal();
    } else {
        console.log('Add product modal already exists');
    }
}

// Function to create add product modal
function createAddProductModal() {
    console.log('Creating add product modal');
    
    // Skip if modal already exists
    if (document.getElementById('add-product-modal')) {
        console.log('Modal already exists, skipping creation');
        return;
    }
    
    // Create the modal element
    const modal = document.createElement('div');
    modal.id = 'add-product-modal';
    modal.className = 'modal';
    
    // Set the modal HTML content
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
    
    // Add the modal to the document body
    document.body.appendChild(modal);
    console.log('Add product modal created and added to document');
    
    // Verify the modal was added correctly
    const addedModal = document.getElementById('add-product-modal');
    if (!addedModal) {
        console.error('Failed to create modal - not found after creation');
        return;
    }
    
    console.log('Modal created successfully');
    
    // Set up modal close button
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.error('Close button not found in modal');
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
    } else {
        console.error('Form not found in modal');
    }
}

// Function to set up add product button
function setupAddProductButton() {
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
            showAddProductModal();
        });
        
        console.log('Event listener added to add product button');
    } else {
        console.error('Add product button not found');
    }
}

// Function to show add product modal
function showAddProductModal() {
    console.log('Showing add product modal');
    
    // Check if modal exists
    let modal = document.getElementById('add-product-modal');
    
    // If modal doesn't exist, create it
    if (!modal) {
        console.log('Modal not found, creating it');
        createAddProductModal();
        modal = document.getElementById('add-product-modal');
    }
    
    // Show the modal
    if (modal) {
        console.log('Displaying modal');
        modal.style.display = 'flex';
    } else {
        console.error('Modal not found after creation attempt');
    }
}

// Function to handle add product form submission
async function handleAddProductSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const title = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const image_url = document.getElementById('product-image').value;
    const brand = document.getElementById('product-brand').value;
    const tagType = document.querySelector('input[name="product-tag"]:checked').value;
    
    console.log('Submitting product:', { title, category, price, description, image_url, brand });
    
    try {
        // Send to server
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                price,
                image_url,
                category
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error('Failed to add product: ' + errorText);
        }
        
        const result = await response.json();
        console.log('Product added:', result);
        
        // Create and add the new product card to the page
        const productData = {
            id: result.productId,
            title: title,
            name: title,
            brand: brand,
            description: description,
            price: price,
            image: image_url,
            image_url: image_url,
            category: category,
            tagType: tagType !== 'none' ? tagType : null
        };
        
        createAndAddProductCard(productData);
        
        // Reset form and close modal
        document.getElementById('add-product-form').reset();
        document.getElementById('add-product-modal').style.display = 'none';
        
        // Show success message
        showNotification('Product added successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product: ' + error.message, 'error');
    }
}

// Function to create and add product card to the page
function createAndAddProductCard(product) {
    // Create product card
    const card = createProductCard(product);
    
    // Find the appropriate container based on product category or current page
    let productContainer;
    
    // First try to find by category
    if (product.category) {
        if (['cleanser', 'moisturizer', 'treatment', 'sunscreen', 'toner'].includes(product.category.toLowerCase())) {
            productContainer = document.getElementById('skincare-products');
        } else if (['face', 'eyes', 'lips', 'cheeks', 'brushes'].includes(product.category.toLowerCase())) {
            productContainer = document.getElementById('makeup-products');
        }
    }
    
    // If no container found by category, try by current page
    if (!productContainer) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('makeup.html')) {
            productContainer = document.getElementById('makeup-products');
        } else if (currentPage.includes('skincare.html')) {
            productContainer = document.getElementById('skincare-products');
        } else if (currentPage.includes('index.html')) {
            productContainer = document.getElementById('popular-products');
        }
    }
    
    // If still no container, use any products grid
    if (!productContainer) {
        productContainer = document.querySelector('.products-grid');
    }
    
    // Add the card to the container
    if (productContainer) {
        productContainer.appendChild(card);
        console.log('Added product card to container:', productContainer.id || 'products-grid');
    } else {
        console.error('No suitable product container found');
    }
}

// Function to create product card from database product
function createProductCard(product) {
    // Create product card container
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Set category if available
    if (product.category) {
        card.setAttribute('data-category', product.category.toLowerCase());
    }
    
    // Add tag if specified
    if (product.tagType) {
        const tagElement = document.createElement('div');
        tagElement.className = `${product.tagType}-tag`;
        tagElement.textContent = product.tagType === 'featured' ? 'Featured' : 
                               product.tagType === 'sale' ? '20% OFF' : 'New';
        card.appendChild(tagElement);
    }
    
    // Add product image
    const img = document.createElement('img');
    img.src = product.image_url || product.image || '/assets/default-product.jpg';
    img.alt = product.title || product.name;
    img.className = 'product-image';
    card.appendChild(img);
    
    // Add product info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    // Add brand if available
    if (product.brand) {
        const brandEl = document.createElement('div');
        brandEl.className = 'product-brand';
        brandEl.textContent = product.brand;
        infoDiv.appendChild(brandEl);
    }
    
    // Add product name
    const nameEl = document.createElement('h3');
    nameEl.className = 'product-name';
    nameEl.textContent = product.title || product.name;
    infoDiv.appendChild(nameEl);
    
    // Add category tag if available
    if (product.category) {
        const catEl = document.createElement('span');
        catEl.className = 'product-category';
        catEl.textContent = product.category;
        infoDiv.appendChild(catEl);
    }
    
    // Add product description
    const descEl = document.createElement('p');
    descEl.className = 'product-description';
    descEl.textContent = product.description || '';
    infoDiv.appendChild(descEl);
    
    // Add product price
    const priceEl = document.createElement('p');
    priceEl.className = 'product-price';
    priceEl.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    infoDiv.appendChild(priceEl);
    
    // Add info div to card
    card.appendChild(infoDiv);
    
    // Add quick add button
    const quickAddBtn = document.createElement('button');
    quickAddBtn.className = 'quick-add';
    quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
    quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        try {
            // Try to use existing addToCart function
            addToCart(product.id, 1);
        } catch (err) {
            console.log('Using simplified cart function');
            // Simple implementation if addToCart doesn't exist
            let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.title || product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image_url || product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('beautyCart', JSON.stringify(cart));
            
            // Update cart count if possible
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const count = parseInt(cartCount.textContent || '0');
                cartCount.textContent = count + 1;
            }
        }
        
        // Animation feedback
        quickAddBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1000);
    });
    card.appendChild(quickAddBtn);
    
    // Add delete button for admin
    if (localStorage.getItem('isAdmin') === 'true') {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-product-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await deleteProductFromDatabase(product.id);
                    
                    // Remove card with animation
                    card.style.opacity = '0.5';
                    setTimeout(() => {
                        card.remove();
                    }, 300);
                    
                    showNotification('Product deleted successfully', 'success');
                } catch (error) {
                    showNotification('Failed to delete product', 'error');
                }
            }
        };
        card.appendChild(deleteBtn);
    }
    
    // Add click event to view product details
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('quick-add') && !e.target.closest('.quick-add') 
            && !e.target.classList.contains('delete-product-btn') && !e.target.closest('.delete-product-btn')) {
            
            try {
                // Try using standard openProductModal function first
                openProductModal(product.id);
            } catch (err) {
                console.log('Using custom modal opening:', err);
                openProductModalWithData(product);
            }
        }
    });
    
    return card;
}

// Function to open product modal with product data
function openProductModalWithData(product) {
    const modal = document.getElementById('product-modal');
    
    if (!modal) {
        console.error('Product modal not found');
        return;
    }
    
    const imgEl = modal.querySelector('#modal-product-image');
    const brandEl = modal.querySelector('#modal-product-brand');
    const nameEl = modal.querySelector('#modal-product-name');
    const catEl = modal.querySelector('#modal-product-category');
    const descEl = modal.querySelector('#modal-product-description');
    const priceEl = modal.querySelector('#modal-product-price');
    const addToCartBtn = modal.querySelector('.add-to-cart');
    
    if (imgEl) imgEl.src = product.image_url || product.image || '/assets/default-product.jpg';
    if (imgEl) imgEl.alt = product.title || product.name;
    if (brandEl) brandEl.textContent = product.brand || '';
    if (nameEl) nameEl.textContent = product.title || product.name;
    if (catEl) catEl.textContent = product.category || '';
    if (descEl) descEl.textContent = product.description || '';
    if (priceEl) priceEl.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-product-id', product.id);
        addToCartBtn.onclick = function() {
            try {
                addToCart(product.id, 1);
                modal.style.display = 'none';
            } catch (err) {
                console.log('Using simplified cart function in modal');
                // Simple implementation
                let cart = JSON.parse(localStorage.getItem('beautyCart')) || [];
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.title || product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.image_url || product.image,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('beautyCart', JSON.stringify(cart));
                
                // Update cart count if possible
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    const count = parseInt(cartCount.textContent || '0');
                    cartCount.textContent = count + 1;
                }
                
                modal.style.display = 'none';
            }
        };
    }
    
    modal.style.display = 'flex';
}

// Function to add delete buttons to existing products
function addDeleteButtonsToProducts() {
    // Add delete buttons to existing product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Skip if already has delete button
        if (card.querySelector('.delete-product-btn')) {
            return;
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-product-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            
            if (confirm('Are you sure you want to delete this product?')) {
                const productId = card.getAttribute('data-product-id');
                
                if (productId) {
                    deleteProductFromDatabase(productId)
                        .then(() => {
                            // Remove card with animation
                            card.style.opacity = '0.5';
                            setTimeout(() => {
                                card.remove();
                            }, 300);
                            
                            showNotification('Product deleted successfully', 'success');
                        })
                        .catch(error => {
                            console.error('Error deleting product:', error);
                            showNotification('Failed to delete product', 'error');
                        });
                } else {
                    alert('This is a default product that cannot be deleted.');
                }
            }
        };
        card.appendChild(deleteBtn);
    });
}

// Function to delete a product from the database
async function deleteProductFromDatabase(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        const result = await response.json();
        console.log('Product deleted successfully:', result);
        return result;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Function to show notification
function showNotification(message, type) {
    // Create notification element if it doesn't exist
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Add style for notification
        const style = document.createElement('style');
        style.textContent = `
            #notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateY(-100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            #notification.success {
                background-color: #4CAF50;
            }
            #notification.error {
                background-color: #f44336;
            }
            #notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update notification content and show it
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}