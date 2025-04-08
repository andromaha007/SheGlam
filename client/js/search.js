// Common search functionality for all pages
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm.length > 0) {
                // Store the search term in localStorage to use across pages
                localStorage.setItem('beautySearchTerm', searchTerm);
                
                // If on the home page, redirect to search results
                if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                    // Hide all sections
                    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
                    // Show search results section
                    document.getElementById('search-results').classList.add('active');
                    // Search within current page
                    performSearch(searchTerm);
                } else {
                    // If on another page, redirect to home with search parameter
                    window.location.href = 'index.html?search=' + encodeURIComponent(searchTerm);
                }
            }
        }
    });
    
    // Check if we arrived from a search redirect
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        
        if (searchParam) {
            // Set the search input value
            searchInput.value = searchParam;
            // Hide all sections
            document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
            // Show search results section
            document.getElementById('search-results').classList.add('active');
            // Perform the search
            performSearch(searchParam);
        } else {
            // Check if there's a stored search term
            const storedSearch = localStorage.getItem('beautySearchTerm');
            if (storedSearch) {
                searchInput.value = storedSearch;
                // Hide all sections
                document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
                // Show search results section
                document.getElementById('search-results').classList.add('active');
                // Perform the search
                performSearch(storedSearch);
                // Clear the stored search
                localStorage.removeItem('beautySearchTerm');
            }
        }
    }
}

// Function to perform search
function performSearch(term) {
    // Get all product data
    let allProducts = [];
    
    // Add products from the page
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const brand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        const price = card.querySelector('.product-price')?.textContent || '';
        const image = card.querySelector('.product-image')?.src || '';
        const category = card.querySelector('.product-category')?.textContent || 
                      card.getAttribute('data-category') || '';
        
        allProducts.push({
            id: productId,
            name: name,
            brand: brand,
            description: description,
            price: price,
            image: image,
            category: category,
            element: card.cloneNode(true)
        });
    });
    
    // Filter products by search term
    const filteredProducts = allProducts.filter(product => {
        return product.name.includes(term) || 
               product.brand.includes(term) || 
               product.description.includes(term) ||
               product.category.toLowerCase().includes(term);
    });
    
    // Display results
    displaySearchResults(filteredProducts, term);
}

// Function to display search results
function displaySearchResults(products, term) {
    const resultsContainer = document.getElementById('search-products');
    resultsContainer.innerHTML = '';
    
    // Update the search heading
    const searchHeading = document.querySelector('#search-results h1');
    searchHeading.textContent = `Search Results for "${term}"`;
    
    if (products.length === 0) {
        // No results found
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.textAlign = 'center';
        noResults.style.width = '100%';
        noResults.style.padding = '2rem';
        
        noResults.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
            <h3>No products found</h3>
            <p>Try searching with different keywords or browse our categories.</p>
            <div style="margin-top: 1.5rem;">
                <a href="skincare.html" style="display: inline-block; padding: 0.8rem 1.5rem; background-color: var(--primary-light); color: var(--dark); border-radius: 30px; margin: 0.5rem; text-decoration: none;">
                    <i class="fas fa-arrow-right"></i> Browse Skincare
                </a>
                <a href="makeup.html" style="display: inline-block; padding: 0.8rem 1.5rem; background-color: var(--primary-light); color: var(--dark); border-radius: 30px; margin: 0.5rem; text-decoration: none;">
                    <i class="fas fa-arrow-right"></i> Browse Makeup
                </a>
            </div>
        `;
        
        resultsContainer.appendChild(noResults);
    } else {
        // Display search results count
        const resultsCount = document.createElement('div');
        resultsCount.className = 'results-count';
        resultsCount.style.marginBottom = '1.5rem';
        resultsCount.style.fontWeight = '500';
        resultsCount.textContent = `Found ${products.length} product${products.length !== 1 ? 's' : ''}`;
        
        resultsContainer.appendChild(resultsCount);
        
        // Display products
        products.forEach(product => {
            const clone = product.element;
            
            // Make sure event listeners are set up for the cloned elements
            const quickAddBtn = clone.querySelector('.quick-add');
            if (quickAddBtn) {
                quickAddBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Get the product ID
                    const productId = parseInt(clone.getAttribute('data-product-id'));
                    // Call addToCart function if it exists
                    if (typeof addToCart === 'function') {
                        addToCart(productId, 1);
                        
                        // Animation feedback
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-plus"></i>';
                        }, 1000);
                    }
                });
            }
            
            // Add click event to open product modal
            clone.addEventListener('click', function(e) {
                if (!e.target.classList.contains('quick-add') && !e.target.closest('.quick-add')) {
                    const productId = parseInt(this.getAttribute('data-product-id'));
                    if (typeof openProductModal === 'function') {
                        openProductModal(productId);
                    }
                }
            });
            
            resultsContainer.appendChild(clone);
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
});