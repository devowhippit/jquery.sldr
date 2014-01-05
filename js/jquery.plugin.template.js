// Script by Chris Johnson 
// http://chrisltd.com
// Created December 2013
//
// Usage:
// $("#element").yourPluginName("20px");

(function($){
  $.yourPluginName = function(el, radius, options){
    // To avoid scope issues, use 'base' instead of 'this' to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    // Add a reverse reference to the DOM object
    base.$el.data("yourPluginName", base);
    
    base.init = function(){
      if( typeof( radius ) === "undefined" || radius === null ) radius = "20px";
      
      base.radius = radius;
      
      base.options = $.extend({},$.yourPluginName.defaultOptions, options);
      
      // Put your initialization code here
    };
    
    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    // 
    // };
    
    // Run initializer
    base.init();
  };
  
  $.yourPluginName.defaultOptions = {
    radius: "20px"
  };
  
  $.fn.yourPluginName = function(radius, options){
    return this.each(function(){
      (new $.yourPluginName(this, radius, options));
       // HAVE YOUR PLUGIN DO STUFF HERE
    });
  };
  
})(jQuery);