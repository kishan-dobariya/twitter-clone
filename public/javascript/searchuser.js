$('#searchuser').keyup(function () {
	// alert(document.getElementById("searchuser").value);
	var keywords = document.getElementById('searchuser').value;

	$.ajax({method: 'GET',
		url: 'http://localhost:8080/search?keyword=' + keywords,
		success: function (result) {
			console.log('result----------->', result);
			document.getElementById('showuser').style.display = 'inline-block';
			document.getElementById('showuser').innerHTML = result;
		}});

	$('#searchuser').on('keyup keypress', function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {
			e.preventDefault();
			return false;
		}
	});
});

$('#searchuser').focusout(function () {
	$('#showuser').delay(200).hide(0, function () {
		$(this).empty();
	});
});
