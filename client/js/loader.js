if (Meteor.isClient) {
	showLoaderOverlay = function(noAnimIn, setAnimIn) {
		if (!$('#loaderContainer').length) {
			$('body').prepend('<div id="loaderContainer"><div class="bg-loader-wrap"><span><span></span></span></div><svg id="svg" width="200" height="200" viewBox="0 0 200 200"><path id="circle-path" d="M10,100a90,90 0 1,0 180,0a90,90 0 1,0 -180,0"/><path id="rect-path" d="M90,10 110,10 110,190 90,190 90,10" /><path id="triangle-path" d="M100,40 170,160 30,160 100,40" /></svg><canvas id="loaderCanvas" width="200" height="200"></canvas></div>');
			if (noAnimIn) {
				$('#loaderContainer').show(0, function() {
					animateLoader();
				});
			}
			else{
				$('#loaderContainer').fadeIn((setAnimIn? setAnimIn: 600), function() {
					animateLoader();
				});
			};
		};	
	};

	isAnimingOut = false, firstLoading = true;
	removeLoaderOverlay = function(noAnimOut, settAnimOut) {
		if ($('#loaderContainer').length && !isAnimingOut) {
			
			if (firstLoading) {
				$('#loaderContainer').addClass('animating1');
				firstLoading = false; removeLoaderOverlay(false, 1500);
				setTimeout(function() {
					isAnimingOut = true;
					cancelLoader = true;
					$('.bg-loader-wrap>span').css('opacity', '0.6');
					setTimeout(function() {
						$('#loaderContainer').addClass('animating2');
					}, 50);
				}, 300);
				return;
			};


			if (noAnimOut) {
				$('#loaderContainer').remove();
				cancelLoader = true;
				isAnimingOut = false;
			}
			else{
				isAnimingOut = true;
				$('#loaderContainer').fadeOut((settAnimOut? settAnimOut: 600), function() {
					$('#loaderContainer').remove();
					cancelLoader = true;
					isAnimingOut = false;
				});
			};
		};
	};

	showLoaderOverlay(true);
	setTimeout(function() {
		removeLoaderOverlay();
	}, 2100);

	Template.loader.rendered = function () {
		showLoaderOverlay(false, 420);
	};

	Template.loader.destroyed = function () {
		if (!firstLoading) {
			removeLoaderOverlay();
		};
	};
};