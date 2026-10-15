function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    showCartMessage(name);
}
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;

    // نجمع المنتجات المتكررة
    let groupedCart = {};

    cart.forEach(function (item) {
        if (groupedCart[item.name]) {
            groupedCart[item.name].quantity++;
        } else {
            groupedCart[item.name] = {
                name: item.name,
                price: item.price,
                quantity: 1
            };
        }
    });

    Object.values(groupedCart).forEach(function (item) {
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.price * item.quantity} SAR</span>

                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.name}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>

                <button onclick="removeProduct('${item.name}')">
                    Remove
                </button>
            </div>
        `;

        total += item.price * item.quantity;
    });

    cartTotal.textContent = "Total: " + total + " SAR";
}

function showCartMessage(name) {
    document.getElementById("added-product").textContent =
        name + " has been added to your cart.";

    document.getElementById("cart-popup").style.display = "flex";
}

function closeCartMessage() {
    document.getElementById("cart-popup").style.display = "none";
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function changeQuantity(name, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let index = cart.findIndex(item => item.name === name);

    if (index === -1) return;

    if (change === 1) {
        // Add another item next to the existing one
        cart.splice(index + 1, 0, { ...cart[index] });
    } else {
        // Remove one item
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    displayCart();
}


function removeProduct(name) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.name !== name);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    displayCart();
}

let selectedDrink = "";
let basePrice = 0;

function openCustomize(name, price) {
    selectedDrink = name;
    basePrice = price;

    document.getElementById("customize-title").textContent =
        "Customize " + name;

    let options = "";

    if (name === "Black Coffee" || name === "Matcha Latte") {
        options += `
            <label for="drink-temperature">Temperature</label>
            <select id="drink-temperature">
                <option value="Hot">Hot</option>
                <option value="Iced">Iced</option>
            </select>
        `;
    }

    if (name === "Matcha Latte") {
        options += `
            <label for="drink-flavor">Flavor</label>
            <select id="drink-flavor" onchange="updateCustomizePrice()">
                <option value="Classic" data-extra="0">Classic</option>
                <option value="Vanilla" data-extra="3">Vanilla (+3 SAR)</option>
                <option value="Strawberry" data-extra="3">Strawberry (+3 SAR)</option>
                <option value="Mango" data-extra="3">Mango (+3 SAR)</option>
            </select>
        `;
    }

    if (name === "Espresso") {
        options += `
            <label for="espresso-size">Espresso Size</label>
            <select id="espresso-size" onchange="updateCustomizePrice()">
                <option value="Single" data-extra="0">Single</option>
                <option value="Double" data-extra="4">Double (+4 SAR)</option>
            </select>
        `;
    }

    document.getElementById("customize-options").innerHTML = options;

    updateCustomizePrice();

    document.getElementById("customize-popup").style.display = "flex";
}

function updateCustomizePrice() {
    let total = basePrice;

    let flavor = document.getElementById("drink-flavor");
    let size = document.getElementById("espresso-size");

    if (flavor) {
        total += Number(flavor.selectedOptions[0].dataset.extra);
    }

    if (size) {
        total += Number(size.selectedOptions[0].dataset.extra);
    }

    document.getElementById("customize-price").textContent =
        "Total: " + total + " SAR";

    return total;
}

function addCustomizedDrink() {
    let name = selectedDrink;
    let price = updateCustomizePrice();
    let choices = [];

    let temperature = document.getElementById("drink-temperature");
    let flavor = document.getElementById("drink-flavor");
    let size = document.getElementById("espresso-size");

    if (temperature) {
        choices.push(temperature.value);
    }

    if (flavor) {
        choices.push(flavor.value);
    }

    if (size) {
        choices.push(size.value);
    }

    let customizedName = name + " (" + choices.join(", ") + ")";

    closeCustomize();
    addToCart(customizedName, price);
}

function closeCustomize() {
    document.getElementById("customize-popup").style.display = "none";
}

/* Navigation and Cart Counter */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = document.getElementById("cart-count");

    if (count) {
        count.textContent = cart.length > 0 ? cart.length : "";
    }
}

function setActiveNav() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    updateCartCount();
});
