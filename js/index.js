document.addEventListener('DOMContentLoaded', ()=>{
    renderProducts()
})

async function renderProducts () {
    const data = await fetch("./data.json");
    const products = await data.json()
    console.log(products)
    
    const container = document.querySelector('#products-list')

    products.forEach((product)=>{
        const div = document.createElement('div')
        div.className = "product"
        div.innerHTML = `
        <picture>
            <source srcset="${product.image.mobile}" media="(max-width:600px)">
            <source srcset="${product.image.tablet}" media="(max-width=900px)">
            <img src="${product.image.desktop}" class="product-img">

            <button class="add" id="add-cart"><span class="before">Add to cart</span></button>
        </picture>
        <div class="product-info">
            <p class="category">${product.category}</p>
            <h1 class="name">${product.name}</h1>
            <h2 class="price">$${product.price}</h2>
        </div>
        `

        container.appendChild(div)
    })
}