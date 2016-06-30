(function () {
	var $lists = $('.lists');
	$lists.each(function () {
		var $list = $(this);
		$list.parent().on('click', function () {
			$list.toggle();
		});
	});
})();