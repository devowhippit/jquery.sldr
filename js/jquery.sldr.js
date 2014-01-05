/*
 * sldr
 * 
 * {Description} sldr, the "Fuck-your-slider" slider.
 * 
 * Copyright (c) 2013 Devon Hirth
 * 
 * Version: 0.1
 * Minimum requirements: Developed with jQuery 1.10.2, May work with older versions.
 *
 * {Terms of use}
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */


( function( $ ) {

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
    var $win        = $( window );
    base.callback   = new Array();
    base.sldrSlides = new Array();

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	base.init = function() {
		try {

			base.config = $.extend( {} , $.sldr.defaultOptions , options );

			//console.log( base );

			var sldr       = base.$el;
			var wrp        = sldr.children();
			var elmnts     = wrp.children();
			var elmntsHTML = wrp.html();
			var sldrnav    = $( '.sldr-nav' );

			/**
			 * Do not finishi initiating plugin if there is only one slide.
			 */
			if ( elmnts.length <= 1 ) {
				elmnts.eq( 0 ).addClass( base.config.focalClass ) 
				return; 
			}

			/**
			 * Build Slide Array
			 * @type {Number}
			 */
			for ( var i = 1; i < elmnts.length + 1; i++ ) {
				var slide = elmnts.eq( i - 1 );
				base.sldrSlides.push({
					'slideNum'   : i,
					'id'         : slide.attr( 'id' ),
					'class_name' : slide.attr( 'class' ),  // 'class' is reserved var in javascript, throws errors in IE changed to 'class_name'
					'html'       : slide.html()
				});
			}

			/**
			 * Set Initial Focal Point
			 */
			var firstClass = elmnts.eq( 0 ).attr( 'class' );
			elmnts.eq( 0 ).addClass( 'first' );
			elmnts.eq( elmnts.length - 1 ).addClass( 'last' );

			/**
			 * Fill Gaps (if any)
			 */
			base.fillGaps( sldr , elmntsHTML );

			/**
			 * Center Slides
			 */				
			var change  = base.focalChange( sldr , 1 );
			if ( base.config.selectors != '' ) {
				base.config.selectors.eq( 0 ).addClass( base.config.focalClass );	
			}

			base.resizeElementss( sldr );

			if ( base.config.selectors != '' ) {
				base.config.selectors.click( function(e) {
					var th = $( this );
					var change  = base.focalChange( sldr , th.index() + 1 );
					var animate = base.animate( sldr , change );
					console.log( change );
					th.siblings().removeClass( base.config.focalClass );
					th.addClass( base.config.focalClass );
					e.preventDefault();
				});
			}

			if ( base.config.nextSlide != '' ) {
				base.config.nextSlide.click( function(e) {
					if ( base.config.selectors != '' ) {
						base.config.selectors.removeClass( base.config.focalClass );
						base.config.selectors.eq( base.callback.nextSlideNum - 1 ).addClass( base.config.focalClass );	
					}	
					var change  = base.focalChange( sldr , base.callback.nextSlideNum );
					var animate = base.animate( sldr ,change );
				});
			}

			if ( base.config.previousSlide != '' ) {

				base.config.previousSlide.click( function(e) {
					if ( base.config.selectors != '' ) {
						base.config.selectors.removeClass( base.config.focalClass );
						base.config.selectors.eq( base.callback.prevSlideNum - 1 ).addClass( base.config.focalClass );
					}
					var change  = base.focalChange( sldr , base.callback.prevSlideNum );
					var animate = base.animate( sldr , change );
				});
			}

			$win.bind( 'resize' , function( e ) {   
				resizeTim = setTimeout( function() {
					base.fillGaps( sldr , elmntsHTML );
					base.resizeElementss( sldr );
					clearTimeout( resizeTim );
				} , 500 );
			});

			base.slideInit( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );

		} catch ( err ) {
			console.log( err.message );
		}

    };
    
    /**
	  * [animate description]
	  * @return {[type]} [description]
	  */
	base.animate = function( sldr , change ) {
		try {
			if( base.config.animate != '' )
			{
				base.config.animate( sldr , change , { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );
			} 
			else
			{
				if (!change) return;

				var wrp  = sldr.children();

				// BEFORE ANIMATE
				wrp.removeClass( 'animate' );
				curr = parseFloat( wrp.css( 'margin-left' ) );
				wrp.css( 'margin-left' , curr + change.shiftWidth + 'px' );
				
				// ANIMATE
				setTimeout( function(){ 
					wrp.addClass( 'animate' );
					wrp.css( 'margin-left' , base.config.offset - change.currentFocalPoint );

					base.slideComplete( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );

				} , 1 );
			}
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
	 * @return {[type]}        [description]
	 */
	base.focalChange = function( sldr , method ) {
		try {
			//var sldr       = $( this );
			var wrp        = sldr.children();
			var elmnts     = wrp.children();
			var focalElmnt = wrp.find( '> .'+base.config.focalClass );
			var focalIndex = focalElmnt.index();
			var nextFocalIndex, nextFocalPoint, prevFocalIndex, focalPoint, 
			shiftSlide, shiftSlideClone, shiftSlideWidth, direction;

			base.slideStart( { 'slides' : base.sldrSlides , 'callback' : base.callback , 'config' : base.config } );

			/**
			 * Find the nearest index of the focal point we want.
			 * @type {integer}
			 */

			slideClass = base.sldrSlides[ method - 1 ].class_name; // 'class' is reserved var in javascript, throws errors in IE changed to 'class_name'
			slideClass = slideClass.split(' ');
			slideClass = slideClass[ 0 ];

			//console.log( slideClass );
			//console.log( focalElmnt );

			if ( focalElmnt.hasClass( slideClass ) ) return false;
			
			closerBehind  = elmnts.eq( focalIndex ).prevAll( '.' + slideClass + ':first' ).index();
			closerInFront = elmnts.eq( focalIndex ).nextAll( '.' + slideClass + ':first' ).index();

			if ( closerInFront != -1 && closerInFront - focalIndex < focalIndex - closerBehind ) {
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
			 * Find the range of elments in the slider to cut and paste, making it symmetric.
			 * @type {Object}
			 */
			direction   = ( nextFocalIndex > parseInt( ( elmnts.length - 1 ) / 2 ) ) ? 'next' : 'prev';
			sliceStart  = ( direction == 'prev' ) ? parseInt( ( ( elmnts.length - nextFocalIndex + 1 ) / 2 ) + nextFocalIndex + 2 ) : 0;
			sliceEnd    = ( direction == 'prev' ) ? elmnts.length : parseInt( nextFocalIndex * 0.5 ) - 1;
			elmntsSlice = elmnts.slice( sliceStart , sliceEnd );
			elmntsClone = elmntsSlice.clone()

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
			nextSlideNum      = ( method + 1 == base.sldrSlides.length + 1 ) ? 1 : method + 1;
			prevSlideNum      = ( method - 1 == 0 ) ? base.sldrSlides.length : method - 1;
			base.callback = { 
				'sldr'              : base.$el,
				'prevFocalIndex'    : prevFocalIndex,
				'prevSlideNum'      : prevSlideNum,
				'currentFocalIndex' : currentFocalIndex,
				'currentClass'      : nextFocalPoint.attr( 'class' ),
				'currentID'         : nextFocalPoint.attr( 'id' ),
				'currentFocalPoint' : focalPoint,
				'currentSlideNum'   : method,
				'shiftWidth'        : shiftSlideWidth,
				'nextFocalIndex'    : nextFocalIndex,
				'nextSlideNum'      : nextSlideNum
			}

			if ( base.config.toggle.length > 0 ) {
				base.config.toggle.removeClass( base.config.focalClass );
				base.config.toggle.eq( method - 1 ).addClass( base.config.focalClass );
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
	base.fillGaps = function( sldr , elmntsHTML ) {
		try {
			//var sldr     = $( this );
			var sldrw    = sldr.width();
			var wrp      = sldr.children();
			var elmnt    = wrp.children();
			var elmntw   = base.findWidth( elmnt );
			if ( elmntw < sldrw * 5 ) {
				sldr.find( '.last' ).after( elmntsHTML );
				base.fillGaps( sldr , elmntsHTML );
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
				wdth = wdth + elmnt.width();
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
			sldr    = base.$el;
			wrp     = sldr.children();
			elmnts  = wrp.children();
			fclsld  = sldr.find( '.'+base.config.focalClass );
			fclsldw = fclsld.width() / 2;
			fclindx = fclsld.index();
			fclpnt  = fclsldw;
			for ( var i = 0; i < fclindx; i++ ) {
				fclpnt = fclpnt + elmnts.eq(i).width();
			}
			return fclpnt;
		} catch ( err ) {
			console.log( err.message );
		}
	}
	
	/**
	 * [resizeElementss description]
	 * @return {[type]} [description]
	 */
	base.resizeElementss = function( sldr ) {
		try {
			//var sldr = base.$el;
			wrp      = sldr.children();
			elmnts   = wrp.children();
			if ( base.config.sldWidth != '' ) { elmnts.css( 'width' , sldr.width() ); }
			base.config.offset = sldr.width() / 2; // UPDATE THE OFFSET
			var change = { 
				'currentFocalIndex' : sldr.find( '.'+base.config.focalClass ).index(),
				'currentFocalPoint' : base.findFocalPoint(),
				'shiftWidth'        : 0
			}
			base.animate( sldr , change );
		} catch ( err ) {
			console.log( err.message );
		}
	};

	base.slideInit = function( args ) {
		if( base.config.sldInit != '' )
		{
			base.config.sldInit( args );
		}
	}

	base.slideStart = function( args ) {
		if( base.config.sldStart != '' )
		{
			base.config.sldStart( args );
		}
	}

	base.slideComplete = function( args ) {
		if( base.config.sldComplete != '' )
		{
			base.config.sldComplete( args );
		}
	}

	base.evenNumber = function( num ) {
		return ( num % 2 == 0 ) ? true : false;
	}
    
    base.init();
  };
  
  $.sldr.defaultOptions = {
    focalClass    : 'focalPoint',
	offset        : $(this).width() / 2,
	selectors     : '',
	toggle        : '',
	nextSlide     : $(this).nextAll( '.sldr-nav.next:first' ),
	previousSlide : $(this).nextAll( '.sldr-nav.prev:first' ),
	sldStart      : '',
	sldComplete   : '',
	sldInit       : '',
	sldWidth      : '',
	animate       : ''
  };
  
  $.fn.sldr = function( options ) {
    return this.each( function() {
      ( new $.sldr( this , options ) );
    });
  };
  
})( jQuery );