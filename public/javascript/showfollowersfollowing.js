var following = document.getElementById('following');
var result = document.getElementById('result');
following.onclick = function () {
	$.ajax({
		url: '/getfollowing',
		type: 'post',
		success: function (data, textStatus, jQxhr) {
			$('.following').addClass('active2');
			$('.followers').removeClass('active2');
			$('.tweets').removeClass('active2');
			$('.editProfile').removeClass('active2');
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
																				<a target="_blank" href="/showFriendProfile?un=` +
																											data[i].following + `">` + data[i].following + `</a>
																			</div>
																			<div class="desc">@` + data[i].following + `</div>
																		<button class="btn btn-primary" onclick="test(this);"
																						id="` + data[i].following + `" value="` + data[i].following + `">Unfollow</button>
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
};

var followers = document.getElementById('followers');
followers.onclick = function () {
	$.ajax({
		url: '/getfollowers',
		type: 'post',
		success: function (data, textStatus, jQxhr) {
			$('.following').removeClass('active2');
			$('.followers').addClass('active2');
			$('.tweets').removeClass('active2');
			$('.editProfile').removeClass('active2');
			$(result).empty();
			for (var i = 0; i < data.length; i++) {
				var showfollowers = `<div style="padding:2px" class="col-md-4 col-sm-6">
																	<div style="background-color:white;margin:0" class="card hovercard">
																		<div class="cardheader">
																		</div>
																		<div class="avatar">
																			<img alt="" src="` + data[i].imageURL + `">
																		</div>
																		<div class="info">
																			<div class="title">
																				<a target="_blank" href="/showFriendProfile?un=` + data[i].username + `">` + data[i].name + `</a>
																			</div>
					 														<div class="desc">@` + data[i].username + `</div>
																			<button class="btn btn-primary" onclick="test(this);"
																						id="` + data[i].username + `" value="` + data[i].username + `">
																						` + data[i].reverseStatus + `</button>
																		</div>
																	</div>
																</div>`;
				$(result).append(showfollowers);
			}
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
};

var tweets = document.getElementById('tweets');
tweets.onclick = function () {
	$.ajax({
		url: '/getTweet',
		type: 'post',
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

											<div class="dropleft" style="float:right">
												<span data-toggle="dropdown"
												class="dropdown-submenu pull-left glyphicon glyphicon-menu-left"></span>
												<ul class="dropdown-menu">
													<li><a onclick="editeTweet('` + data[i]._id + `');">
															Edit
															</a>
													</li>
													<li><a onclick="deleteTweet('` + data[i]._id + `');">
															Delete
															</a>
													</li>
												</ul>
											</div>
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
};

function editeTweet (obj) {
	$('.following').removeClass('active2');
	$('.followers').removeClass('active2');
	$('.tweets').removeClass('active2');
	$('.editProfile').addClass('active2');
	var element = document.getElementById(obj);
	var tweetID = element.childNodes[7].childNodes[1].id;
	$('.twitter-profile').addClass('blur');
	$('#userInfo').addClass('blur');
	var element = document.getElementById(obj);
	var tweet = element.childNodes[5];
	var likeButton = element.childNodes[8];
	var tweetValue = element.childNodes[5].innerHTML;
	var editDiv = document.createElement('DIV');
	editDiv.setAttribute('id', 'editDiv');
	element.replaceChild(editDiv, tweet);

	var br = document.createElement('br');

	var input = document.createElement('INPUT');
	input.setAttribute('type', 'text');
	input.setAttribute('value', tweetValue);
	input.setAttribute('class', 'form-control');
	input.setAttribute('name', 'editTweet');
	input.setAttribute('id', 'editTweet');

	editDiv.append(input);

	editDiv.append(br);

	var btnEdit = document.createElement('BUTTON');
	btnEdit.setAttribute('class', 'btn btn-primary editButton');
	btnEdit.setAttribute('id', tweetID);
	btnEdit.setAttribute('value', 'Edit');
	btnEdit.setAttribute('onclick', 'edit(this);');

	editDiv.append(btnEdit);
	editDiv.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';

	var btnCancel = document.createElement('BUTTON');
	btnCancel.setAttribute('class', 'btn btn-primary cancelButton');
	btnCancel.setAttribute('id', 'cancel');
	btnCancel.setAttribute('value', 'Cancel');
	btnCancel.setAttribute('onclick', 'cancel1();');

	editDiv.append(btnCancel);
	document.getElementsByClassName('editButton')[0].innerHTML = 'Done';
	document.getElementsByClassName('cancelButton')[0].innerHTML = 'Cancel';
	element.removeChild(element.childNodes[7]);
}

function edit (button) {
	var tweetId = button.id;
	var editedTeet = document.getElementById('editTweet').value;
	$.ajax({
		url: '/edittweet',
		type: 'post',
		data: { newTweet: editedTeet,
			tweetId: tweetId },
		success: function (data, textStatus, jQxhr) {
			$('#tweets').trigger('click');
			$('.twitter-profile').removeClass('blur');
			$('#userInfo').removeClass('blur');
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

function deleteTweet (button) {
	var tweetId = button;
	$.ajax({
		url: '/deletetweet',
		type: 'post',
		data: { tweetId: tweetId },
		success: function (data, textStatus, jQxhr) {
			if (data) {
				document.getElementById('mytweetsCount').innerHTML--;
				$('#tweets').trigger('click');
			} else {
				$('#tweets').trigger('click');
			}
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

function cancel1 () {
	$('.twitter-profile').removeClass('blur');
	$('#userInfo').removeClass('blur');
	$('#tweets').trigger('click');
}
