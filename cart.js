// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies/order";
let localBackendUrl = "http://localhost:3000/api/order"

let messageBox = document.getElementById('message');
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

    // on envoi au backend un objet
    if (products.length > 0) {
        fetch(onlineBackendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
            },
            body: JSON.stringify({ contact, products })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                localStorage.removeItem('cart');
                localStorage.setItem('order', JSON.stringify(data))
                window.location = `confirmation.html?orderId="${data.orderId}"`
            })
    }else { 
        messageBox.innerHTML = "Vous devez ajouté un article pour passer commande";
        messageBox.classList.remove('d-none')
        messageBox.classList.add('text-danger', 'border-danger' );
        setTimeout( 
            function() { 
            message.innerHTML = "";
            message.classList.add("d-none")
            }, 4000);
    }


}

function calculatePrice() {
    let totalPrice = 0;
    if (cart) {
        cart.forEach((el) => {
            let price = parseFloat(el.price) * parseFloat(el.quantity);
            totalPrice += price;
        })
        document.getElementById('totalCart').innerHTML = `<span class="text-uppercase fw-bolder">Total :</span> <span class="fw-bolder">${totalPrice},00 €</span>`
    }
}

function displayItems() {

    if (cart.length > 0) {

        cart.forEach(element => {


            let li = `
            <li id="${element.id}" class="d-flex  justify-content-between  p-2 border border-2 border-secondary m-2" >
                
                <div class="d-none d-sm-block w-25">
                    <img  src="${element.imageUrl}" alt="ours ${element.name}" />
                </div>
                          
                    <div>
                        <h4><a href='product.html?id="${element.id}"'>${element.name}</a></h4>
                        <span>prix : ${element.price} €</span>
                        <div>
                            <span>quantité : ${element.quantity}</span>
                            <span id="${"moins-" + element.id}"><i class="fas fa-minus-square "></i></span>
                            <span id="${"plus-" + element.id}"><i class="fas fa-plus-square "></i></span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center">
                        <button id="del-${element.id}" class="btn btn-danger "><i class="fas fa-trash"></i></button>
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