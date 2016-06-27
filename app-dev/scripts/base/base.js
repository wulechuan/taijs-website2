(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed dt').on('click', function (event) {
		var $dd = $(this).find('+ dd');
		var allowTransition = !navigator.userAgent.match(/msie 8/i);

		if ($dd.hasClass('expanded')) {
			if (allowTransition) $dd.slideUp();
		} else {
			if (allowTransition) $dd.slideDown();
		}

		$dd.toggleClass('expanded');
	});
})();