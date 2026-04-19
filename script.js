// Task: Product Listing Dashboard (Real-Time API Project)

//Fetch Data

let apiUrl = "https://fakestoreapi.com/products";

let productContainer = document.getElementById("products");
let searchInput = document.getElementById("product-search");
let categoryFilter = document.getElementById("category-filter");
let sortLowHighBtn = document.getElementById("sort-low-high");
let sortHighLowBtn = document.getElementById("sort-high-low");
let modal = document.getElementById("detail-modal");
let modalClose = document.getElementById("modal-close");
let modalTitle = document.getElementById("modal-title");
let modalImage = document.getElementById("modal-image");
let modalDescription = document.getElementById("modal-description");
let modalPrice = document.getElementById("modal-price");
let modalCategory = document.getElementById("modal-category");
let allProducts = [];
let currentSort = null;

productContainer.innerHTML = "<p style='color:#333; font-size:20px;'>Loading...</p>";

fetch(apiUrl).then((fetchData)=>{
    console.log(fetchData);
    return fetchData.json();
})
.then((data) => {
    console.log(data);
    allProducts = data;
    updateProducts();
})
.catch((error) => {
    console.error("Error loading data:", error);
    productContainer.innerHTML = "<p style='color: red; font-size: 20px;'>Error loading data</p>";
});

if (searchInput) {
    searchInput.addEventListener("input", () => {
        updateProducts();
    });
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
        updateProducts();
    });
}

if (sortLowHighBtn) {
    sortLowHighBtn.addEventListener("click", () => {
        currentSort = "low-high";
        sortLowHighBtn.classList.add("active");
        sortHighLowBtn?.classList.remove("active");
        updateProducts();
    });
}

if (sortHighLowBtn) {
    sortHighLowBtn.addEventListener("click", () => {
        currentSort = "high-low";
        sortHighLowBtn.classList.add("active");
        sortLowHighBtn?.classList.remove("active");
        updateProducts();
    });
}

if (modalClose) {
    modalClose.addEventListener("click", () => {
        hideModal();
    });
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
}

function updateProducts() {
    const query = searchInput?.value.trim().toLowerCase() ?? "";
    const selectedCategory = categoryFilter?.value ?? "all";

    let filteredProducts = allProducts.filter(product => {
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesTitle && matchesCategory;
    });

    if (currentSort === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Display Products

function displayProducts(products) {
    productContainer.innerHTML = "";

    if (!products.length) {
        productContainer.innerHTML = "<p style='color:#333; font-size:1.1em;'>No products match your search.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <h1>${product.title.slice(0,20)}</h1>
        <img src="${product.image}" alt="${product.title}">
        <p>${product.description.slice(0,100)}...</p>
        <div class="card-footer">
            <button class="price-btn">${product.price}</button>
            <button class="view-btn">View More</button>
        </div>
        `;

        const viewBtn = card.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
            showProductDetails(product);
        });

        productContainer.appendChild(card);
    });
}

function showProductDetails(product) {
    if (!modal) return;

    modalTitle.textContent = product.title;
    modalImage.src = product.image;
    modalImage.alt = product.title;
    modalDescription.textContent = product.description;
    modalPrice.textContent = `Price: $${product.price}`;
    modalCategory.textContent = `Category: ${product.category}`;
    modal.classList.remove("hidden");
}

function hideModal() {
    if (!modal) return;
    modal.classList.add("hidden");
}