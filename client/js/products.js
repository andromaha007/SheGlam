
const productsFallback = {
    skincare: [ /* your skincare array here */ ],
    makeup: [ /* your makeup array here */ ]
};

const popularProducts = [
    productsFallback.skincare[0],
    productsFallback.makeup[1],
    productsFallback.skincare[7],
    productsFallback.makeup[9],
    productsFallback.skincare[4],
    productsFallback.makeup[3],
];

// Main function to load products from API or fallback
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const apiProducts = await response.json();
        return apiProducts;
    } catch (error) {
        console.warn('Using fallback products due to error:', error.message);
        return [...productsFallback.makeup, ...productsFallback.skincare];
    }
}

// Load and display products on page
async function loadProductsFromDatabase() {
    try {
        const productsGrid = document.getElementById('makeup-products');
        if (productsGrid) {
            productsGrid.innerHTML = '';
            const loadingElement = document.createElement('div');
            loadingElement.className = 'loading-indicator';
            loadingElement.textContent = 'Loading products...';
            loadingElement.style.textAlign = 'center';
            loadingElement.style.padding = '2rem';
            loadingElement.style.gridColumn = '1 / -1';
            productsGrid.appendChild(loadingElement);
        }

        const products = await loadProducts();

        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) loadingIndicator.remove();

        const makeupCategories = ['face', 'eyes', 'lips', 'cheeks', 'brushes', 'makeup'];
        const makeupProducts = products.filter(product =>
            makeupCategories.includes(product.category.toLowerCase())
        );

        if (makeupProducts.length === 0) {
            const noProductsMsg = document.createElement('div');
            noProductsMsg.textContent = 'No makeup products found.';
            noProductsMsg.style.textAlign = 'center';
            noProductsMsg.style.padding = '2rem';
            noProductsMsg.style.gridColumn = '1 / -1';
            productsGrid.appendChild(noProductsMsg);
            return;
        }

        // Define global products array
        window.products = makeupProducts;

        // Create cards
        makeupProducts.forEach(product => {
            const formattedProduct = {
                id: product.id,
                name: product.name || product.title,
                brand: product.brand || 'Brand Not Specified',
                category: product.category,
                price: product.price,
                description: product.description,
                image: product.image || product.image_url,
                tagType: product.featured ? 'featured' : 
                         (product.sale ? 'sale' : 
                         (product.new ? 'new' : null))
            };
            createProductCard(formattedProduct);
        });

        setupProductCards();

    } catch (error) {
        console.error('Error loading products:', error);

        const productsGrid = document.getElementById('makeup-products');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                    <p>Failed to load products. Please try again later.</p>
                    <button id="retry-load" style="padding: 0.5rem 1rem; margin-top: 1rem; background-color: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
            document.getElementById('retry-load').addEventListener('click', loadProductsFromDatabase);
        }
    }
}
