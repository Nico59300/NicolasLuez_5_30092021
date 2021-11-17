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

    //on set contact et products
    let products = setProducts();
    console.log("products : " + products)
    let contact = setContact();
    console.log("contact : " + contact)

    if (products.length == "") {
        alertMessage('vous devez ajouter un produit au panier pour commander')
    } else if (contact == "") {
        let input = document.getElementsByTagName('input');

        alertMessage('vous devez remplir les champs pour commander')
    }
    // on envoi au backend un objet
    else if (products.length > 0 && contact != "") {
        fetch(localBackendUrl, {
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
    }


}
function setProducts() {
    if (cart.length > 0) {
        products = [];
        cart.forEach((el) => {
            products.push(el.id);
        })
        return products
    } else {

        return "";
    }
}
function setContact() {
    if (
        document.getElementById('firstname').value != "" &&
        document.getElementById('lastname').value != "" &&
        document.getElementById('adress').value != "" &&
        document.getElementById('city').value != "" &&
        document.getElementById('email').value != ""
    ) {
        return {
            firstName: document.getElementById('firstname').value,
            lastName: document.getElementById('lastname').value,
            address: document.getElementById('adress').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value
        };

    } else {
        // inputs is html collection
        let inputs = document.getElementsByTagName('input')
        // transform in array
        let inputs2 = Array.from(inputs)
        // on peut parcourir pour modifier les input
        inputs2.forEach((el) => {

            if (el.value == "") {
                // add red border
                el.classList.add('border', 'border-1', 'border-danger');
                // message in placeholder
                el.placeholder = "champ obligatoire";
                // remove style and placeholder  on focus
                el.addEventListener('focus', () => {
                    el.classList.remove('border', 'border-1', 'border-danger');
                    el.placeholder = "";
                })
            }
        })

        return "";
    }
}

function alertMessage(message) {
    messageBox.innerHTML = message;
    messageBox.classList.remove('d-none')
    messageBox.classList.add('bg-danger');
    setTimeout(
        function () {
            messageBox.innerHTML = "";
            messageBox.classList.add("d-none")
        }, 3000);
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
            <li id="${element.id}" class="d-flex  justify-content-between  p-2 border border-1 border-secondary m-2 shadow" >
                
                <div class="d-none d-md-block w-25">
                    <img  src="${element.imageUrl}" alt="ours ${element.name}" />
                </div>
                          
                    <div>
                        <a class="d-block link-secondary" href='product.html?id="${element.id}"' title="voir la page du produit">${element.name}</a>
                        <span>prix : ${element.price} €</span>
                        <div>
                            <span>quantité : ${element.quantity}</span>
                            <span id="${"moins-" + element.id}"><i class="fas fa-minus-square fa-lg" title="diminuer quantité"></i></span>
                            <span id="${"plus-" + element.id}"><i class="fas fa-plus-square fa-lg " title="augmenter quantité"></i></span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center">
                        <button id="del-${element.id}" class="btn btn-danger " aria-label="Supprimer l'article" title="supprimer l'article"><i class="fas fa-trash"></i></button>
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
        ul.innerHTML = `<li class="text-center p-2 fw-bolder">Votre panier est vide.</li>`
    }
}


displayItems()

document.getElementById('buyButton').addEventListener('click', (e) => {
    e.preventDefault();
    commander();
})
calculatePrice();