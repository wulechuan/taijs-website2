(function () {
	window.console = window.console || { log: function () {} };



	$('.tab-panel-set').each(function () {
		var $allTabs = $(this).find('.tab-list > li');

		$allTabs.each(function (index, tab) {
			var panel = $('#'+tab.getAttribute('aria-controls'))[0];

			if (!panel) return false;

			panel.elements = { tab: tab };
			tab.elements = { panel: panel };

			if (index === 0) {
				_processOnePair(tab, true);
			}
		});

		$allTabs.on('click', function () {
			_showPanelViaTab(this);
		});

		function _showPanelViaTab(theTab) {
			for (var i = 0; i < $allTabs.length; i++) {
				var tab = $allTabs[i];
				_processOnePair(tab, tab === theTab);
			}
		}

		function _processOnePair(tab, isToShownMyPanel) {
			var panel = tab.elements.panel;

			if (!panel) return false;

			// if (isIE8) {
			// 	var forceUpdatingContainer = dl.parentNode
			// 		// || $(this).parents('.page-content')[0]
			// 		// || $(this).parents('.page')[0]
			// 		// || document.body
			// 	;
			// }

			if (isToShownMyPanel) {
				panel.setAttribute('aria-hidden', false);
				$(tab).addClass('current');
				$(panel).addClass('current');
			} else {
				panel.setAttribute('aria-hidden', true);
				$(tab).removeClass('current');
				$(panel).removeClass('current');
			}

			panel.style.display = isToShownMyPanel ? 'block' : 'none';
		}
	});



	$('dl.initially-collapsed').each(function (index, dl) {
		var isIE8 = !!navigator.userAgent.match(/msie 8/i);
		var isIE9 = !!navigator.userAgent.match(/msie 9/i);


		var $allDTs = $(this).find('> dt');
		var $allDDs = $(this).find('> dd');

		$allDTs.each(function (index, dt) {
			var dd = $(dt).find('+ dd')[0];
			var ddContent = $(dd).find('> .content')[0];

			dd.elements = { dt: dt, content: ddContent };
			dt.elements = { dd: dd };

			dd.setAttribute('aria-expanded', false);
			dd.setAttribute('aria-hidden', true);

			if (isIE9) {
				dd.style.display = 'none';

				// height values and transitions would effect jQuery sliding
				dd.style.height = 'auto';
				// dd.style.transitionProperty = 'none';
			}
		});




		$allDTs.on('click', function () {
			var thisDD = this.elements.dd;

			var forceUpdatingContainer = null;
			if (isIE8) {
				forceUpdatingContainer = dl.parentNode
					// || $(this).parents('.page-content')[0]
					// || $(this).parents('.page')[0]
					// || document.body
				;
			}

			var dlNewHeight = 0;
			var accumHeight;

			for (var i = 0; i < $allDDs.length; i++) {
				var dd = $allDDs[i];
				if (dd === thisDD) {
					accumHeight = _processOnePair(dd, 'toggle');
				} else {
					accumHeight = _processOnePair(dd, 'collapse');
				}

				if (isIE8 && accumHeight) dlNewHeight += accumHeight;
			}

			if (isIE8) {
				if (forceUpdatingContainer) forceUpdatingContainer.visibility = 'hidden';
				dl.style.height = dlNewHeight + 'px';

				setTimeout(function () {
					if (forceUpdatingContainer) forceUpdatingContainer.visibility = '';
				}, 0);
			}


			function _processOnePair(dd, action) {
				var ddBottomBorderWidth = 1;
				var $dd = $(dd);
				var $dt = $(dd.elements.dt);
				var content = dd.elements.content;

				var dtHeight = 0;
				var ddNewHeight = 0;
				var ddContentCurrentHeight;

				if (isIE8) {
					dtHeight = $dt.outerHeight();
				}

				var wasCollapsed = !$dd.hasClass('expanded');
				var needAction = (!wasCollapsed && action==='collapse') || (action==='toggle');
				if (!needAction) {
					if (isIE8) {
						return dtHeight;
					}

					return 0;
				}


				if (isIE8) { // update className BEFORE animation
					if (wasCollapsed) {
						ddContentCurrentHeight = $(content).outerHeight();
						ddNewHeight = ddContentCurrentHeight + ddBottomBorderWidth;

						$dd.addClass('expanded');
						dd.setAttribute('aria-expanded', true);
						dd.setAttribute('aria-hidden',   false);
						$dt.addClass('expanded');

						dd.style.height = ddNewHeight + 'px';

						return dtHeight+ddNewHeight;
					} else {
						$dd.removeClass('expanded');
						dd.setAttribute('aria-expanded', false);
						dd.setAttribute('aria-hidden',   true);
						$dt.removeClass('expanded');

						dd.style.height = '0px';

						return dtHeight;
					}
				} else if (isIE9) { // update className BEFORE animation
					if (wasCollapsed) {
						$dd.addClass('expanded');
						dd.setAttribute('aria-expanded', true);
						dd.setAttribute('aria-hidden',   false);
						$dt.addClass('expanded');
						$dd.slideDown();
					} else {
						$dd.removeClass('expanded');
						dd.setAttribute('aria-expanded', false);
						dd.setAttribute('aria-hidden',   true);
						$dt.removeClass('expanded');
						$dd.slideUp();
					}
				} else { // update className AFTER transition
					if (wasCollapsed) {
						if (content.knownHeight > 20) {
							setTimeout(function () {
								var ddContentCurrentHeight = $(content).outerHeight();
								if (ddContentCurrentHeight !== content.knownHeight) {
									content.knownHeight = ddContentCurrentHeight;
									ddNewHeight = ddContentCurrentHeight + ddBottomBorderWidth;
									dd.style.height = content.ddNewHeight+'px';
								}
							}, 100);
						} else {
							content.knownHeight = $(content).outerHeight();
						}

						ddNewHeight = content.knownHeight + ddBottomBorderWidth;
						dd.style.height = ddNewHeight+'px';

						$dd.addClass('expanded');
						dd.setAttribute('aria-expanded', true);
						dd.setAttribute('aria-hidden',   false);
						$dt.addClass('expanded');
					} else {
						dd.style.height = '';

						$dd.removeClass('expanded');
						dd.setAttribute('aria-expanded', false);
						dd.setAttribute('aria-hidden',   true);
						$dt.removeClass('expanded');
					}
				}


				return 0;
			}
		});
	});

	setPageSidebarNavCurrentItem(processParametersPassedIn().psn);

    function processParametersPassedIn() {
        var qString = location.href.match(/\?.*/);
        if (qString) qString = qString[0].slice(1);

        var qKVPairs = [];
        if (qString) {
            qKVPairs = qString.split('&');
        }

        var psn1; // page sidebar nav Level 1 current
        var psn2; // page sidebar nav Level 2 current

        for (var i in qKVPairs){
            var kvpString = qKVPairs[i];
            var kvp = kvpString.split('=');

            if (kvp[0] === 'psn1') psn1 = kvp[1];
            if (kvp[0] === 'psn2') psn2 = kvp[1];
        }

        return {
            psn: {
            	level1: psn1,
            	level2: psn2
            }
        };
    }

    function setPageSidebarNavCurrentItem(conf) {
    	conf = conf || {};
		conf.level1IdPrefix = 'menu-psn-1-';
		setMenuCurrentItemForLevel(1, 2, $('#page-sidebar-nav'), conf);
    }

    function setMenuCurrentItemForLevel(level, depth, parentDom, conf) {
    	level = parseInt(level);
    	depth = parseInt(depth);
    	if (!(level > 0) || !(depth >= level)) {
    		throw('Invalid menu level/depth for configuring a menu tree.');
    	}
    	if (typeof conf !== 'object') {
    		throw('Invalid configuration object for configuring a menu tree.');
    	}

		var prefix = conf['level'+level+'IdPrefix'];
		var desiredId = prefix + conf['level'+level];

		var $allItems = $(parentDom).find('.menu.level-'+level+' > .menu-item');
		var currentItem;
		var currentItemId;
		$allItems.each(function (index, menuItem) {
			var itemLabel = $(menuItem).find('> a > .label')[0];
			var itemId = itemLabel.id;

			if (itemId && desiredId && (itemId===desiredId)) {
				currentItem = menuItem;
				currentItemId = itemId;
				$(menuItem).addClass('current');
			} else {
				$(menuItem).removeClass('current');
			}
		});

		if (level < depth && currentItem) {
			var nextLevel = level + 1;
			conf['level'+nextLevel+'IdPrefix'] = currentItemId + '-' + nextLevel + '-';
			var subLevelCurrentItem = setMenuCurrentItemForLevel(nextLevel, depth, currentItem, conf);
		}

		return currentItem;
    }
})();