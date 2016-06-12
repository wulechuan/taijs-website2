(function () {
	$('#credit-abstract button').on('click', function(event) {
		$('.popup-layers-container-backplate').show();
		$('#pl-taijs-app-promotion').show();
	});
	$('#pl-taijs-app-promotion .button-x').on('click', function(event) {
		$('.popup-layers-container-backplate').hide();
		$('#pl-taijs-app-promotion').hide();
	});
})();