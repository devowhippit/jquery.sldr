jquery.sldr
====

updates
====
v1.1 : added touchswipe, hardware accelerated animation, optimized positioning function to remove glitch in IOS, removed redundant DOM selectors, modified responsive function to update wrapper width on resize

features (<a href="http://devowhippit.github.io/jquery.sldr/">the demo</a>)
====

<ol>
	<li><a href="#settings">Settings</a>. Flexible setup. Next, previous, pagination, and element toggle selector definitions.</li>
	<li><a href="#example-setup">Setup</a>. Multiple slide width, visible stage, and fully responsive. </li>
	<li><a href="#callbacks">Callbacks</a>. Callbacks on initialization, individual slide load (via <a href="#post-load">post load</a>), slide start, slide complete.</li>
	<li><a href="#post-load">Post Load</a>. Post image load feature. Progressively loads images after the page is loaded.</li>
	<li>¡To do! Animation Hook. Define your own animation.</li>
	<li>Support for IE 7+, Chrome, Safari, Firefox, IOS 3+, Android 3+. Not tested in Opera or older versions of Chrome, Safari, Firefox. Easing supported with jquery.easing.1.3.js.</li>
</ol>


to do
====

<ol>
	<li>Make base.resizeElements work with offset option.</li>
	<li>Responsive Height Option. By default, the slider's height is responsive if the using 100% width block images. May include function however to set the style of the slider's height.</li>
	<li>Rework base.fillGaps to work with post loaded images. </li>
	<li>Establish method for passing updated args on to callback functions if using the Animation Hook.</li>
	<li>A shadow box mode.</li>
</ol>


settings
====

<table>
<tr><td><strong>focalClass</strong></td><td>The classname of the focal point of the slider (or 'active' slide). Defaults to 'focalPoint'.</td></tr>
<tr><td><strong>offset</strong></td><td>¡To do! The center point of the slider. Defaults to "$(this).width() / 2" (or center of the slider).</td></tr>
<tr><td><strong>selectors</strong></td><td>Selectors for the paginating elements. Example "$('ul > li')". No Default.</td></tr>
<tr><td><strong>toggle</strong></td><td>A series of elements to toggle the focalClass of. Can be used to show/hide captions. Example "$('.descriptions > div'')" No Default.</td></tr>
<tr><td><strong>nextSlide</strong></td><td>Selector for the next slide. No Default.</td></tr>
<tr><td><strong>previousSlide </strong></td><td>Selector for the previous slide. No Default.</td></tr>
<tr><td><strong>hashChange</strong></td><td>Optional boolean that gets passed through the callback args. Defaults to false.</td></tr>
<tr><td><strong>resizeDelay</strong></td><td>Delay for the window resize. Defaults to 1.</td></tr>
<tr><td><strong>sldrNumber</strong></td><td>Number of slides that increases when the sldr is initiated. Defaults to 0.</td></tr>
<tr><td><strong>sldrInit</strong></td><td>Callback. Accepts function name. When the sldr is initiated, before the DOM is manipulated. No Default.</td></tr>
<tr><td><strong>sldLoaded</strong></td><td>Callback. Accepts function name. When individual slides are loaded. No Default.</td></tr>
<tr><td><strong>sldrLoaded</strong></td><td>Callback. Accepts function name. When the full slider is loaded, after the DOM is manipulated. No Default.</td></tr>
<tr><td><strong>sldrStart</strong></td><td>Callback. Accepts function name. Before the slides change focal points. No Default.</td></tr>
<tr><td><strong>sldrComplete</strong></td><td>Callback. Accepts function name. After the slides are done changing focal points. No Default.</td></tr>
<tr><td><strong>sldrWidth</strong></td><td>The width of the slider. Set to 'responsive' for full width slides. Set to number for fixed width. Defaults to the width of the slider.</td></tr>
<tr><td><strong>animate</strong></td><td>¡To do! Hook for custom animation. Accepts function name. Defaults to "base.animate" in jquery.sldr.js.</td></tr>
<tr><td><strong>animateJquery</strong></td><td>Force default animation to jquery animate(). Defaults to false using CSS transitions. Browsers that do not support CSS transitions use jquery animate().</td></tr>
<tr><td><strong>sldrAuto</strong></td><td>Auto timer for transition. Defaults to false.</td></tr> 
<tr><td><strong>sldrTime</strong></td><td>Auto timer time transition time. Defaults to 8000.</td></tr>
<tr><td><strong>isBrowser</strong></td><td>Variable for setting browser. Defaults to the navigator.userAgent.</td></tr>
<tr><td><strong>isIE</strong></td><td>Variable for Internet Explorer. Defaults to false. Will be set to true based on navigator.userAgent.</td></tr>
</table>


example setup
====

<strong>Markup:</strong>

Each slide element requires at least one unique class that must appear first in the attribute value.

```html
<div id="SLDR-ONE" class="sldr">
	<ul class="wrp animate">
		<li class="elmnt-one"><img src="img/Lake.jpg" width="1000" height="563"></li>
		<li class="elmnt-two"><img src="img/Mountain-Range.jpg" width="1000" height="563"></li>
		<li class="elmnt-three"><img src="img/Mt-Fuji.jpg" width="1000" height="563"></li>
		<li class="elmnt-four"><img src="img/Pink-Forest.jpg" width="1000" height="563"></li>
	</ul>
</div>
```

<strong>CSS:</strong>

This CSS uses positioning to move the slide from left to right but alternate styling can be used to create different types of transitions.

