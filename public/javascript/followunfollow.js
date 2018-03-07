function test (data) {
	var id = data.id;
	var status = data.innerHTML.trim();
	if (status == 'Follow') {
		var username = $('button#' + id).val();
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un: username, status: true},
			success: function (data, textStatus, jQxhr) {
				$('button#' + id).text(data);
				if ($('p#myfollowingCount').val() != undefined) {
					document.getElementById('myfollowingCount').innerHTML++;
				}
			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});
	} else if (status == 'Unfollow') {
		var username = $('button#' + id).val();
		$.ajax({
			url: '/follow',
			type: 'post',
			data: { un: username, status: false },
			success: function (data, textStatus, jQxhr) {
				$('button#' + id).text(data);
				if ($('p#myfollowingCount').val() != undefined) {
					document.getElementById('myfollowingCount').innerHTML--;
				}
			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});
	}
}
