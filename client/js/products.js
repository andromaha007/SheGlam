const products = {
    skincare: [
        {
            id: 'sc1',
            name: 'CeraVe Hydrating Facial Cleanser',
            price: 24.99,
            description: 'A gentle, non-irritating cleanser that effectively removes makeup and impurities while maintaining skin\'s natural moisture balance with ceramides and hyaluronic acid.',
            image: 'assets/cerave_daily_hydrating-cleanser.webp',
            category: 'skincare'
        },
        {
            id: 'sc2',
            name: 'Estée Lauder Advanced Night Repair',
            price: 75.99,
            description: 'Advanced night repair synchronized multi-recovery complex that works while you sleep to repair and rejuvenate your skin.',
            image: 'assets/estee.webp',
            category: 'skincare'
        },
        {
            id: 'sc3',
            name: 'Paula\'s Choice 2% BHA Exfoliant',
            price: 32.99,
            description: 'A gentle leave-on exfoliant with 2% BHA (salicylic acid) that removes dead skin cells and unclogs pores for smoother skin.',
            image: 'assets/paulas_choice.webp',
            category: 'skincare'
        },
        {
            id: 'sc4',
            name: 'Neutrogena Hydro Boost Gel-Cream',
            price: 19.99,
            description: 'A lightweight yet deeply hydrating moisturizer with hyaluronic acid, suitable for all skin types.',
            image: 'assets/neutrogena.jpg',
            category: 'skincare'
        },
        {
            id: 'sc5',
            name: 'La Roche-Posay Anthelios Sunscreen SPF 50',
            price: 33.99,
            description: 'Broad-spectrum protection against UVA and UVB rays with a lightweight, non-greasy formula.',
            image: 'assets/laroche_posay.png',
            category: 'skincare'
        },
        {
            id: 'sc6',
            name: 'Thayers Witch Hazel Toner',
            price: 12.99,
            description: 'Alcohol-free toner with witch hazel and aloe vera that balances pH levels and prepares skin for better product absorption.',
            image: 'assets/thayers.webp',
            category: 'skincare'
        },
        {
            id: 'sc7',
            name: 'The Ordinary Rosehip Seed Oil',
            price: 9.99,
            description: 'A cold-pressed, organic rosehip seed oil that deeply nourishes and restores skin\'s radiance.',
            image: 'assets/the_ordinary.avif',
            category: 'skincare'
        },
        {
            id: 'sc8',
            name: 'SkinCeuticals C E Ferulic',
            price: 169.99,
            description: 'Powerful antioxidant serum with 15% pure vitamin C, vitamin E, and ferulic acid that brightens skin and reduces signs of aging.',
            image: 'assets/skin_ceuticals.jpeg',
            category: 'skincare'
        }
    ],
    makeup: [
        {
            id: 'm1',
            name: 'Smashbox Photo Finish Primer',
            price: 37.99,
            description: 'Silky smooth primer that creates the perfect canvas for makeup application and minimizes the appearance of pores.',
            image: 'assets/smashbox.jpg',
            category: 'makeup'
        },
        {
            id: 'm2',
            name: 'NARS Natural Radiant Foundation',
            price: 49.99,
            description: 'Long-wearing foundation with medium to full coverage and a natural radiant finish.',
            image: 'assets/nars.jpg',
            category: 'makeup'
        },
        {
            id: 'm3',
            name: 'Tarte Shape Tape Concealer',
            price: 29.99,
            description: 'Full-coverage, creamy concealer that brightens, conceals and contours.',
            image: 'assets/tarte.jpg',
            category: 'makeup'
        },
        {
            id: 'm4',
            name: 'BECCA Shimmering Skin Perfector',
            price: 38.99,
            description: 'Luminous highlighter that creates a natural, radiant glow with light-reflecting pearls.',
            image: 'assets/becca.webp',
            category: 'makeup'
        },
        {
            id: 'm5',
            name: 'Benefit Hoola Bronzer',
            price: 30.99,
            description: 'Award-winning matte bronzer that adds natural-looking warmth to any complexion.',
            image: 'assets/benefit.avif',
            category: 'makeup'
        },
        {
            id: 'm6',
            name: 'NARS Orgasm Blush',
            price: 32.99,
            description: 'Universally flattering peachy-pink blush with subtle golden shimmer.',
            image: 'assets/nars_orgasm.webp',
            category: 'makeup'
        },
        {
            id: 'm7',
            name: 'Anastasia Beverly Hills Brow Wiz',
            price: 23.99,
            description: 'Ultra-slim, retractable eyebrow pencil for precise, natural-looking brows.',
            image: 'assets/anastasia.avif',
            category: 'makeup'
        },
        {
            id: 'm8',
            name: 'Stila Stay All Day Waterproof Liner',
            price: 22.99,
            description: 'Award-winning, waterproof liquid eyeliner that stays on all day without smudging.',
            image: 'assets/stila.webp',
            category: 'makeup'
        },
        {
            id: 'm9',
            name: 'Too Faced Better Than Sex Mascara',
            price: 26.99,
            description: 'Iconic volumizing and lengthening mascara for dramatic, defined lashes.',
            image: 'assets/too_faced.avif',
            category: 'makeup'
        },
        {
            id: 'm10',
            name: 'Charlotte Tilbury Matte Revolution',
            price: 34.99,
            description: 'Long-lasting matte lipstick enriched with orchid extract for a comfortable, hydrating wear.',
            image: 'assets/charlotte_tilbury.webp',
            category: 'makeup'
        },
        {
            id: 'm11',
            name: 'Fenty Beauty Gloss Bomb',
            price: 19.99,
            description: 'Universal lip luminizer that delivers explosive shine in a single stroke.',
            image: 'assets/fenty_beauty.jpg',
            category: 'makeup'
        },
        {
            id: 'm12',
            name: 'MAC Lip Pencil',
            price: 18.99,
            description: 'Smooth, creamy lip liner that defines lips with precision and prevents feathering.',
            image: 'assets/mac.avif',
            category: 'makeup'
        }
    ]
};

// Popular products can be a mix of both categories
const popularProducts = [
    products.skincare[0], // CeraVe Cleanser
    products.makeup[1],   // NARS Foundation
    products.skincare[7], // SkinCeuticals C E Ferulic
    products.makeup[9],   // Charlotte Tilbury Lipstick
    products.skincare[4], // La Roche-Posay Sunscreen
    products.makeup[3],   // BECCA Highlighter
];

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        console.log('Products loaded:', products); // Debug log
        
        const productsGrid = document.getElementById('productsGrid');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products available.</p>';
            return;
        }
        
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<p>Error loading products. Please try again later.</p>';
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);

// Update the displayProducts function
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            ${isAdmin ? `
                <button onclick="deleteProduct(${product.id})" class="delete-product-btn">
                    <i class="fas fa-minus"></i>
                </button>
            ` : ''}
            <img src="${product.image_url || 'assets/default-product.jpg'}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
        </div>
    `).join('');

    // Show admin controls if admin
    if (isAdmin && !document.querySelector('.admin-controls')) {
        const adminControls = document.createElement('div');
        adminControls.className = 'admin-controls';
        adminControls.innerHTML = `
            <button onclick="showAddProductModal()" class="add-product-btn">
                <i class="fas fa-plus"></i> Add New Product
            </button>
        `;
        document.querySelector('.products-container').insertBefore(
            adminControls, 
            document.querySelector('.products-container h2')
        );
    }
}

// Add product functions
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'block';
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'none';
}

// Delete product function
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProducts(); // Refresh the products list
        } else {
            alert('Error deleting product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
    }
} 