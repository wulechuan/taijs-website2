(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed dt').on('click', function (event) {
		// $(this).find('+ dd').toggleClass('expanded');
		$(this).find('+ dd').slideToggle();
	});
})();