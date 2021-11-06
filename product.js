// orinoco backend url
const onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies";
const localBackendUrl = "http://localhost:3000/api/teddies"
// element html
const teddy = document.getElementById("teddy");
const colorsContainer = document.getElementById("colors-container");
const message = document.getElementById('message');
// id
const id = getId();
//variables
let ted;
let tedToCart;
let cart;

//Functions
function getId() {

    // on récupère la requête dans l'url
    let query = window.location.search;

    //on récupére l'ID dans l'url
    const urlParams = new URLSearchParams(query);
    let id = urlParams.get("id");

    // split pour retirer guillements
    let arr = id.split('"');
    id = arr[1];
    return id;
}

function getCart() {
    if (localStorage.cart != null) {
        return JSON.parse(localStorage.getItem('cart'))
    } else {
        return [];
    }
}

function verifInCart(cart) {
    if (cart.length > 0) {
        let indexes = [];
       cart.forEach((el) => {
           if(el.id == tedToCart.id){
               indexes.push(cart.indexOf(el))
           }
       })
    if (indexes.length >0) {
           return true
       }else {return false}
       
    }else {
        return false
    }

}

function comfirmMessage (text) {
    message.innerHTML = `<p>${text}</p>`;
    message.classList.remove("d-none")
    setTimeout( 
        function() { 
        message.innerHTML = "";
        message.classList.add("d-none")
        }, 3000);
}

function addToCart() {
    cart = getCart();
    let inCart = verifInCart(cart);

    if (inCart == false) {
        cart.push(tedToCart)
        let message = "Produit ajouté au panier";
        comfirmMessage(message);
        console.log('ajouté au panier')
    }else {
        cart.forEach((el) => {
            if(el.id == tedToCart.id) {
                let index = cart.indexOf(el);
                cart[index].quantity += 1;
                let message = "quantité modifiée";
                comfirmMessage(message)
                console.log('quantité modifiée')
            }
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}




function renderColors(colors) {

    // conteneur vide pour recevoir les div générées pour chaque couleur 
    let colorsContainer ="";

    //pour chaque couleurs on génère une div contenant un input radio
    colors.forEach((col) => {

        let color = `
        <div >
            <input type="radio" id="${col}"  name ="color" value="${col}" />
            <label for="${col}" class="fs-6" >${col}</label>
        </div>`
        // on ajoute chaque div  
        colorsContainer += color;

    })
    // on ajoute un container autour des élement
    colorsContainer = '<div id="colors-container"> ' + colorsContainer + '</div>'
    // on renvoi la variable
    return colorsContainer;
    
}

function getOneTeddy() {

    let url = onlineBackendUrl + "/" + id;
    fetch(url)
        .then(res => res.json())
        .then(obj => {

            let ted = obj;
            
            

            let price = ted.price;
            let formattedPrice = price.toString().substr(price.lenght, 2) + ",00";
            ted.price = formattedPrice;

            let colorElement = renderColors(ted.colors);

            tedToCart = {
                "id": ted._id,
                "name": ted.name,
                "imageUrl": ted.imageUrl,
                "price": ted.price,
                "quantity": 1
            }

            let template = `
            <article id="${ted._id}" class="row">

                <h2 class="text-center text-light bg-secondary bg-gradient p-2 mb-4 rounded">${ted.name}</h2>

                <div class="col-xs-12 col-md-6 col-lg-6 text-center rounded productImg">

                    <img src="${ted.imageUrl}" class="img-fluid w-100 mb-3 border border-dark rounded" alt="image de ${ted.name}" title="image de ${ted.name}"/>    
                
                </div>

                <div class="col-xs-12 col-md-6 col-lg-6  pb-5">

                    <div>
                        <h4 class="text-center text-light bg-secondary bg-gradient p-2 mb-4 rounded">description</h4>
                        <p>${ted.description}</p>
                    </div>

                    <div>
                        <h4 class="text-center text-light bg-secondary bg-gradient  p-2 mb-4 rounded">Choissisez votre couleur</h4>
                        <div>${colorElement}</div>
                    </div>

                </div>

                <div class="d-flex flex-column flex-md-row w-100 h-25 ">

                    

                    <div class="col-md-6 text-center pt-3 ">
                        <p>prix : ${formattedPrice + " €"}</p>
                    </div>

                    <div class="col-md-6 text-center d-flex ">
                        <button class="btn btn-outline-dark  m-auto" onClick="addToCart()">Ajouter au panier</button>
                    </div>

                </div>

            </article>
            `
            teddy.innerHTML += template;
            let input = document.getElementsByName('color');
            input.forEach((el) => {
                el.addEventListener('click', (e) => {
                    tedToCart.color =  e.target.value;
                })
            })
            let firstColor = document.getElementById('colors-container').firstElementChild.firstElementChild;
            firstColor.setAttribute("checked", "checked")
            
            document.title = ted.name + " | Orinoco, ours en peluche";
        })
}

//APP
getOneTeddy();