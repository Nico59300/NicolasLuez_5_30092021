// orinoco backend url
let onlineBackendUrl = "https://backend-orinoco.herokuapp.com/api/teddies";
let localBackendUrl = "http://localhost:3000/api/teddies"

let result = document.getElementById("result");


function getAllTeddies(){
    fetch(onlineBackendUrl)
    .then( data => data.json())
    .then(obj => {
        let teddies = obj;
        
        teddies.forEach(element => {
            let ted = `
            <article class="card text-">
                <img class="card-img-top" src="${element.imageUrl}" title="ourson ${element.name}" alt="ourson ${element.name}"/>
                
                <div class="card-body">
                    <h2 class="card-title">${element.name}</h2>
                    <a class="btn btn-primary" href='product.html?id="${element._id}"'>Voir ${element.name}</a>
                </div>
            </article>`;
            result.innerHTML += ted;
        });
        
    })
}

getAllTeddies();
