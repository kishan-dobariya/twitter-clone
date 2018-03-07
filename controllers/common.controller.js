exports.timeDifference = function (currentTime, tweetTime) {
	if ((currentTime.getFullYear() == tweetTime.getFullYear())) {
		if ((currentTime.getMonth() == tweetTime.getMonth())) {
			if ((currentTime.getDate() == tweetTime.getDate())) {
				if ((currentTime.getHours() == tweetTime.getHours())) {
					return (currentTime.getMinutes() - tweetTime.getMinutes()) + ' Minute Ago';
				} else {
					if (currentTime.getHours() - tweetTime.getHours() > 1) {
						return currentTime.getHours() - tweetTime.getHours() - 1 + ' Hour Ago';
					} else {
						return (currentTime.getMinutes() + (60 - tweetTime.getMinutes())) + ' Minute Ago';
					}
				}
			} else {
				if (currentTime.getDate() - tweetTime.getDate() > 1) {
					return currentTime.getDate() - tweetTime.getDate() - 1 + ' Day Ago';
				} else {
					return (currentTime.getHours() + (23 - tweetTime.getHours())) + ' Hour Ago';
				}
			}
		} else {
			if (currentTime.getMonth() - tweetTime.getMonth() > 1) {
				return currentTime.getMonth() - tweetTime.getMonth() - 1 + ' Month Ago';
			} else {
				return (currentTime.getDate() + (30 - tweetTime.getDate())) + ' Day Ago';
			}
		}
	} else {
		if (currentTime.getFullYear() - tweetTime.getFullYear() > 1) {
			return currentTime.getFullYear() - tweetTime.getFullYear() - 1 + ' Year Ago';
		} else {
			return (currentTime.getMonth() + (12 - tweetTime.getMonth())) + ' Month Ago';
		}
	}
};

exports.editpath = function (url) {
	if (url !== null && url !== undefined) { return url.replace('public\\', ''); }
};

// ------------------------FORMAT DATE(DD/MM/YYYY)----------------------------//
exports.formatDate = function (date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
};

// ------------------------GENERATE 5-CHARACTERS RANDOM NAME-------------------//
exports.randomName = function () {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 5; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

	return text;
};
