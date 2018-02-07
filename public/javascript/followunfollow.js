function test(data) {
	var id = data.id;
	if(document.getElementById(id).innerHTML == "Follow"){
		var username = document.getElementById(id).value;
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un : username, status : true},
			success: function( data, textStatus, jQxhr ){
				 document.getElementById(id).innerHTML = data;
			},
			error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
			}
		});
	}
	else {
		var username = document.getElementById(id).value;
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un : username, status : false },
			success: function( data, textStatus, jQxhr ){
				document.getElementById(id).innerHTML = data;
			},
			error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
			}
		});
	}
}
