(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed dt').on('click', function (event) {
		var $dd = $(this).find('+ dd');
		if ($dd.hasClass('expanded')) {
			$dd.slideUp();
		} else {
			$dd.slideDown();
		}
		$dd.toggleClass('expanded');
	});
})();