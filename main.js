var timer;
var ele = document.getElementById('timer');
var pausiert = true;
function start(){
    //const username = document.getElementById('playername');
    //console.log(username.value);
    let rootElement = document.querySelector(":root");
    rootElement.style.setProperty("--displaymenu", "none");

    rootElement.style.setProperty("--displaygame", "block");
    pausiert = false;

}
(function (){
    var sec = 0;
    if(pausiert === false){
    timer = setInterval(()=>{
        ele.innerHTML = '00:'+sec;
        sec ++;
    }, 1000) // each 1 second
}})()
function win(){
    pausiert = true;
    clearInterval(timer);
}
function back(){
    pausiert = true;
    let rootElement = document.querySelector(":root");
    rootElement.style.setProperty("--displaymenu", "block");

    rootElement.style.setProperty("--displaygame", "none");
    
}
