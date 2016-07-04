(function () {
	var $pL = $('#pl-quick-repayment-succeed');
	var $bP = $('.popup-layers-back-plate');
	$('#button-submit-quick-repayment').on('click', function(event) {
		if (event) event.preventDefault();
		$bP.show();
		$pL.show();
	});

	$pL.on('click', function(event) {
		if (event) event.stopPropagation();
		$bP.hide();
		$pL.hide();
	});
})();