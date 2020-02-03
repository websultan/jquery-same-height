;(function() {
	$.fn.sameHeight = function(options) {
		
		var settings = $.extend({
			widthBreak : 0,
			resize: true,
			byRow: true,
			parentBlock: undefined,
		}, options);

		var element = this,
			elementImages = element.find('img'),
			elementHeight,
			parentBlock = settings.parentBlock || element.parent();
		
		var actions = {
			reset: function () {
				element.css('height', '');
			},
			init: function () {
				if ( $(window).width() >= settings.widthBreak ) {
					var maxHeight = 0,
						elementBoxSizing = element.css('box-sizing'),
						getMaxHeight = function (obj) {
							if ( elementBoxSizing == 'border-box' ) {
								elementHeight = $(obj).outerHeight();
							} else {
								elementHeight = $(obj).height();
							}
							if ( elementHeight > maxHeight ) {
								maxHeight = elementHeight;
							}
						};
					if ( settings.byRow ) {
						var parentBlockWidth = $(parentBlock).outerWidth(),
							parentItemWidth = $(parentBlock + '> *').outerWidth(true),
							countElements = element.length,
							countElementsInRow = Math.floor(parentBlockWidth / parentItemWidth),
							countRows = Math.ceil(countElements / countElementsInRow);

						for (var row = 0; row < countRows; row++) {
							var elementRowFirst = countElementsInRow * row,
								elementRowLast = countElementsInRow * (row + 1),
								elementsCurrent = element.slice(elementRowFirst, elementRowLast);
							
							elementsCurrent.each(function() {
								getMaxHeight(this);
							});
							
							elementsCurrent.css('height', maxHeight);
							maxHeight = 0;
						}
					} else {
						element.each(function() {
							getMaxHeight(this);
						});

						element.css('height', maxHeight);
					}
						
					
				}
			}
		}

		if (elementImages.length) {
			elementImages.one('load', function() {
				actions.reset();
				actions.init();
			}).each(function() {
				if (this.complete) {
					$(this).load(); // For jQuery < 3.0 
					// $(this).trigger('load'); // For jQuery >= 3.0 
				}
			});

		} else {
			actions.reset();
			actions.init();
		}

		$(window).resize(function() {
			actions.reset();

			if (settings.resize) {	
				actions.init();
			}
		});
	};

})($);