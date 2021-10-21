// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies";
let localBackendUrl = "http://localhost:3000/api/teddies"

let collection = document.getElementById("collection");


function getAllTeddies(){
    // onrécupère les teddies
    fetch(onlineBackendUrl)
    .then( data => data.json())
    .then(obj => {
        let teddies = obj;
        
        teddies.forEach(element => {
            // pour chaque element on crée un article avec les info
            let ted = `
            <div class="col-xs-12 col-md-6 col-lg-4">
                <article class="d-flex flex-column bg-light">

                    <div class="text-center">
                        <h2 class="">${element.name}</h2>
                        <img class="rounded w-100 mb-5 border border-dark" src="${element.imageUrl}" title="ourson ${element.name}" alt="ourson ${element.name}"/>
                    </div>

                    <div class="text-center">
                        <a class="btn btn-outline-dark" href='product.html?id="${element._id}"'>Voir ${element.name}</a>
                    </div>
                 </article>
            </div>`;
            
            // et on ajoute le rendu au document
            collection.innerHTML += ted;
        });
        
    })
}

getAllTeddies();
