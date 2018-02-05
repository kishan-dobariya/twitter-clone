var modal = document.getElementById('myModal');
var btn = document.getElementById("showTweets");
var result = document.getElementById("result");
btn.onclick = function() {
	alert("click");
	$.ajax({
		url: '/getfollowing',
		type: 'post',
		success: function( data, textStatus, jQxhr ){
			// document.getElementById("showfollowing").style.display = "inline-block";
			// document.getElementById("showfollowing").innerHTML = data;
			console.log(data);
			console.log(data.length);
			var showfollowing = "";
			for (var i = 0; i<data.length; i++) {
				showfollowing += "<div class='col-md-4'>"+
												"<img align='left' class='fb-image-lg'>"+
												"src='/images/profilepics/twittericon.png'/>"+
												"<img align='left' class=' img-thumbnail img-circle'"+
												"src=''/>" +
												"<p>"+ data[i].following +"</p>" +
												"</div>";
			}
			$(result).append(showfollowing);
			// var following = '<div class="twitter-profile col-md-3">
			// 		<img align="left" class="fb-image-lg"
			// 				 src="http:/'/'lorempixel.com/850/280/nightlife/5/" alt="Profile image example"/>
			// 				<img align="left" class="twitter-image-profile img-thumbnail img-circle"
			// 					src="" alt="Profile image example"/>
			// 						<ul class="nav nav-tabs">
			// 							<li class="active">
			// 								<a href="#tab_default_1" id="showTweets" data-toggle="tab">
			// 								Tweets </a>
			// 							</li>
			// 							<li>
			// 								<a href="#tab_default_2" data-toggle="tab">
			// 			 						Followers
			// 			 					</a>
			// 							</li>
			// 							<li>
			// 								<a href="#tab_default_3" data-toggle="tab">
			// 			 						Following
			// 			 					</a>
			// 								</li>
			// 							</ul>
			// 						</div>';
		},
		error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
		}
	});
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
