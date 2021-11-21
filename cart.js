// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies/order";
let localBackendUrl = "http://localhost:3000/api/teddies/order"

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
    let contact = setContact();
    console.log(contact.city)
    if (products.length == "") {
        alertMessage('vous devez ajouter un produit au panier pour commander')
    } 
    
    else if (contact == "") {
        
        alertMessage('vous devez remplir les champs pour commander')
    }
    // on envoi au backend un objet
    else if (products && contact) {
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
    let contactobject = new Object();
    //on crée un tableau des inputs
    let inputs = Array.from(document.getElementsByTagName('input'))
    // controle champs vide ou non
    inputs.forEach((input) => {
        if (input.value == "") {
            // add red border
            input.classList.add('border', 'border-1', 'border-danger');
            // message in placeholder
            input.placeholder = "champ obligatoire";
            input.addEventListener('focus', () => {
                input.classList.remove('border', 'border-1', 'border-danger');
                input.placeholder = "";
            })
            
        }

        if (input.id == "email") {
            // regex format email
            let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            // on verifie que l'email est valide
            if (input.value.match(regex)) {
                contactobject.email = input.value;
                console.log("email ok")
            } else {
                // add red border
                input.classList.add('border', 'border-1', 'border-danger');
                console.log("email invalide")

                // eventlistener pour retirer le style au focus et vider le placeholder
                input.addEventListener('focus', () => {
                    input.classList.remove('border', 'border-1', 'border-danger');
                    input.placeholder = "";
                })
            }
        }

        if (input.id == "firstname" || input.id == "lastname" || input.id == "city") {
            let regex = /^[a-zA-Z]/
            if (input.value.match(regex)) {
                if (input.id == "firstname") { contactobject.firstName = input.value }
                if (input.id == "lastname") { contactobject.lastName = input.value }
                if (input.id == "city") { contactobject.city = input.value }
            } else {
                
                input.classList.add('border', 'border-1', 'border-danger');
                // eventlistener pour retirer le style au focus et vider le placeholder
                input.addEventListener('focus', () => {
                    input.classList.remove('border', 'border-1', 'border-danger');
                    input.placeholder = "";
                })
                console.log(`${input.id} : mauvais format`)
            }
        }
        if (input.id == "adress") {
            let regex = /^[a-zA-Z0-9]/
            if (input.value.match(regex)) {
                { contactobject.address = input.value }
            } else {
                input.classList.add('border', 'border-1', 'border-danger');
                // eventlistener pour retirer le style au focus et vider le placeholder
                input.addEventListener('focus', () => {
                    input.classList.remove('border', 'border-1', 'border-danger');
                    input.placeholder = "";
                })
                console.log(`${input.id} : mauvais format`)
            }
        }
    })
    if (contactobject && contactobject.firstName != undefined  && contactobject.lastName != undefined && contactobject.address != undefined && contactobject.city != undefined  && contactobject.email != undefined ) {

         return contactobject
    } else { 
        console.log('not ok')
        return "" 
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