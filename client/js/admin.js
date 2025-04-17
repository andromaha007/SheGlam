console.log('Admin script loaded');

// Check if admin is logged in on script load
const isAdmin = localStorage.getItem('isAdmin') === 'true';
console.log('Is admin status:', isAdmin);

// Wait for DOM to be fully loaded before initializing admin features
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in admin.js');
    initAdminInterface();
});

// Function to initialize admin interface
function initAdminInterface() {
    // Only proceed if user is admin
    if (!isAdmin) {
        console.log('Not an admin, skipping admin interface initialization');
        return;
    }
    
    console.log('Initializing admin interface');
    
    // Show admin button and hide cart icon
    setupAdminVisibility();
    
    // Ensure add product button exists and works
    setupAddProductButton();
    
    // Ensure the add product modal exists
    createAddProductModal();
    
    // Add delete buttons to existing products
    addDeleteButtonsToProducts();
}

// Function to set up admin visibility elements
function setupAdminVisibility() {
    // Hide cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.display = 'none';
    }
    
    // Show add product element
    const addProductElement = document.querySelector('.add-product');
    if (addProductElement) {
        addProductElement.style.display = 'flex';
    }
    
    // Create admin controls button if it doesn't exist
    if (!document.querySelector('.admin-controls-btn')) {
        addAdminControls();
    }
}

// Function to add admin controls to navigation
function addAdminControls() {
    // Add admin control panel button to nav
    const nav = document.querySelector('nav');
    
    // Create admin controls button
    const adminBtn = document.createElement('div');
    adminBtn.className = 'admin-controls-btn';
    adminBtn.innerHTML = '<i class="fas fa-tools"></i> Admin';
    adminBtn.style.marginLeft = '20px';
    adminBtn.style.cursor = 'pointer';
    
    // Add click event to toggle admin panel
    adminBtn.addEventListener('click', toggleAdminPanel);
    
    // Add to nav
    if (nav) {
        nav.appendChild(adminBtn);
    }
    
    // Add admin panel container (initially hidden)
    createAdminPanel();
}

// Function to create admin panel
function createAdminPanel() {
    if (document.getElementById('admin-panel')) {
        return; // Panel already exists
    }
    
    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.style.display = 'none';
    
    // Add panel content
    adminPanel.innerHTML = `
        <h3 style="margin-top: 0; color: var(--primary);">Admin Controls</h3>
        <div style="margin-top: 15px;">
            <button id="add-product-btn" style="display: block; width: 100%; padding: 10px; background-color: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px;">
                <i class="fas fa-plus"></i> Add New Product
            </button>
            <div style="font-size: 0.9rem; color: #666; margin-top: 15px;">
                <p><i class="fas fa-info-circle"></i> Click trash icon on product cards to delete products.</p>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(adminPanel);
    
    // Add event listener to add product button
    document.getElementById('add-product-btn').addEventListener('click', function() {
        document.getElementById('admin-panel').style.display = 'none';
        showAddProductModal();
    });
}

// Function to toggle admin panel
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (!panel) {
        console.error('Admin panel not found');
        return;
    }
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

// Function to setup the add product button
function setupAddProductButton() {
    let addProductElement = document.querySelector('.add-product');
    
    // Create add product element if it doesn't exist
    if (!addProductElement) {
        console.log('Creating add product button');
        addProductElement = document.createElement('div');
        addProductElement.className = 'add-product';
        addProductElement.style.display = 'flex';
        addProductElement.innerHTML = '<button class="add-product-button">+</button>';
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(addProductElement);
        } else {
            console.error('Nav element not found');
            return;
        }
    }
    
    // Add event listener to the button
    const addButton = addProductElement.querySelector('.add-product-button');
    if (addButton) {
        // Clear any existing event listeners by cloning and replacing
        const newButton = addButton.cloneNode(true);
        addButton.parentNode.replaceChild(newButton, addButton);
        
        // Add new event listener
        newButton.addEventListener('click', function() {
            console.log('Add button clicked');
            showAddProductModal();
        });
    } else {
        console.error('Add button not found inside .add-product');
    }
}

// Function to show add product modal
function showAddProductModal() {
    console.log('Showing add product modal');
    
    // Check if modal exists
    let modal = document.getElementById('add-product-modal');
    
    // If modal doesn't exist, create it
    if (!modal) {
        console.log('Creating modal');
        createAddProductModal();
        modal = document.getElementById('add-product-modal');
    }
    
    // Show the modal
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error('Modal not found after creation attempt');
    }
}
// Function to create the add product modal
function createAddProductModal() {
    console.log('Creating add product modal');
    
    // Skip if modal already exists
    if (document.getElementById('add-product-modal')) {
        console.log('Modal already exists, skipping creation');
        return;
    }
    
    // Create the modal element directly instead of using innerHTML
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
                
                <button type="submit" class="add-product-submit">Add Product</button>
            </form>
        </div>
    `;
    
    // Add the modal to the document body
    document.body.appendChild(modal);
    console.log('Modal added to document body');
    
    // Verify the modal was added correctly
    const addedModal = document.getElementById('add-product-modal');
    if (!addedModal) {
        console.error('Failed to create modal - not found after creation');
        return;
    }
    
    console.log('Modal created successfully');
    
    // Set up event listeners
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.error('Close button not found in modal');
    }
    
    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Form submission
    const form = modal.querySelector('#add-product-form');
    if (form) {
        form.addEventListener('submit', handleAddProductSubmit);
    } else {
        console.error('Form not found in modal');
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
    
    console.log('Submitting product:', { title, category, price, description, image_url });
    
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
            description: description,
            price: price,
            image_url: image_url,
            category: category
        };
        
        addNewProductToPage(productData);
        
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

