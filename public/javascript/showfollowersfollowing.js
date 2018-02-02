var modal = document.getElementById('myModal');
var btn = document.getElementById("following");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
	modal.style.display = "block";
	$.ajax({
		url: '/getfollowing',
		type: 'post',
		success: function( data, textStatus, jQxhr ){
			document.getElementById("showfollowing").style.display = "inline-block";
			document.getElementById("showfollowing").innerHTML = data;
		},
		error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
		}
	});
}
span.onclick = function() {
		modal.style.display = "none";
}
window.onclick = function(event) {
		if (event.target == modal) {
				modal.style.display = "none";
		}
}

var btn = document.getElementById("followers");
btn.onclick = function() {
	modal.style.display = "block";
	$.ajax({
		url: '/getfollowers',
		type: 'post',
		success: function( data, textStatus, jQxhr ){
			console.log(data);
			document.getElementById("showfollowing").style.display = "inline-block";
			document.getElementById("showfollowing").innerHTML = data;
		},
		error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
		}
	});
}
span.onclick = function() {
	modal.style.display = "none";
}
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}
