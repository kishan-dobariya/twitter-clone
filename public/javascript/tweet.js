function focusTweetBox () {
	$('#tweet').focus();
}

function tweetValidation () {
	if ((document.getElementById('tweet').value == '') && (document.getElementById('imageTweet').value == '')) {
		return false;
	} else {
		return true;
	}
}

// $('#tweetbutton').click(function () {
// 	Tweet = document.getElementById('tweet').value;
// 	imageTweet = document.getElementById('pictureTweet').value;
// 	if (imageTweet == "") {
// 		alert("simple tweet");
// 		$.ajax({
// 			url: '/insertfeed',
// 			type: 'post',
// 			data: { tweet: Tweet },
// 			success: function (data, textStatus, jQxhr) {
// 				$('#tweet').val('');
// 				location.reload();
// 			},
// 			error: function (jqXhr, textStatus, errorThrown) {
// 				console.log(errorThrown);
// 			}
// 		});
// 	}
// 	else {
// 		alert("tweet with image");
// var fileSelect = document.getElementById('pictureTweet');
// var uploadButton = document.getElementById('tweetbutton');
// // uploadButton.innerHTML = 'Uploading...';
// var formData = new FormData();
// console.log(fileSelect.files[0]);
// console.log(fileSelect.files[0].name);
// formData.append('photos[]', fileSelect.files[0], fileSelect.files[0].name);
// console.log("formData",formData);
// 		$.ajax({
// 			url: '/insertfeedImage',
// 			type: 'post',
// 			data: { tweet: Tweet,
// 							pictureTweet: formData},
// 			success: function (data, textStatus, jQxhr) {
// 				alert("success");
// 				$('#tweet').val('');
// 				location.reload();
// 			},
// 			error: function (jqXhr, textStatus, errorThrown) {
// 				console.log(errorThrown);
// 			}
// 		});
// 	}
// });
