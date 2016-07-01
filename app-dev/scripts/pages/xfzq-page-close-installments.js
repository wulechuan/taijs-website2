(function () {
	$('#button-close-selected-installments').on('click', function(event) {
		if (event) event.preventDefault();
		location.assign('../html/xfzq-close-installments-step-1-choose-bank-card.html?psn1=taiyx&psn2=close-installments');
	});

	$('#button-submit-chosen-bank-card').on('click', function(event) {
		if (event) event.preventDefault();
		location.assign('../html/xfzq-close-installments-step-2-proceed.html?psn1=taiyx&psn2=close-installments');
	});

	$('#button-submit-closing-installments').on('click', function(event) {
		if (event) event.preventDefault();
		$('.popup-layers-back-plate').show();
		$('#pl-close-installments-succeed').show();
	});

	$('#pl-close-installments-succeed').on('click', function(event) {
		if (event) event.stopPropagation();
		$('.popup-layers-back-plate').hide();
		$('#pl-close-installments-succeed').hide();
	});
})();