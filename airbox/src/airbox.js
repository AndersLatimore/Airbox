/******************************************************
* Airbox – lightweight, airy jQuery lightbox
* Version 0.1.0 – https://github.com/AndyAkesson/airbox
*
* Copyright 2013, Anders Akesson
* Massachusetts Institute of Technology Licensed.
* Use as you please.
*******************************************************/
(function($){
	"use strict";
	/**
	 * ab contains all deafults that the functionality requires;
	 * namespace, context, select, targetAttr, openTrigger, closeTrigger, resetCss.
	 */
	var ab = {
		defaults: {  
			namespace:    'airbox',         //Name of the events and css class prefix.
			context:      'body',           //Context used to search for the lightbox content and triggers. 
			select:       '[data-airbox]',  //Elements that trigger the lightbox.
			targetAttr:   'data-airbox',    //Attribute of the triggered element that contains the select to the content.
			openTrigger:  'click',          //Triggers the lightbox.
			closeTrigger: 'click',          //Triggers the closing of the lightbox.
			resetCss:     false,            //Reset css.
			open: function(event){          
				$.proxy($.airbox.methods.open, this, event)();
			},
			close: function(event){                   
				$.proxy($.airbox.methods.close, this, event)();
			}
		},
		methods: { 
			/**
			 * Setup everything in the setup function.
			 * Access and override all methods using $.ab.methods.
			 * @param  config  Configuration for the setup.
			 * @param  content What is coming into the function.
			 */
			setup: function(config, content){
				var $elm = $(this) || $(),
					config = $.extend({}, ab.defaults, config),
					//Reset all the default css
					css = !config.resetCss ? config.namespace : config.namespace+'-reset',
					$background = $('<div class="'+css+'"><div class="'+css+'-content"><span class="'+css+'-close"></span></div></div>'),
					//Everything stored in self
					self = {
						config: config,
						content: content,
						$elm: $elm,
						$instance: $background.clone()
					};
					//Close when click on background 
					self.$instance.on(config.closeTrigger + '.' + config.namespace, $.proxy(config.close, self));
					//Bind or call open function 
					if($elm.length > 0 && this.tagName){
						$elm.on(config.openTrigger + '.' + config.namespace, $.proxy(config.open, self));
					} 
					else {
						$.proxy(config.open, self)();
					}
				},

			/**
			 * Prepares the content and converts it into a jQuery object.
			 */
			getContent: function(){
				var self = this,
					content = self.content,
					attr = self.$elm.attr(self.config.targetAttr);
				//Convert to jQuery object if it's a DOM object. 
				if(typeof content === 'string'){
					self.content = $(content);
				} 
				else if(content instanceof $ === false){ //If we have no jQuery Object.
					//Check if we have an image and create element.
					if(attr === 'image' || attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i)){
						var url = attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i) ? attr : self.$elm.attr('href');
						self.content = $('<img src="'+url+'" alt="" class="'+self.config.namespace+'-image" />');
					}
				//Else, create jquery element by using the attribute as select.
				else {
					self.content = $($(attr), self.config.context);
				}
			}
				self.content.addClass(self.config.namespace+'-inner');
			},

			/**
			 * Opens the lightbox.
			 * "this" contains $instance with the lightbox, and with the config.
			 * @param  event The event triggered
			 */
			open: function(event){
				if(event){
					event.preventDefault();
				}
				var self = this;
				// If we have content, add it and show the lightbox 
				if($.proxy(ab.methods.getContent, self)() !== false){
					$(document).bind('keyup.'+self.config.namespace, function(e) {
						if (e.keyCode == 27) { //27 is esc keycode
							self.$instance.find('.'+self.config.namespace+'-close').click();
						}
					});	
				self.$instance
					.prependTo('body').fadeIn(2500)
					.find('.'+self.config.namespace+'-close')
					.after(self.content);
				}
			},

			/**
			 * Closes the lightbox.
			 * "this" contains $instance with the lightbox, and the config.
			 * @param  event The event triggered.
			 */
			close: function(event){
				if(event){event.preventDefault();}
				var self = this,
					config = self.config,
					$instance = $(event.target);
				if(($instance.is('.'+config.namespace)) || $instance.is('.'+config.namespace+'-close') ){
					$(document).unbind('keyup.'+self.config.namespace);

					self.$instance.fadeOut(function(){
						self.$instance.detach();
					});
				}
			}
		}
	};

	/**
	 * Extension of jQuery with a standalone airbox method.
	 * @param  $content Content coming in to the function.
	 * @param  config   Configurations
	 */
	$.airbox = function($content, config) {
		$.proxy(ab.methods.setup, null, config, $content)();
	};

	/**
	 * Extension of jQuery with select.
	 * @param  config   Configurations.
	 * @param  $content Content coming in to function.
	 */
	$.prototype.airbox = function(config, $content) {
		$(this).each(function(){
			$.proxy(ab.methods.setup, this, config, $content)();
		});
	};

	//Extension of airbox with defaults and methods.
	$.extend($.airbox, ab);

	/**
	 * Bind airbox on document.ready
	 */
	$(document).ready(function(){
		var config = $.airbox.defaults;
		$(config.select, config.context).airbox();
	});
 
}(jQuery));
