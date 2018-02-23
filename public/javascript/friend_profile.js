function showFollowers (userName) {
	$.ajax({
		url: '/getFriendFollowers',
		type: 'post',
		data: { userName: userName },
		success: function (data, textStatus, jQxhr) {
			$('.following').removeClass('active2');
			$('.followers').addClass('active2');
			$('.tweets').removeClass('active2');
			$(result).empty();
			var showfollowing = '';
			for (var i = 0; i < data.length; i++) {
				showfollowing = `<div style="padding:2px" class="col-md-4 col-sm-6">
																	<div style="background-color:white;margin:0" class="card hovercard">
																		<div class="cardheader">
																		</div>
																		<div class="avatar">
																			<img alt="" src="` + data[i].imageURL + `">
																		</div>
																		<div class="info">
																			<div class="title">
																				<a target="_blank" href="` + data[i].imageURL + `">` + data[i].name + `</a>
																			</div>
																			<div class="desc">@` + data[i].username + `</div>
																			<div class="">` + data[i].bio + `</div>
																		</div>
																	</div>
																</div>`;
				$(result).append(showfollowing);
			}
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

function showFollowing (userName) {
//  alert(userName);
	$.ajax({
		url: '/getFriendFollowing',
		type: 'post',
		data: { userName: userName },
		success: function (data, textStatus, jQxhr) {
			$('.following').addClass('active2');
			$('.followers').removeClass('active2');
			$('.tweets').removeClass('active2');
			$(result).empty();
			var showfollowing = '';
			for (var i = 0; i < data.length; i++) {
				showfollowing = `<div style="padding:2px" class="col-md-4 col-sm-6">
																	<div style="background-color:white;margin:0" class="card hovercard">
																		<div class="cardheader">
																		</div>
																		<div class="avatar">
																			<img alt="" src="` + data[i].imageURL + `">
																		</div>
																		<div class="info">
																			<div class="title">
																				<a target="_blank" href="` + data[i].imageURL + `">` + data[i].name + `</a>
																			</div>
																			<div class="desc">@` + data[i].following + `</div>
																			<div class="">` + data[i].bio + `</div>
																		</div>
																	</div>
																</div>`;
				$(result).append(showfollowing);
			}
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

function showTweets (userName) {
	// alert(userName);
	$.ajax({
		url: '/getFriendTweet',
		type: 'post',
		data: { userName: userName },

		success: function (data, textStatus, jQxhr) {
			$('.following').removeClass('active2');
			$('.followers').removeClass('active2');
			$('.tweets').addClass('active2');
			$('.editProfile').removeClass('active2');
			$(result).empty();
			for (var i = 3; i < data.length; i++) {
				var likestatus;
				var likers = '';
				for (var j = 0; j < data[i].like.length; j++) {
					likers += data[i].like[j] + '\n';
				}
				if (data[i].like.includes(data[1])) {
					likestatus = 'Unlike';
				} else {
					likestatus = 'Like';
				}
				var showfollowers = `<div style="padding: 0 15px;">
										<div class="row"
												style="padding: 10px 0;background-color: #ffffff;">
										<div class="col-xs-2" align="center" style="align-self: center;">
											<img class="img-thumbnail" alt="ProfilePicture"
													src="` + data[0] + `"
													style="width: 50px;height: 50px;">
										</div>
										<div class="col-xs-10" id="` + data[i]._id + `">
											<span><a
												style="color: black;font-size: 14px;"
												href='/showFriendProfile?un=` + data[1] + `'>
												<b>` + data[2] + `</b>
												<span style="color: #657786">@` + data[1] + `</span></a>
											</span>
											<p style="word-break: break-all;">` + data[i].tweet + `</p>
											<div id="likebuttondiv">
											<button class="btn btn-default btn-sm like"
															onclick="like(this)"
															id="` + data[i]._id + `"
															value="` + likestatus + `">
												<span id="likestatus">` + likestatus + `  </span>
											</button>
											<span id="` + data[i]._id + `count"
																title="` + likers + `">` +
																data[i].like.length + `</span>
											</div>
										</div>
									</div>
								</div><hr style="margin: 0"><hr style="margin: 0">`;
				$(result).append(showfollowers);
			}
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}
