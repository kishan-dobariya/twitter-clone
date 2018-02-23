function focusTweetBox () {
	$('#tweet').focus();
}

$('#tweetbutton').click(function () {
	Tweet = document.getElementById('tweet').value;
	$.ajax({
		url: '/insertfeed',
		type: 'post',
		data: { tweet: Tweet },
		success: function (data, textStatus, jQxhr) {
			$('#tweet').val('');
			location.reload();
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
});
