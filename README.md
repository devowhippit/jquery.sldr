jquery.sldr
====

Design Features

<ol>
	<li>Multiple slide width.</li>
	<li>Visible stage.</li>
	<li>Responsive height and width.</li>
</ol>

<p><a href="http://devowhippit.github.io/jquery.sldr/">The demo</a>.</p>

====


Dev Features:

<ol>
	<li>Support for IE 7+, Chrome, Safari, Firefox, IOS 3+, Android 3+. Not tested in Opera or older versions of Chrome, Safari, Firefox.</li>
	<li>Callbacks on initialization, slide start, slide complete.</li>
	<li>Next, previous, pagination, and element toggle selector definitions.</li>
	<li>¡To do! Animation Hook. Define your own animation.</li>
</ol>


====


To do:

<ol>
	<li>Make base.resizeElements work with offset option.</li>
	<li>Responsive Height Option. By default, the slider's height is responsive if the using 100% width block images. May include function however to set the style of the slider's width.</li>
	<li>Rework base.fillGaps to work with post loaded images. </li>
	<li>Establish method for passing updated args on to callback functions if using the Animation Hook.</li>	
	<li>A shadow box mode.</li>
	<li>Click Drag/Swipe pagination for mobile.</li>
</ol>

====


Settings:

<table>
<tr><td><strong>focalClass    </strong></td><td>The classname of the focal point of the slider (or 'active' slide). Defaults to 'focalPoint'.</td></tr>
<tr><td><strong>offset        </strong></td><td>¡To do! The center point of the slider. Defaults to "$(this).width() / 2" (or center of the slider).</td></tr>
<tr><td><strong>selectors     </strong></td><td>Selectors for the paginating elements. Example "$('ul > li')". No Default.</td></tr>
<tr><td><strong>toggle        </strong></td><td>A series of elements to toggle the focalClass of. Can be used to show/hide captions. Example "$('.descriptions > div'')" No Default.</td></tr>
<tr><td><strong>nextSlide     </strong></td><td>Selector for the next slide. No Default.</td></tr>
<tr><td><strong>previousSlide </strong></td><td>Selector for the previous slide. No Default.</td></tr>
<tr><td><strong>hashChange    </strong></td><td>Optional boolean that gets passed through the callback args. Defaults to false.</td></tr>
<tr><td><strong>resizeDelay   </strong></td><td>Delay for the window resize. Defaults to 1.</td></tr>
<tr><td><strong>sldrNumber    </strong></td><td>Number of slides that increases when the sldr is initiated. Defaults to 0.</td></tr>
<tr><td><strong>sldrInit      </strong></td><td>Callback. Accepts function name. When the sldr is initiated, before the DOM is manipulated. No Default.</td></tr>
<tr><td><strong>sldLoaded     </strong></td><td>Callback. Accepts function name. When individual slides are loaded. No Default.</td></tr>
<tr><td><strong>sldrLoaded    </strong></td><td>Callback. Accepts function name. When the full slider is loaded, after the DOM is manipulated. No Default.</td></tr>
<tr><td><strong>sldrStart     </strong></td><td>Callback. Accepts function name. Before the slides change focal points. No Default.</td></tr>
<tr><td><strong>sldrComplete  </strong></td><td>Callback. Accepts function name. After the slides are done changing focal points. No Default.</td></tr>
<tr><td><strong>sldrWidth     </strong></td><td>The width of the slider. Set to 'responsive' for full width slides. Set to number for fixed width. Defaults to the width of the slider.</td></tr>
<tr><td><strong>animate       </strong></td><td>¡To do! Hook for custom animation. Accepts function name. Defaults to "base.animate" in jquery.sldr.js.</td></tr>
<tr><td><strong>animateJQ     </strong></td><td>Force default animation to jquery animate(). Defaults to false using CSS transitions. Browsers that do not support CSS transitions use jquery animate().</td></tr>
<tr><td><strong>sldrAuto      </strong></td><td>Auto timer for transition. Defaults to false.</td></tr> 
<tr><td><strong>sldrTime      </strong></td><td>Auto timer time transition time. Defaults to 8000.</td></tr>
<tr><td><strong>isBrowser     </strong></td><td>Variable for setting browser. Defaults to the navigator.userAgent.</td></tr>
<tr><td><strong>isIE   		  </strong></td><td>Variable for Internet Explorer. Defaults to false. Will be set to true based on navigator.userAgent.</td></tr>
</table>