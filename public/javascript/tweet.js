$("#tweetbutton").click(function(){
	alert("tweet")
	Tweet = document.getElementById("tweet").value;
	$.ajax({
		url: '/insertfeed',
		type: 'post',
		data: { tweet : Tweet },
		success: function( data, textStatus, jQxhr ){
			$('#tweet').val('');
			// console.log("data---",data);
			location.reload();
		},
		error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
		}
	});
});
