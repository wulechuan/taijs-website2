(function () {
	$('#credit-abstract-pane button').on('click', function(event) {
		$('.popup-layers-container-backplate').show();
		$('#pl-taijs-app-promotion').show();
	});

	$('#credit-details-pane .docking button').on('click', function(event) {
		console.log($('#credit-details-pane .expandable'));
		$('#credit-details-pane .expandable').toggleClass('expanded');
	});

	$('#pl-taijs-app-promotion .button-x').on('click', function(event) {
		$('.popup-layers-container-backplate').hide();
		$('#pl-taijs-app-promotion').hide();
	});
})();