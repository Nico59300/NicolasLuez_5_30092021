// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies";
let localBackendUrl = "http://localhost:3000/api/teddies"


const teddy = document.getElementById("teddy");
const colorsContainer = document.getElementById("colors-container");
let  documentTitle = document.title;
let colors = [];
// on récupère la requête dans l'url
let query = window.location.search;
const urlParams = new URLSearchParams(query);
//on récupére l'ID dans l'url
let id = urlParams.get("id");
// split pour retirer guillements
let arr = id.split('"');
id = arr[1];

let url = onlineBackendUrl + "/" + id;

function renderColors (colors) {
    colors.forEach( element => {
        let color = `
        <div background-color="${element}">
        `
        colorsContainer.innerHTML += color;
    })
}


function getOneTeddy() {
    fetch(url)
        .then(res => res.json())
        .then(obj => {
            let ted = obj;
            let price = ted.price;
            let FormattedPrice = price.toString().substr(price.lenght, 2) + ",00";

            colors = ted.colors;
            console.log("colors " + colors)
            let template = `
            <article>
                <h2>${ted.name}</h2>
                <img src="${ted.imageUrl}" alt="image de ${ted.name} "}"/>
                <p>${ted.description}</p>
                <div>
                    <div id="colors-container"></div>
                    <p>prix : ${FormattedPrice + " €"}</p>
                    <button class="btn btn-primary">Ajouter au panier</buttob
                </div>
            </article>
            `
            teddy.innerHTML += template;
            renderColors(colors)
            document.title = ted.name + " | Orinoco, ours en peluche";
        })
}




getOneTeddy();

