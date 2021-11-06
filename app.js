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
                <article class="d-flex flex-column max  bg-secondary border border border-2 border-dark text-white rounded">
                    <h2 class="pt-2 text-center">${element.name}</h2>
                    <div >
                        <img class="img-fluid border-top border-bottom  border-2 border-dark" style="max-height: 233px;" src="${element.imageUrl}" title="ourson ${element.name}" alt="ourson ${element.name}" />
                    </div>

                    <div class="pt-3 pb-3 text-center ">
                        <a class="btn btn-dark" href='product.html?id="${element._id}"'>Voir ${element.name}</a>
                    </div>
                 </article>
            </div>`;
            
            // et on ajoute le rendu au document
            collection.innerHTML += ted;
        });
        
    })
}

getAllTeddies();
