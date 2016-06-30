(function () {
	console.log('this is "xfzq-page-bills-list.js"');
	var $lists = $('.lists');
	$lists.parent().on('click', function () {
		$lists.toggle();
	})
})();