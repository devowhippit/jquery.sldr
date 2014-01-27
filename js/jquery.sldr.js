/*
 * jquery.sldr
 * 
 * A content slider featuring responsive slides, flexible slide widths, callbacks, 
 * and custom animation hooks.
 * 
 * Version: 0.1
 * Minimum requirements: Developed with jQuery 1.10.2, May work with older versions.
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Devon Hirth
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * **************
 *     TO DOS
 * **************
 *
 * 1. Responsive Height (Leave up to css?)
 * 2. Animation Callback for custom transitions
 * 3. Shadow Box Mode???
 * 4. Make Slider.Width() offset dynamic in base.resizeElements
 * 5. Rework Fill gaps to work with post load images.
 *
 * slides.each( function( i ) {
		var th = $( this );
		var thImg = th.find( 'img' );
		var ratio = thImg.attr( 'height' ) / thImg.attr( 'width' );
		var width = actionPanelHeight / ratio;
		th.css( 'height' , actionPanelHeight ).css( 'width' , width + 10 );
	});
 * 
 */
( function( $ ) {

var $win = $( window );

$.sldr = function( el , options ) {

  	/**
  	 * 1. To avoid scope issues, use 'base' instead of 'this.'
  	 * 2. Add Access to jQuery element.
  	 * 3. Add Access to DOM element.
  	 * 4. Add a reverse reference to the DOM object.
  	 */
    var base = this;
    base.$el = $(el);
    base.el  = el;
    base.$el.data( "sldr" , base );

    /**
     * Plugin Vars
     */
    base.callback       = new Array();
    base.sldrSlides     = new Array();
    base.sldrLoadSlides = new Array();
    base.$sliderTimers  = new Array();
	base.$resizeTimers  = new Array();
	base.$delayTimers   = new Array();

	base.wrp            = base.$el.children();
	base.elmnts         = base.wrp.children();
	base.elmntsHTML     = base.wrp.html();

	/**
	 * Initializing function
	 * @return void
	 */
	base.init = function() {

		base.config = $.extend( {} , $.sldr.defaultOptions , options );

		base.browser();

		var sldr       = base.$el;
		var wrp        = sldr.children();
		var elmnts     = wrp.children();
		var elmntsHTML = wrp.html();
		var postLoad   = false;

		/**
		 * Build Slide Array
		 * @type {Number}
		 */
		if ( base.sldrSlides == '' ) {

			base.callback = { 
				'sldr' : base.$el,
				'prevFocalIndex' : '',
				'prevSlideNum' : '',
				'currentFocalIndex' : '',
				'currentClass' : '',
				'currentID' : '',
				'currentFocalPoint' : '',
				'currentSlideNum' : '',
				'shiftWidth' : '',
				'nextFocalIndex' : '',
				'nextSlideNum' : ''
			};

			for ( var i = 1; i < elmnts.length + 1; i++ ) {

				var slide     = elmnts.eq( i - 1 );
				var slideLoad = slide.find( '.sldr-load' )
				base.sldrSlides.push({
					'sld'        : slide,
					'slideNum'   : i,
					'id'         : slide.attr( 'id' ),
					'class_name' : slide.attr( 'class' ),  // 'class' is reserved var in javascript, throws errors in IE changed to 'class_name'
					'html'       : slide.html()
				});

				if ( slideLoad.hasClass( 'sldr-load' ) ) {
					postLoad = true;
					base.sldrLoadSlides.push({
						'slideNum'   : i,
						'id'         : slide.attr( 'id' ),
						'class_name' : slide.attr( 'class' ),  // 'class' is reserved var in javascript, throws errors in IE changed to 'class_name'
						'html'       : slide.html()
					});
				}
			}
		}
		
		/**
		 * Do not finish initiating plugin if there is only one slide.
		 */
		if ( elmnts.length <= 1 ) {
			elmnts.eq( 0 ).addClass( base.config.focalClass );
			base.sliderInit( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
			base.sliderLoaded( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
		}

		/**
		 * Fill Gaps (if any)
		 */
		if ( elmnts.length > 1 ) base.fillGaps( elmntsHTML );

		/**
		 * sliderInit Callback
		 */
		base.sliderInit( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );

		/**
		 * Center Slides
		 */	
		base.focalChange( 1 );
		base.resizeElements();
		
		if ( postLoad ) {

			/**
			 * Progressively Load Images
			 */
			var firstLoad = sldr.find( '.'+base.sldrLoadSlides.shift().class_name );
			var firstLoadCnt = 0;
			base.ajaxLoad( firstLoad , firstLoadCnt , 'shift' );

		} else {

			/**
			 * Activate Selectors
			 */
			if ( base.config.selectors != '' ) {
				base.config.selectors.eq( 0 ).addClass( base.config.focalClass );	
				base.config.selectors.click( function(e) {
					var th = $( this );
					var change  = base.focalChange( th.index() + 1 , 'selectors' );
					var animate = base.animate( change );
					th.siblings().removeClass( base.config.focalClass );
					th.addClass( base.config.focalClass );
					e.preventDefault();
				});

				if ( base.config.sldrAuto ) {
					base.config.selectors.bind( 'mouseenter' , function() {
						base.sliderPause();
					});
					base.config.selectors.bind( 'mouseleave' , function() {
						base.sliderTimer();
					});
				}
			}

			if ( base.config.nextSlide != '' ) {
				base.config.nextSlide.click( function(e) {
					if ( base.config.selectors != '' ) {
						base.config.selectors.removeClass( base.config.focalClass );
						base.config.selectors.eq( base.callback.nextSlideNum - 1 ).addClass( base.config.focalClass );	
					}	
					var change  = base.focalChange( base.callback.nextSlideNum , 'next' );
					var animate = base.animate( change );
				});

				if ( base.config.sldrAuto ) {
					base.config.nextSlide.bind( 'mouseenter' , function() {
						base.sliderPause();
					});
					base.config.nextSlide.bind( 'mouseleave' , function() {
						base.sliderTimer();
					});
				}
			}
			if ( base.config.previousSlide != '' ) {
				base.config.previousSlide.click( function(e) {
					if ( base.config.selectors != '' ) {
						base.config.selectors.removeClass( base.config.focalClass );
						base.config.selectors.eq( base.callback.prevSlideNum - 1 ).addClass( base.config.focalClass );
					}
					var change  = base.focalChange( base.callback.prevSlideNum , 'prev' );
					var animate = base.animate( change );
				});

				if ( base.config.sldrAuto ) {
					base.config.previousSlide.bind( 'mouseenter' , function() {
						base.sliderPause();
					});
					base.config.previousSlide.bind( 'mouseleave' , function() {
						base.sliderTimer();
					});
				}
			}

			if ( elmnts.length > 1 ) base.sliderTimer();

			/**
			 * Activate Resize
			 */
			$win.bind( 'resize' , function( e ) {  
				base.$resizeTimers[base.config.sldrNumber] = setTimeout( function() {
					base.sliderPause();
					//base.fillGaps( base.elmntsHTML ); // need to rework this to work with post load
					base.resizeElements();
					if ( elmnts.length > 1 ) base.sliderTimer();
				} , base.config.resizeDelay );
			});

			base.resizeElements();

			base.sliderLoaded( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
		}

		

    };

    /**
     * Recursive function to progressively load in slides based on http request time for the images
     * @param  {jquery object} elmnt       [description]
     * @param  {number}        nextLoadNum [next slide to load]
     * @param  {string}        method      ['shift' or 'pop' determines which slide to load in the array to pull from]
     * @return void
     */
    base.ajaxLoad = function( elmnt , nextLoadNum , method ) {

		var load     = elmnt.find( '.sldr-load' );
		var loadSrc  = load.attr( 'src' );
		var attrFind = [ 'class' , 'src' , 'alt' , 'width' , 'height' , 'data-src' ];
		var loadImg, slideLoad, nextLoad, nextLoadNum;
			var loadAttr = new Array();

		for ( var i=0; i < attrFind.length; i++ ) {
		    var thisAttr = ( load.attr( attrFind[i] ) ) ? load.attr( attrFind[i] ) : false;
		    if ( thisAttr ) loadAttr.push( attrFind[i] + "='" + thisAttr + "'" );
		}

		if ( !loadSrc ) return;

		load.replaceWith( '<img '+loadAttr.join(' ')+' >' );

		$.ajax({ 
			type          : 'GET',
			url           : loadSrc,
			async         : true,
        	cache         : true,
			success: function( data ) {
				
				loadImg = elmnt.find( 'img' );
				loadImg.removeClass( 'sldr-load' );
				
				base.slideLoaded( { 'slide' : base.sldrSlides[nextLoadNum] , 'callback' : base.callback , 'config' : base.config } );
				
				if ( method == 'shift' ) {
					slideLoad = base.sldrLoadSlides.shift();
					method = 'pop'; 
				} else if ( method == 'pop' ) {
					slideLoad = base.sldrLoadSlides.pop();
					method = 'shift';
				}
				
				base.config.sldrLoad++;

				if ( base.config.sldrLoad < base.sldrSlides.length ) {
					nextLoad    = base.$el.find( '.' + slideLoad.class_name );
					nextLoadNum = slideLoad.slideNum - 1;
					base.ajaxLoad( nextLoad , nextLoadNum , method );
				} else {
					base.init();
				}

			}, 
			error: function ( xhr, status ) {
				console.log( xhr );
				console.log( status );
			}
		});

    }
    
    /**
	  * change the focus of the slider and animate it
	  * @return void
	  */
	base.animate = function( change ) {
		try {
			if( base.config.animate != '' && base.config.animate )
			{
				base.config.animate( base.$el , change , { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
			} 
			else
			{
				if (!change) return;

				var wrp  = base.$el.children();
				var bwsr = base.config.isBrowser;
				var easing;

				// BEFORE ANIMATE
				wrp.removeClass( 'animate' );
				curr = parseFloat( wrp.css( 'margin-left' ) );
				wrp.css( 'margin-left' , curr + change.shiftWidth + 'px' );
				
				// ANIMATE
				base.$delayTimers[base.config.sliderNumber] = setTimeout( function() { 
					wrp.addClass( 'animate' );
					if ( base.config.animateJQ || bwsr == 'MSIE 6' || bwsr == 'MSIE 7' || bwsr == 'MSIE 8' || bwsr == 'MSIE 9' || base.config.animate != false ) {
						easing = ( $.easing && $.easing.easeInOutQuint ) ? 'easeInOutQuint' : 'linear';
						wrp.animate({
							marginLeft : base.config.offset - change.currentFocalPoint
						} , 750 , easing );
					} else {
						wrp.css( 'margin-left' , base.config.offset - change.currentFocalPoint );
					}
					base.slideComplete( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
				} , 1 ); // Tiny delay needed for slider to adjust

			}
		} catch ( err ) {
			console.log( err.message );
		}
	}

	/**
	 * change the focus of the slider without animating it
	 * @param  {jquery selector object} the slide object
	 * @param  {number} change [description]
	 * @return void
	 */
	base.positionFocus = function( change ) {
		try {

			if (!change) return;

			var wrp  = base.$el.children();
			var bwsr = base.config.isBrowser;

			// PREVENT ANIMATE
			wrp.removeClass( 'animate' );
			curr = parseFloat( wrp.css( 'margin-left' ) );
			wrp.css( 'margin-left' , base.config.offset - change.currentFocalPoint );

			// FOCUS
			base.$delayTimers[base.config.sliderNumber] = setTimeout( function() { 
				wrp.addClass( 'animate' );
				base.slideComplete( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
			} , base.config.resizeDelay + 1 ); // Tiny delay needed for slider to adjust

		} catch ( err ) {
			console.log( err.message );
		}
	}


	/**********************************************************
	 ****************** Positioning Functions *****************
	 **********************************************************/

	/**
	 * Function to move focal point of the slider to previous or next slide.
	 * @param  {string} method ['prev' or 'previous' moves the slider backwards. Defaults to next.]
	 * @return {object}        The callback of the slider including slide number, slide index, previous, next slides etc.
	 */
	base.focalChange = function( focalChangeNum , method ) {
		try {
			method = typeof method !== 'undefined' ? method : 'default';
			var wrp        = base.$el.children();
			var elmnts     = wrp.children();
			var focalElmnt = wrp.find( '> .'+base.config.focalClass );
			var focalIndex = focalElmnt.index();
			var nextFocalIndex, nextFocalPoint, prevFocalIndex, focalPoint, shiftSlide, shiftSlideClone, shiftSlideWidth, direction, slideClass;

			base.slideStart( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );

			/**
			 * Find the nearest index of the focal point we want.
			 * @type {integer}
			 */
			if ( !base.sldrSlides[ focalChangeNum - 1 ] ) return;
			slideClass = base.sldrSlides[ focalChangeNum - 1 ].class_name;
			slideClass = slideClass.split(' ');
			slideClass = slideClass[ 0 ];

			if ( focalElmnt.hasClass( slideClass ) ) return false;
			
			closerBehind  = elmnts.eq( focalIndex ).prevAll( '.' + slideClass + ':first' ).index();
			closerInFront = elmnts.eq( focalIndex ).nextAll( '.' + slideClass + ':first' ).index();

			if ( 
				closerInFront != -1 
				&& closerInFront - focalIndex < focalIndex - closerBehind 
				|| closerInFront - focalIndex == focalIndex - closerBehind 
				&& method != 'prev' 
			) {
				nextFocalIndex = closerInFront;
			} else if ( closerBehind != -1 ) {
				nextFocalIndex = closerBehind;
			} else {
				nextFocalIndex = $( '.' + slideClass ).index();
			}

			nextFocalPoint = elmnts.eq( nextFocalIndex );
			elmnts.removeClass( base.config.focalClass );
			nextFocalPoint.addClass( base.config.focalClass );
			
			/**
			 * Find the range of elments in the slider to cut and paste, making it symmetrical.
			 * @type {Object}
			 */
			direction   = ( nextFocalIndex > parseInt( ( elmnts.length - 1 ) / 2 ) ) ? 'next' : 'prev';
			sliceStart  = ( direction == 'prev' ) ? parseInt( ( ( elmnts.length - nextFocalIndex + 1 ) / 2 ) + nextFocalIndex + 2 ) : 0;
			sliceEnd    = ( direction == 'prev' ) ? elmnts.length : parseInt( nextFocalIndex * 0.5 ) - 1;
			elmntsSlice = elmnts.slice( sliceStart , sliceEnd );
			elmntsClone = elmntsSlice.clone();

			/**
			 * Find the width difference to shift the slider before animating.
			 * @type {Number}
			 */
			shiftSlideWidth = 0;
			for ( var i = 0; i < elmntsSlice.length; i++ ) {
				shiftSlideWidth = shiftSlideWidth + $( elmntsSlice[ i ] ).width();
			}
			shiftSlideWidth = ( direction == 'prev' ) ? -( shiftSlideWidth ) : shiftSlideWidth;

			/**
			 * Remove/Append/Prepend Slides back to slider.
			 */
			elmnts.slice( sliceStart , sliceEnd ).remove();
			if ( direction == 'prev' || direction == 'previous' ) {
				wrp.prepend( elmntsClone );
			} else {
				wrp.append( elmntsClone );
			}

			/**
			 * Update $.sldr.callback.
			 * @type {Object}
			 */
			focalPoint        = base.findFocalPoint();
			currentFocalIndex = wrp.find( '> .'+base.config.focalClass ).index();
			nextFocalIndex    = ( currentFocalIndex + 1 == elmnts.length ) ? 0 : currentFocalIndex + 1;
			prevFocalIndex    = ( currentFocalIndex - 1 == -1 ) ? elmnts.length - 1 : currentFocalIndex - 1;
			nextSlideNum      = ( focalChangeNum + 1 == base.sldrSlides.length + 1 ) ? 1 : focalChangeNum + 1;
			prevSlideNum      = ( focalChangeNum - 1 == 0 ) ? base.sldrSlides.length : focalChangeNum - 1;

			base.callback.sldr              = base.$el;
			base.callback.prevFocalIndex    = prevFocalIndex;
			base.callback.prevSlideNum      = prevSlideNum;
			base.callback.currentFocalIndex = currentFocalIndex;
			base.callback.currentClass      = nextFocalPoint.attr( 'class' );
			base.callback.currentID         = nextFocalPoint.attr( 'id' );
			base.callback.currentFocalPoint = focalPoint;
			base.callback.currentSlideNum   = focalChangeNum;
			base.callback.shiftWidth        = shiftSlideWidth;
			base.callback.nextFocalIndex    = nextFocalIndex;
			base.callback.nextSlideNum      = nextSlideNum;

			if ( base.config.toggle.length > 0 ) {
				base.config.toggle.removeClass( base.config.focalClass );
				base.config.toggle.eq( focalChangeNum - 1 ).addClass( base.config.focalClass );
			}

			return base.callback;

		} catch ( err ) {
			console.log( err.message );
		}
	}

	/**
	 * Recursive function to make slider fill the gaps of the stage
	 * @param  {object} elmntsHTML The markup to fill gaps with
	 * @param  {object} wrp        the container to place the markup in
	 * @return {boolean}           returns true when finished
	 */
	base.fillGaps = function( elmntsHTML ) {
		try {
			var sldrw     = base.$el.width();
			var wrp       = base.$el.children();
			var elmnt     = wrp.children();
			var elmntw    = base.findWidth( elmnt );
			var lastClass = base.sldrSlides[base.sldrSlides.length - 1].class_name;
			if ( elmntw < sldrw * 5 ) {

				wrp.find( '.' + lastClass ).after( elmntsHTML );

				//closerBehind  = elmnts.eq( focalIndex ).prevAll( '.' + slideClass + ':first' ).index();
				//closerInFront = elmnts.eq( focalIndex ).nextAll( '.' + slideClass + ':first' ).index();

				// if ( closerInFront != -1 && closerInFront - focalIndex < focalIndex - closerBehind ) {
				// 	nextFocalIndex = closerInFront;
				// } else if ( closerBehind != -1 ) {
				// 	nextFocalIndex = closerBehind;
				// } else {
				// 	nextFocalIndex = $( '.' + slideClass ).index();
				// }

				base.fillGaps( elmntsHTML );
			} else {
				wrp.css( 'width' , elmntw );
				return true;
			}
		} catch ( err ) {
			console.log( err.message );
		}
	}

	/**
	 * Find the width of a set of elements
	 * @return {float} the width of the entire set
	 */
	base.findWidth = function( elmnt ) {
		try {
			var wdth = 0;
			elmnt.each( function( i ) {
				wdth = wdth + $( elmnt[i] ).width();
			});
			return wdth;
		} catch ( err ) {
			console.log( err.message );
		}
	}

	/**
	 * Fid the focal point of the slider, determined
	 * by the class name 'focalPoint'
	 * @return {integer} the x position of the focal point
	 */
	base.findFocalPoint = function() {
		try {
			//sldr    = base.$el;
			var wrp             = base.$el.children();
			var elmnts          = wrp.children();
			var focalSlide      = base.$el.find( '.'+base.config.focalClass );
			var focalSlideWidth = focalSlide.width() / 2;
			var focalIndex      = focalSlide.index();
			var focalPoint      = focalSlideWidth;
			for ( var i = 0; i < focalIndex; i++ ) {
				focalPoint = focalPoint + elmnts.eq(i).width();
			}
			return focalPoint;
		} catch ( err ) {
			console.log( err.message );
		}
	}
	
	/**
	 * Actions to perform when the browser is resized. 
	 * Holds the responsive actions of the slider.
	 * @return void
	 */
	base.resizeElements = function() {
		try {
			var wrp      = base.$el.children();
			var elmnts   = wrp.children();
			
			if ( base.config.sldrWidth == 'responsive' ) {
				elmnts.css( 'width' , base.$el.width() );
			} else if ( base.config.sldrWidth != '' ) {
				elmnts.css( 'width' , base.config.sldrWidth );
			}

			base.config.offset = base.$el.width() / 2; // UPDATE THE OFFSET, need to change this to work on the config offset
			
			var change = { 
				'currentFocalIndex' : base.$el.find( '.'+base.config.focalClass ).index(),
				'currentFocalPoint' : base.findFocalPoint(),
				'shiftWidth'        : 0
			}
			
			base.positionFocus( change );

		} catch ( err ) {
			console.log( err.message );
		}
	};

	/**
	 * When the sldr is initiated, before the DOM is manipulated
	 * @param  {object} args [the slides, callback, and config of the slider]
	 * @return void
	 */
	base.sliderInit = function( args ) {
		if( base.config.sldrInit != '' )
		{
			base.config.sldrInit( args );
		}
	}

	/**
	 * When individual slides are loaded
	 * @param  {object} args [the slides, callback, and config of the slider]
	 * @return void
	 */
	base.slideLoaded = function( args ) {
		if( base.config.sldLoaded != '' )
		{
			base.config.sldLoaded( args );
		}
	}

	/**
	 * When the slider is loaded, after the DOM is manipulated
	 * @param  {object} args [the slides, callback, and config of the slider]
	 * @return void
	 */
	base.sliderLoaded = function( args ) {
		if( base.config.sldrLoaded != '' )
		{
			base.config.sldrLoaded( args );
		}
	}

	/**
	 * Before the slides animate
	 * @param  {object} args [the slides, callback, and config of the slider]
	 * @return void
	 */
	base.slideStart = function( args ) {
		if( base.config.sldrStart != '' )
		{
			base.config.sldrStart( args );
		}
	}

	/**
	 * When the slide has completed animating
	 * @param  {object} args [the slides, callback, and config of the slider]
	 * @return void
	 */
	base.slideComplete = function( args ) {
		if( base.config.sldrComplete != '' )
		{
			base.config.sldrComplete( args );
		}
	}

	// base.hashChange = function( args ) {
	// 	if( base.config.hashChange != '' )
	// 	{
	// 		base.config.hashChange( args );
	// 	}
	// }

	/**
	 * [sliderTimer description]
	 * @return void
	 */
	base.sliderTimer = function() {
		if ( base.config.sldrAuto ) {
			base.$sliderTimers[base.config.sldrNumber] = setTimeout( function() {

				var change  = base.focalChange( base.$el , base.callback.nextSlideNum , 'next' );
				var animate = base.animate( base.$el , change );
				base.sliderTimer( base.$el );

				if ( base.config.selectors != '' ) {
					var selector = base.config.selectors.eq( base.callback.nextSlideNum - 2 );
					selector.siblings().removeClass( base.config.focalClass );
					selector.addClass( base.config.focalClass );
				}

			} , base.config.sldrTime )
		}
	}

	/**
	 * [sliderPause description]
	 * @return void
	 */
	base.sliderPause = function() {
		if ( base.config.sldrAuto ) {
			clearTimeout( base.$sliderTimers[base.config.sldrNumber] );
		}
	}

	/**
	 * [evenNumber description]
	 * @param  {[type]} num [description]
	 * @return void
	 */
	base.evenNumber = function( num ) {
		return ( num % 2 == 0 ) ? true : false;
	}

	/**
	 * [browser description]
	 * @return {[type]} [description]
	 */
	base.browser = function() {
		if( navigator.userAgent.match('WebKit') != null ) {
			base.config.isBrowser = 'Webkit';
		} else if( navigator.userAgent.match('Gecko') != null ) {
			base.config.isBrowser = 'Gecko';
		} else if( navigator.userAgent.match('MSIE 6') != null ) {
			base.config.isBrowser = 'MSIE 6';
			base.config.isIE = true;
		} else if( navigator.userAgent.match('MSIE 7') != null ) {
			base.config.isBrowser = 'MSIE 7';
			base.config.isIE = true;
		} else if( navigator.userAgent.match('MSIE 8') != null ) {
			base.config.isBrowser = 'MSIE 8';
			base.config.isIE = true;
		} else if( navigator.userAgent.match('MSIE 9') != null ) {
			base.config.isBrowser = 'MSIE 9';
			base.config.isIE = true;
		}
	}
    
    base.init();
  };
  
  /**
   * [defaultOptions description]
   * @type {Object}
   */
  $.sldr.defaultOptions = {
    focalClass    : 'focalPoint',
	offset        : $(this).width() / 2,
	selectors     : '',
	toggle        : '',
	nextSlide     : '',
	hashChange    : false,
	previousSlide : '',
	resizeDelay   : 1,
	sldrNumber    : 0,
	sldrStart     : '',
	sldrComplete  : '',
	sldrInit      : '',
	sldLoaded     : '',
	sldrLoaded    : '',
	sldrWidth     : '',
	animate       : '',
	animateJQ     : false,
	sldrAuto      : false, 
	sldrTime      : 8000,
	isBrowser     : navigator.userAgent,
	isIE   		  : false
  };
  
  /**
   * [sldr description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  $.fn.sldr = function( options ) {
    return this.each( function() {
      ( new $.sldr( this , options ) );
      $.sldr.defaultOptions.sldrNumber++;
    });
  };
  
})( jQuery );