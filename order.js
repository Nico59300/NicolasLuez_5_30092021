// on récupère la requête dans l'url
let query = window.location.search;
console.log(query)
//on récupére l'ID dans l'url
const urlParams = new URLSearchParams(query);
let id = urlParams.get("orderId");
console.log(id);
document.getElementById('orderId').innerHTML = id;