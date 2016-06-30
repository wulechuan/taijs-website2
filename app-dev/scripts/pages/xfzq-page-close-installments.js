(function () {
	$('#button-close-selected-installments').on('click', function(event) {
		$('.popup-layers-back-plate').show();
		$('#pl-close-installments-succeed').show();
	});

	$('#pl-close-installments-succeed').on('click', function(event) {
		if (event) event.stopPropagation();
		$('.popup-layers-back-plate').hide();
		$('#pl-close-installments-succeed').hide();
	});

	var $allListItems = $('.tabular .f-list > li');

	$allListItems.each(function () {
		var $listItem = $(this);
		var $checkbox = $listItem.find('input[type="checkbox"]');
		$checkbox.on('click', function(event) {
			if (event) event.stopPropagation();

			if (this.checked) {
				$listItem.addClass('selected');
			} else {
				$listItem.removeClass('selected');
			}
		});
	});
})();