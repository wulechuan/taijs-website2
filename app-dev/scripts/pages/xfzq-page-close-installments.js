(function () {
	$('.page-content').on('click', function(event) {
		$('.popup-layers-back-plate').show();
		$('#pl-close-installments-succeed').show();
	});

	$('#pl-close-installments-succeed').on('click', function(event) {
		if (event) event.stopPropagation();
		$('.popup-layers-back-plate').hide();
		$('#pl-close-installments-succeed').hide();
	});
})();