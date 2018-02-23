function like (obj) {
	var id = obj.id;
	var value = obj.childNodes[1].innerHTML;

	$.ajax({
		url: '/like',
		type: 'post',
		data: { likestatus: value,
			id: id },
		success: function (data, textStatus, jQxhr) {
			var id = data.id;
			obj.childNodes[1].innerHTML = data.status;
			document.getElementById(id + 'count').innerHTML = data.tweetcount;
		},
		error: function (jqXhr, textStatus, errorThrown) {
			console.log('error', errorThrown);
		}
	});
};
