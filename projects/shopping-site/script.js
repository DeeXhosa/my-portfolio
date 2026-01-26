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
