import '../css/index.scss';

var menu = document.getElementById('menu');
var nav = document.getElementById('nav');
var exit = document.getElementById('exit');

menu.addEventListener('click', (e)=>{
    nav.classList.toggle('hide-mobile');
    e.preventDefault();
});

exit.addEventListener('click', (e)=>{
    nav.classList.toggle('hide-mobile');
    e.preventDefault();
});