const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 49.99,
        image: "https://via.placeholder.com/150", // We'll replace this later
        category: "Audio"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 89.99,
        image: "https://via.placeholder.com/150",
        category: "Wearables"
    },
    {
        id: 3,
        name: "Gaming Mouse",
        price: 29.99,
        image: "https://via.placeholder.com/150",
        category: "Accessories"
    }
];

const cart = []; // This will hold the items the user buys

const productContainer = document.getElementById("product-container");
const cartCountElement = document.getElementById("cart-count");

function displayProducts() {
    // Clear the container just in case
    productContainer.innerHTML = "";

    // Loop through the product data
    products.forEach(product => {
        // Create the card HTML
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        // Put it on the page
        productContainer.appendChild(productCard);
    });
}

// Run the function when the page loads
displayProducts();

function addToCart(productId) {
    // 1. Find the product details from the ID
    const product = products.find(item => item.id === productId);
    
    // 2. Add it to the cart array
    cart.push(product);
    
    // 3. Update the UI
    updateCartCount();
    
    // Optional: Alert user (we'll make this prettier later)
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    cartCountElement.innerText = cart.length;
}

// --- Elements ---
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// 1. Toggle Cart Function
function toggleCart() {
    cartSidebar.classList.toggle('show');
    cartOverlay.classList.toggle('show');
}

// 2. Render Cart Items (The core logic)
function updateCartHTML() {
    cartItemsContainer.innerHTML = ""; // Clear current HTML
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p class='empty-msg'>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            totalPrice += item.price;
            
            // Create HTML for each item
            const itemHTML = document.createElement('div');
            itemHTML.classList.add('cart-item');
            itemHTML.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <button onclick="removeFromCart(${index})" style="color: red; background: none; border: none; cursor: pointer; padding: 0;">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemHTML);
        });
    }

    // Update the final numbers
    cartTotalElement.innerText = totalPrice.toFixed(2);
    document.getElementById("cart-count").innerText = cart.length;
}

// 3. Remove Item Function
function removeFromCart(index) {
    cart.splice(index, 1); // Remove 1 item at the specific index
    updateCartHTML(); // Re-render the list
}

// UPDATE: Modify your existing addToCart function!
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    
    updateCartHTML(); // <--- Add this line so the cart updates instantly
    toggleCart(); // <--- Optional: Open the cart immediately when they add an item
}
