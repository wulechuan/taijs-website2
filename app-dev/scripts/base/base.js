(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed').each(function (index, dl) {
		var allowTransition = !navigator.userAgent.match(/msie 8/i);

		$allDDs = $(this).find('> dd');

		$(this).find('> dt').on('click', function (event) {
			var myDD = $(this).find('+ dd')[0];

			for (var i = 0; i < $allDDs.length; i++) {
				var dd = $allDDs[i];
				if (dd === myDD) {
					_processOneDD(dd, 'toggle');
				} else {
					_processOneDD(dd, 'collapse');
				}
			}

			function _processOneDD(dd, action) {
				var $dd = $(dd);
				var wasCollapsed = !$dd.hasClass('expanded');
				var needNoAction = wasCollapsed && action==='collapse';
				if (needNoAction) return true;

				if (wasCollapsed) {
					if (allowTransition) $dd.slideDown();
				} else {
					if (allowTransition) $dd.slideUp();
				}

				$dd.toggleClass('expanded');
			}
		});
	});
})();