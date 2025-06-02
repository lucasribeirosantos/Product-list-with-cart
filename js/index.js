const decreasePath = './assets/images/icon-decrement-quantity.svg'
const increasePath = './assets/images/icon-increment-quantity.svg'

document.addEventListener('DOMContentLoaded', async ()=> {
    await renderProducts()
    setupProductButtons()
})

async function renderProducts () {
    const data = await fetch("./data.json");
    const products = await data.json()
    
    const container = document.querySelector('#products-list')

    products.forEach((product)=>{
        const productElement = createProductElement(product)
        container.appendChild(productElement)
    })
}

function createProductElement (product) {
    const div = document.createElement('div')
        div.className = "product"
        div.innerHTML = `
        <div class="img-div">
            <picture>
                <source srcset="${product.image.mobile}" media="(max-width:600px)">
                <source srcset="${product.image.tablet}" media="(max-width:900px)">
                <img src="${product.image.desktop}" class="product-img">
            </picture>

            <button class="add main-btn" id="add-cart">
                <span id="add-text">Add to cart</span>
            </button>

            <div class="quantity-control hide" id="quantity-control">
                <button class="icon-btn decrease" id="decrease-btn">
                    <img src="${decreasePath}" alt="Decrease button">
                </button>

                <span class="quantity quantity-number" id="item-count">1</span>

                <button class="icon-btn increase" id="increase-btn">
                    <img src="${increasePath}" alt="Increase button">
                </button>
            </div>
        </div>
        <div class="product-info">
            <p class="category">${product.category}</p>
            <h1 class="name">${product.name}</h1>
            <h2 class="price">$${product.price}</h2>
        </div>
        `
        return div
}

function setupProductButtons() {
    const allProducts = document.querySelectorAll('.product');
    const cartCount = document.querySelector('.cart-count');
    let totalCartQuantity = 0;

    allProducts.forEach((product) => {
        const addBtn = product.querySelector('.main-btn');
        const quantityControl = product.querySelector('.quantity-control');
        const increaseBtn = product.querySelector('.increase');
        const decreaseBtn = product.querySelector('.decrease');
        const quantityDisplay = product.querySelector('.quantity-number');

        let quantity = 0;

        addBtn.addEventListener('click', () => {
            quantity = 1;
            totalCartQuantity += 1;
            updateCartCount();
         quantityDisplay.textContent = quantity;
            addBtn.classList.add('hide');
            quantityControl.classList.remove('hide');
        });

        increaseBtn.addEventListener('click', () => {
            quantity++;
            totalCartQuantity++;
            quantityDisplay.textContent = quantity;
            updateCartCount();
        });

        decreaseBtn.addEventListener('click', () => {
            if (quantity > 0) {
                quantity--;
                totalCartQuantity--;
                updateCartCount();
            }

            if (quantity <= 0) {
                quantity = 0;
                quantityControl.classList.add('hide');
                addBtn.classList.remove('hide');
            }

        quantityDisplay.textContent = quantity;
        });
    });

    function updateCartCount() {
        cartCount.textContent = totalCartQuantity;
    }

    
}