// Function to add new product to the page
function addNewProductToPage(product) {
    // Create product card
    const card = createProductCardFromDb(product);
    
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
    } else {
        console.error('No suitable product container found');
    }
}

// Function to create product card from database product
function createProductCardFromDb(product) {
    // Create product card container
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Set category if available
    if (product.category) {
        card.setAttribute('data-category', product.category.toLowerCase());
    }
    
    // Add product image
    const img = document.createElement('img');
    img.src = product.image_url || '/assets/default-product.jpg';
    img.alt = product.title;
    img.className = 'product-image';
    card.appendChild(img);
    
    // Add product info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    // Add product name
    const nameEl = document.createElement('h3');
    nameEl.className = 'product-name';
    nameEl.textContent = product.title;
    infoDiv.appendChild(nameEl);
    
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
        addToCart(product.id, 1);
        
        // Animation feedback
        quickAddBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            quickAddBtn.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1000);
    });
    card.appendChild(quickAddBtn);
    
    // Add delete button for admin
    if (isAdmin) {
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
            openProductModal(product);
        }
    });
    
    return card;
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
            alert('Default products cannot be deleted. You can only delete products that you have added.');
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

// Function to open product modal
function openProductModal(product) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('product-modal');
    
    if (!modal) {
        // Create modal container
        modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'modal';
        
        // Create modal content HTML
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="product-details">
                    <div class="product-image-container">
                        <img id="modal-product-image" alt="Product Image">
                    </div>
                    <div class="product-info">
                        <h2 id="modal-product-name"></h2>
                        <p id="modal-product-description"></p>
                        <div class="price" id="modal-product-price"></div>
                        <button class="add-to-cart">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add close event listener
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Update modal content with product details
    document.getElementById('modal-product-image').src = product.image_url || '/assets/default-product.jpg';
    document.getElementById('modal-product-name').textContent = product.title;
    document.getElementById('modal-product-description').textContent = product.description || '';
    document.getElementById('modal-product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
    
    // Set product ID for add to cart button
    const addToCartBtn = modal.querySelector('.add-to-cart');
    addToCartBtn.setAttribute('data-product-id', product.id);
    
    // Add event listener to add to cart button
    addToCartBtn.onclick = function() {
        addToCart(product.id, 1);
        modal.style.display = 'none';
        showNotification('Product added to cart', 'success');
    };
    
    // Display the modal
    modal.style.display = 'flex';
}

// Helper function to add to cart
function addToCart(productId, quantity) {
    // This is a placeholder for the actual addToCart function
    // It should update the cart in localStorage and update the UI
    console.log(`Added product ID ${productId} to cart with quantity ${quantity}`);
    
    // Update cart count in UI
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent || '0');
        cartCount.textContent = currentCount + quantity;
    }
    
    return true;
}