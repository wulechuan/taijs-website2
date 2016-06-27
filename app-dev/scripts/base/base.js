(function () {
	window.console = window.console || { log: function () {} };
	$('dl.initially-collapsed').each(function (index, dl) {
		var isIE8 = navigator.userAgent.match(/msie 8/i);
		var isIE9 = navigator.userAgent.match(/msie 9/i);

		$allDTs = $(this).find('> dt');
		$allDDs = $(this).find('> dd');

		// if (isIE8) {
		// 	$allDDs.each(function (index, dd) {
		// 		dd.style.transitionProperty = 'none';
		// 	});
		// }

		if (isIE9) {
			$allDDs.each(function (index, dd) {
				dd.style.display = 'none';

				// height values and transitions would effect jQuery sliding
				dd.style.height = 'auto';
				dd.style.transitionProperty = 'none';
			});
		}




		$allDTs.on('click', function (event) {
			var $thisDT = $(this);
			var thisDD = $thisDT.find('+ dd')[0];

			var newHeightOfDLForIE8 = 0;
			var ddHeight;
			for (var i = 0; i < $allDDs.length; i++) {
				var dd = $allDDs[i];
				if (dd === thisDD) {
					ddHeight = _processOneDD(dd, 'toggle');
				} else {
					ddHeight = _processOneDD(dd, 'collapse');
				}

				if (isIE8 && ddHeight) newHeightOfDLForIE8 += ddHeight;
			}

			if (isIE8) {
				for (var i = 0; i < $allDTs.length; i++) {
					newHeightOfDLForIE8 += $($allDTs[i]).outerHeight();
				}
				dl.style.height = newHeightOfDLForIE8+'px';
			}


			function _processOneDD(dd, action) {
				var $dd = $(dd);
				var wasCollapsed = !$dd.hasClass('expanded');
				var needAction = (!wasCollapsed && action==='collapse') || (action==='toggle');
				if (!needAction) return 0;


				if (isIE8) {
					if (wasCollapsed) {
						var content = $dd.find('> .content')[0];
						var ddExpandedHeight = $(content).outerHeight();

						$dd.addClass('expanded');
						$thisDT.addClass('expanded');

						dd.style.height = ddExpandedHeight+'px';

						return ddExpandedHeight;
					} else {
						$dd.removeClass('expanded');
						$thisDT.removeClass('expanded');

						dd.style.height = '';

						return 0;
					}
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
						dd.style.height = '';
					}
				}


				if (wasCollapsed) {
					$dd.addClass('expanded');
					$thisDT.addClass('expanded');
				} else {
					$dd.removeClass('expanded');
					$thisDT.removeClass('expanded');
				}


				return 0;
			}
		});
	});
})();