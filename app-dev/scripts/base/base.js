(function () {
	window.console = window.console || { log: function () {} };
	var isIE8 = !!navigator.userAgent.match(/msie 8/i);
	var isIE9 = !!navigator.userAgent.match(/msie 9/i);



	$('.tab-panel-set').each(function () {
		var forceUpdatingContainer = null;
		if (isIE8) {
			forceUpdatingContainer = 
				$(this).parents('.page')[0] || document.body
			;
		}

		var $allTabs = $(this).find('.tab-list > li');

		$allTabs.each(function (index, tab) {
			var panelId = tab.getAttribute('aria-controls');
			var panel = $('#'+panelId)[0];

			if (!panel) throw('Can not find controlled panel for tab [expected panel id="'+panelId+'"].');

			panel.elements = { tab: tab };
			tab.elements = { panel: panel };

		});

		$allTabs.on('click', function () {
			_showPanelAccordingToTab(this);
		});

		_showPanelAccordingToTab($allTabs[0]);

		function _showPanelAccordingToTab(theTab) {
			for (var i = 0; i < $allTabs.length; i++) {
				var tab = $allTabs[i];
				_processOnePairOfTabPanel(tab, (theTab && tab === theTab));
			}

			if (isIE8) {
				if (forceUpdatingContainer) {
					forceUpdatingContainer.visibility = 'hidden';
					setTimeout(function () {
						forceUpdatingContainer.visibility = '';
					}, 0);
				}
			}
		}

		function _processOnePairOfTabPanel(tab, isToShownMyPanel) {
			if (!tab) return false;

			var panel = tab.elements.panel;
			if (!panel) return false;

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
		var forceUpdatingContainer = null;
		if (isIE8) {
			forceUpdatingContainer = dl.parentNode
				// || $(this).parents('.page-content')[0]
				// || $(this).parents('.page')[0]
				// || document.body
			;
		}

		var $allDTs = $(this).find('> dt');
		var $allDDs = $(this).find('> dd');

		$allDTs.each(function (index, dt) {
			var dd = $(dt).find('+ dd')[0];
			if (!dd) throw('Can not find <dd> right after a <dt> element.');

			var ddContent = $(dd).find('> .content')[0];
			if (!ddContent) throw('Can not find .content within a <dd> element.');

			dd.elements = { dt: dt, content: ddContent };
			dt.elements = { dd: dd };

			$(dd).removeClass('expanded');

			if (isIE9) {
				dd.style.display = 'none';

				// height values and transitions would effect jQuery sliding
				dd.style.height = 'auto';
				// dd.style.transitionProperty = 'none';
			}
		});


		$allDTs.on('click', function () {
			_showDDAccordingToDT(this);
		});


		_showDDAccordingToDT(null);



		function _showDDAccordingToDT(dt) {
			var theDD = null;
			if (dt) theDD = dt.elements.dd;

			var dlNewHeight = 0;
			var accumHeight;

			for (var i = 0; i < $allDDs.length; i++) {
				var dd = $allDDs[i];
				if (theDD && dd === theDD) {
					accumHeight = _processOnePairOfDTDD(dd, 'toggle');
				} else {
					accumHeight = _processOnePairOfDTDD(dd, 'collapse');
				}

				if (isIE8 && accumHeight) dlNewHeight += accumHeight;
			}

			if (isIE8) {
				if (forceUpdatingContainer) {
					forceUpdatingContainer.visibility = 'hidden';
					setTimeout(function () {
						forceUpdatingContainer.visibility = '';
					}, 0);
				}

				dl.style.height = dlNewHeight + 'px';
			}
		}

		function _processOnePairOfDTDD(dd, action) {
			if (!dd) return false;

			var dt = dd.elements.dt;
			var content = dd.elements.content;

			if (!dt) return false;
			if (!content) return false;

			var $dt = $(dt);
			var $dd = $(dd);
			var $content = $(content);

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
					ddContentCurrentHeight = $content.outerHeight();
					ddNewHeight = ddContentCurrentHeight;

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
							var ddContentCurrentHeight = $content.outerHeight();
							if (ddContentCurrentHeight !== content.knownHeight) {
								content.knownHeight = ddContentCurrentHeight;
								ddNewHeight = ddContentCurrentHeight;
								dd.style.height = content.ddNewHeight+'px';
							}
						}, 100);
					} else {
						content.knownHeight = $content.outerHeight();
					}

					ddNewHeight = content.knownHeight;
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

        if (typeof window.psn === 'object') {
        	if (window.psn.level1) psn1 = window.psn.level1;
        	if (window.psn.level2) psn2 = window.psn.level2;
        }

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
			setMenuCurrentItemForLevel(nextLevel, depth, currentItem, conf);
		}

		return;
    }


	var $allListItems = $('.tabular .f-list > li');

	$allListItems.each(function () {
		var listItem = this;
		var $listItem = $(this);

		function _updateListItemAccordingToCheckboxStatus(checkbox) {
			if (!checkbox) return false;

			if (checkbox.checked) {
				$listItem.addClass('selected');
			} else {
				$listItem.removeClass('selected');
			}
		}

		var $checkbox = $listItem.find('input[type="checkbox"]');
		setTimeout(function () { /* must dealy because ie8 to ie11 updates cached "checked" statuses very late */
			_updateListItemAccordingToCheckboxStatus($checkbox[0]);
		}, 100);

		$checkbox.on('change', function(event) {
			if (event) event.stopPropagation();

			_updateListItemAccordingToCheckboxStatus(this);

			if (isIE8 || isIE9) {
				function _zoomToFactor(factor) {
					if (factor===1) {
						if (isIE8) {
							listItem.style.zoom = '';
							listItem.style.margin = '';
							return true;
						}
						if (isIE9) {
							listItem.style.msTransform = '';
							return true;
						}
					}

					if (isIE8) {
						var tempMarginHori = oldWidth  * (1 - factor) / 2;
						var tempMarginVert = oldHeight * (1 - factor) / 2 + originalVertMargin;

						if (factor) {
							listItem.style.zoom = factor;
						} else {
							console.error('Invalid zooming factor: ', factor);
							return false;
						}
						listItem.style.margin = tempMarginVert+'px' + ' ' + tempMarginHori+'px';
					}

					if (isIE9) {
						listItem.style.msTransform = 'scale('+factor+')';
					}
				}
				function _doZoomDelay(targetStage) {
					var zoomFactor = 1;
					if (targetStage !== tempStageCounter-1) {
						var lastSegRatioBetweenPiAndTwoPi = 0.75;
						var ratio = Math.cos(targetStage/(tempStageCounter-1) * Math.PI * lastSegRatioBetweenPiAndTwoPi + Math.PI * (2 - lastSegRatioBetweenPiAndTwoPi)) * 0.5 + 0.5;
						ratio = Math.sqrt(ratio);
						zoomFactor = minFactor + (1 - minFactor) * ratio;
					}

					if (targetStage === 0) {
						_zoomToFactor(zoomFactor);
					} else {
						var delayMS = frameGapMS*targetStage;
						setTimeout(function () {
							if (currentAniStage < targetStage) {
								currentAniStage = targetStage;
								_zoomToFactor(zoomFactor);
							}
						}, delayMS);
					}
				}

				var currentAniStage = 0;
				var minFactor = 0.984;
				var frameGapMS, tempStageCounter;

				var originalVertMargin, oldHeight, oldWidth;
				if (isIE8) {
					originalVertMargin = -1; // set by css file
					oldHeight = $listItem.outerHeight();
					oldWidth  = $listItem.outerWidth();
				}

				if (isIE8) {
					frameGapMS = 14;
					tempStageCounter = 18;
				}
				if (isIE9) {
					frameGapMS = 11;
					tempStageCounter = 27;
				}

				for (var i = 0; i < tempStageCounter; i++) {
					_doZoomDelay(i);
				}
			}
		});
	});
})();


(function fakeLogics() {
	var $listsBlocks = $('.lists-block').filter(function () {
		return !$(this).hasClass('close-installments');
	});
	$listsBlocks.each(function () {
		var $listsBlock = $(this);

		var $lists = $listsBlock.find('.lists').show();
		var $empty = $listsBlock.find('.empty-content-hint').hide();

		$listsBlock.on('click', function () {
			$lists.toggle();
			$empty.toggle();
		});
	});
})();