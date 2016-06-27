(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed').each(function (index, dl) {
		var isIE8 = navigator.userAgent.match(/msie 8/i);
		var isIE9 = navigator.userAgent.match(/msie 9/i);

		$allDDs = $(this).find('> dd');

		if (isIE9) {
			$allDDs.each(function (index, dd) {
				dd.style.display = 'none';

				// height values and transitions would effect jQuery sliding
				dd.style.height = 'auto';
				dd.style.transitionProperty = 'none';
			});
		}


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

				if (isIE8) {
				}

				if (isIE9) {
					if (wasCollapsed) {
						$dd.slideDown();
					} else {
						$dd.slideUp();
					}
				}

				if (!isIE8 && !isIE9) {
					if (wasCollapsed) {
						var content = $dd.find('> .content')[0];
						if (content.knownExpandedHeight > 20) {
							setTimeout(function () {
								var newExpandedHeight = $(content).outerHeight();
								if (newExpandedHeight !== content.knownExpandedHeight) {
									content.knownExpandedHeight = newExpandedHeight;
									dd.style.height = content.knownExpandedHeight+'px';
								}
							}, 200);
						} else {
							content.knownExpandedHeight = $(content).outerHeight();
						}

						dd.style.height = content.knownExpandedHeight+'px';
					} else {
						dd.style.height = '0px';
					}
				}

				$dd.toggleClass('expanded');
			}
		});
	});
})();