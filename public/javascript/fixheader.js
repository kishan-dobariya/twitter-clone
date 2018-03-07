window.onscroll = function () { myFunction(); };
var header = document.getElementById('navigation');
var sticky = header.offsetTop;
function myFunction () {
	if (window.pageYOffset === 0) {
		document.getElementById('main').style.marginTop = 52 + 'px';
	}
	if (window.pageYOffset >= sticky) {
		header.classList.add('sticky');
	} else {
		header.classList.remove('sticky');
	}
}
