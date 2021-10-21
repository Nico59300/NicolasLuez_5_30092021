// recupere order in localstorage

let order =getOrder();

function getOrder() {
    if(localStorage.getItem('order')) {
         return JSON.parse(localStorage.getItem('order'))
    }else {console.log("error")}
}

let lastName = order.contact.lastName;
let orderId = order.orderId;

document.getElementById('lastName').innerHTML = lastName;
document.getElementById('orderId').innerHTML = orderId;