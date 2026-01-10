const navbar = document.getElementById("hamnav");
const hambar = document.getElementById("hambar");
const hamcross = document.getElementById("hamClose");


function hamNav(){
    hambar.addEventListener("click", ()=>{
        navbar.style.display = "block";
        navbar.style.left = "0px";
    })
}
function hamClose(){
    hamcross.addEventListener("click", ()=>{
        navbar.style.display = "none";
        navbar.style.left = "-250px";
    })
}