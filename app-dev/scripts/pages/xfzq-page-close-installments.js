(function () {
	$('body').on('click', function(event) {
		$('.popup-layers-container-backplate').show();
		$('#pl-close-installments-succeed').show();
	});

	$('#pl-close-installments-succeed').on('click', function(event) {
		if (event) event.stopPropagation();
		$('.popup-layers-container-backplate').hide();
		$('#pl-close-installments-succeed').hide();
	});
})();