```html
.sldr {
	max-width: 825px;
	margin: 0 auto;
	overflow: visible;
	position: relative;
	clear: both;
	display: block;
}

.sldr > ul.animate {
	-webkit-transition: margin 0.75s cubic-bezier(0.860, 0.000, 0.070, 1.000); 
       -moz-transition: margin 0.75s cubic-bezier(0.860, 0.000, 0.070, 1.000); 
         -o-transition: margin 0.75s cubic-bezier(0.860, 0.000, 0.070, 1.000); 
            transition: margin 0.75s cubic-bezier(0.860, 0.000, 0.070, 1.000); /* ease-in-out */	
}
	
.sldr > ul > li {
	float: left;
	display: block;
	width: 825px;
}
```


<strong>jQuery:</strong>

```html
$( window ).load( function() {

	$( '.sldr' ).each( function() {
		var th = $( this );
		th.sldr({
			focalClass    : 'focalPoint',
			offset        : th.width() / 2,
			sldrWidth     : 'responsive',
			nextSlide     : th.nextAll( '.sldr-nav.next:first' ),
			previousSlide : th.nextAll( '.sldr-nav.prev:first' ),
			selectors     : th.nextAll( '.selectors:first' ).find( 'li' ),
			toggle        : th.nextAll( '.captions:first' ).find( 'div' ),
			sldrInit      : sldrInit,
			sldrStart     : sldrStart,
			sldrComplete  : sldrComplete,
			sldrLoaded    : sldrLoaded,
			sldrAuto      : true,
			sldrTime      : 2000,
			hasChange     : true
		});
	});

});
```


callbacks
====

```html
/**
 * When the sldr is initiated, before the DOM is manipulated
 * @param {object} args the slides, callback, and config of the slider
 * @return null
 **/
function sldrInt( args ) { }

/**
 * When individual slides are loaded
 * @param {object} args the slides, callback, and config of the slider
 * @return null
 **/
function sldLoaded( args ) { }

/**
 * When the full slider is loaded, after the DOM is manipulated
 * @param {object} args the slides, callback, and config of the slider
 * @return null
 **/
function sldrLoaded( args ) { }

/**
 * Before the slides change focal points
 * @param {object} args the slides, callback, and config of the slider
 * @return null
 **/
function sldrStart( args ) { }

/**
 * After the slides are done changing focal points
 * @param {object} args the slides, callback, and config of the slider
 * @return null
 **/
function sldrComplete( args ) { }
```


callback arguments
====

Slides return an object of the following items;

```html
{ 
	'slides' : { 
		(array of slides) 
	}, 
	'callback' : {
		(the previous, current, next slide variables)
	}, 
	'config' : {
		(all of the original settings described above) 
}
```

<strong>Slides:</strong>

<table>
<tr><td><strong>sld</strong></td><td>Slide jQuery object.</td></tr> 
<tr><td><strong>slideNum</strong></td><td>Slide number.</td></tr> 
<tr><td><strong>id</strong></td><td>Slide id.</td></tr> 
<tr><td><strong>class_name</strong></td><td>Slide class.</td></tr> 
<tr><td><strong>html</strong></td><td>Slide inner html()</td></tr> 
</table>

<strong>Callback:</strong>

<table>
<tr><td><strong>sldr</strong></td><td>jQuery object of the slider.</td></tr> 
<tr><td><strong>prevFocalIndex</strong></td><td>The index() of the previous slide.</td></tr> 
<tr><td><strong>prevSlideNum</strong></td><td>The slide number of the previous slide.</td></tr> 
<tr><td><strong>currentFocalIndex</strong></td><td>The index() of the current slide.</td></tr> 
<tr><td><strong>currentClass</strong></td><td>The class of the current slide.</td></tr> 
<tr><td><strong>currentID</strong></td><td>The id of the current slide</td></tr> 
<tr><td><strong>currentFocalPoint</strong></td><td>The pixel distance from the left of the slide group to the center.</td></tr> 
<tr><td><strong>currentSlideNum</strong></td><td>The slide number of the current slide</td></tr> 
<tr><td><strong>shiftWidth</strong></td><td>The amount of change from one slide to the next.</td></tr> 
<tr><td><strong>nextFocalIndex</strong></td><td>The index() of the next slide.</td></tr> 
<tr><td><strong>nextSlideNum</strong></td><td>The slide number of the next slide.</td></tr> 
</table>


post load
====

The post load image feature can progressively load images one by one after the page has finishied loading any non-slider images, scripts, etc. To take advantage of it only the markup needs to be changed. Replace images with a markup element with a class of 'sldr-load'. When the plugin sees these elements it will grab the attributes 'class' , 'src' , 'alt' , 'title' , 'width' or 'height' and apply them to the image when it's ready. Below is the sample markup;


```html
<div id="SLDR-ONE" class="sldr">
	<ul class="wrp animate">
		<li class="elmnt-one"><div class="sldr-load" src="img/Lake.jpg" width="1000" height="563"></div></li>
		<li class="elmnt-two"><div class="sldr-load" src="img/Mountain-Range.jpg" width="1000" height="563"></div></li>
		<li class="elmnt-three"><div class="sldr-load" src="img/Mt-Fuji.jpg" width="1000" height="563"></div></li>
		<li class="elmnt-four"><div class="sldr-load" src="img/Pink-Forest.jpg" width="1000" height="563"></div></li>
	</ul>
</div>
```