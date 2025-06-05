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

        const productName = product.querySelector('.name').textContent
        const productPrice = product.querySelector('.price').textContent

        const emptyContainer = document.getElementById('empty-cart-container')
        const activeContainer = document.getElementById('active-cart-container')

        const cartProductsContainer = document.getElementById('cart-products')

        function renderCart() {
            emptyContainer.classList.add('cart-hide');
            activeContainer.classList.remove('hide');

            let numericPrice = parseFloat(productPrice.replace("R$", "").replace("$", "").replace(",", "."));
            let total = numericPrice * quantity;

            let existingCartItem = cartProductsContainer.querySelector(`[data-product="${productName}"]`);

            if (quantity === 0) {
                if (existingCartItem) {
                    existingCartItem.remove();
                }
            } else {
                if (existingCartItem) {
                    existingCartItem.querySelector('.cart-quantity').textContent = `${quantity}x`;
                    existingCartItem.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
                } else {
                    cartProductsContainer.innerHTML += `
                        <div class="cart-product" data-product="${productName}">
                            <div class="cart-product-info">
                                <h2>${productName}</h2>
                                <div>
                                    <span class="cart-quantity">${quantity}x</span>
                                    <span class="cart-price">@ ${productPrice}</span>
                                    <span class="cart-total">$${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button class="cart-remove" id="cart-remove"><img src="../assets/images/icon-remove-item.svg"></button>
                        </div>
                    `;
                }
            }

            if (totalCartQuantity === 0) {
                cartProductsContainer.classList.add('hide');
                activeContainer.classList.add('hide');
                emptyContainer.classList.remove('cart-hide');
            } else {
                cartProductsContainer.classList.remove('hide');
                activeContainer.classList.remove('hide');
                emptyContainer.classList.add('cart-hide');
            }
        }

        let quantity = 0;

        addBtn.addEventListener('click', () => {
            quantity = 1;
            totalCartQuantity += 1;
            updateCartCount();
         quantityDisplay.textContent = quantity;
            addBtn.classList.add('hide');
            quantityControl.classList.remove('hide');
            renderCart()
        });

        increaseBtn.addEventListener('click', () => {
            quantity++;
            totalCartQuantity++;
            quantityDisplay.textContent = quantity;
            updateCartCount();
            renderCart()
        });

        decreaseBtn.addEventListener('click', () => {
            if (quantity > 0) {
                quantity--;
                totalCartQuantity--;
                updateCartCount();
                renderCart()
            }

            if (quantity <= 0) {
                quantity = 0;
                quantityControl.classList.add('hide');
                addBtn.classList.remove('hide');
                renderCart()
            }

        quantityDisplay.textContent = quantity;
        });
    });

    function updateCartCount() {
        cartCount.textContent = totalCartQuantity;
    }


    document.getElementById('cart-products').addEventListener('click', (e) => {
        if (e.target.closest('.cart-remove')) {
            const cartItem = e.target.closest('.cart-product');
            const productName = cartItem.dataset.product;

            const productInList = Array.from(document.querySelectorAll('.product')).find(p => {
                return p.querySelector('.name').textContent === productName;
            });

            if (productInList) {
                const quantityDisplay = productInList.querySelector('.quantity-number');
                const quantityControl = productInList.querySelector('.quantity-control');
                const addBtn = productInList.querySelector('.main-btn');

                const quantityToRemove = parseInt(quantityDisplay.textContent, 10) || 0;
                totalCartQuantity -= quantityToRemove;

                quantityDisplay.textContent = 0;
                quantityControl.classList.add('hide');
                addBtn.classList.remove('hide');
            }

            cartItem.remove();
            updateCartCount();

            if (totalCartQuantity <= 0) {
                document.getElementById('cart-products').classList.add('hide');
                document.getElementById('active-cart-container').classList.add('hide');
                document.getElementById('empty-cart-container').classList.remove('cart-hide');
            }
        }
    });
}