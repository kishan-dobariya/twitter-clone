function test(data) {
	var id = data.id;
	var status = data.innerHTML.trim();
	console.log("value",status)
	if(status == "Follow"){
		var username = document.getElementById(id).value;
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un : username, status : true},
			success: function( data, textStatus, jQxhr ){
				// console.log("data",data);
				document.getElementById(id).innerHTML = data;
				 // data.innerHTML = data;
			},
			error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
			}
		});
	}
	else if(status == "Unfollow") {
		var username = document.getElementById(id).value;
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un : username, status : false },
			success: function( data, textStatus, jQxhr ){
				// console.log("data",data)
				document.getElementById(id).innerHTML = data;

			},
			error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
			}
		});
	}
}
