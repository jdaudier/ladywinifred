$(function() {
	'use strict';

	// Animated dividers
	$('.animated-divider').velocity({
		width: '100%',
		borderColor: '#f288b7'
	}, {
		duration: 3000
	});

	// Smooth scrolling w/ Velocity

	// bind click event to all internal page anchors
	$('a[href*=#]').bind('click', function(e) {

		// prevent default action and bubbling
		e.preventDefault();
		e.stopPropagation();

		// set target to anchor's 'href' attribute
		var target = $(this).attr('href');

		// scroll to each target
		$(target).velocity('scroll', {
			duration: 1000,
			offset: 20,
			easing: 'ease-in-out'
		});
	});

	// Back to top button
	var offset = 300; //"back to top" button is shown
	var $backToTopBtn = $('.top');

	// Hide or show the "back to top" link
	$(window).scroll(function() {
		if ($(this).scrollTop() > offset) {
			$backToTopBtn.addClass('is-visible');
		} else {
			$backToTopBtn.removeClass('is-visible');
		}
	});

	$('.video').fitVids();
});
