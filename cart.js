// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies/order";
let localBackendUrl = "http://localhost:3000/api/order"


let ul = document.getElementById('item-list');
let cart = getCart();

function increaseQuantity(id) {
    console.log(id);
    let i;
    cart.forEach((el) => {
        if (el.id == id) {
            i = cart.indexOf(el)
        }
    })

    cart[i].quantity += 1;
    console.log(cart[i].quantity)
    localStorage.setItem('cart', JSON.stringify(cart));
    cart = getCart();
    ul.innerHTML = "";
    displayItems();
    calculatePrice();

}

function decreaseQuantity(id) {
    console.log(id);
    let i;
    cart.forEach((el) => {
        if (el.id == id) {
            i = cart.indexOf(el)
        }
    })

    if (cart[i].quantity == 1) {
        cart.splice(i, 1)
        localStorage.setItem('cart', JSON.stringify(cart));
        cart = getCart();
        ul.innerHTML = "";
        displayItems();
        calculatePrice();
    } else {
        cart[i].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        cart = getCart();
        ul.innerHTML = "";
        displayItems();
        calculatePrice();
    }

}

function removeItem(id) {
    let i;
    cart.forEach((el) => {
        if (el.id == id) {
            i = cart.indexOf(el)
        }
    })
    cart.splice(i, 1)
    localStorage.setItem('cart', JSON.stringify(cart));
    cart = getCart();
    ul.innerHTML = "";
    displayItems();
    calculatePrice();
}

function getCart() {
    if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart'))
    } else { return [] }
}

function commander() {
    let contact = {
        firstName: document.getElementById('firstname').value,
        lastName: document.getElementById('lastname').value,
        address: document.getElementById('adress').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    };
    console.log(contact)
    let products = [];
    cart.forEach((el) => {
        products.push(el.id);
    })
    console.log(products)

    fetch(onlineBackendUrl,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
        },
        body: JSON.stringify({contact,products})
    })
    .then(res => res.json())
    .then(data => {
        localStorage.removeItem('cart')
        window.location = `confirmation.html?orderId="${data.orderId}"`
    })
        

}

function calculatePrice() {
    let totalPrice = 0;
    if (cart) {
        cart.forEach((el) => {
            let price = parseFloat(el.price) * parseFloat(el.quantity);
            totalPrice += price;
        })
        document.getElementById('totalCart').innerHTML = "Total : " + totalPrice + ",00 €"
    }
}

function displayItems() {

    if (cart.length > 0) {

        cart.forEach(element => {


            let li = `
            <li id="${element.id}" >
                <img src="${element.imageUrl}" alt="ours ${element.name}" />
                <div class="info-container">
                    <span>${element.quantity}</span>
                    <button id="${"moins-" + element.id}">-</button>
                    <button id="${"plus-" + element.id}">+</button>
                    <a href='product.html?id="${element.id}"'>${element.name}</a>
                    <span>prix : ${element.price} €</span>
                    <button id="del-${element.id}" class="btn btn-danger">Supprimer</button>
                </div>
            </li>`;

            ul.innerHTML += li;
        })

        cart.forEach((el) => {
            document.getElementById('plus-' + el.id).addEventListener('click', (e) => {
                increaseQuantity(el.id);
            })
            document.getElementById('moins-' + el.id).addEventListener('click', (e) => {
                decreaseQuantity(el.id);
            })
            document.getElementById('del-' + el.id).addEventListener('click', (e) => {
                removeItem(el.id);
            })
        })

    } else {
        ul.innerHTML = `<li>Votre panier est vide.</li>`
    }
}


displayItems()
document.getElementById('buyButton').addEventListener('click', (e) => {
    e.preventDefault();
    commander();
})
calculatePrice();