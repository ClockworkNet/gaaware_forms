/* gaAware Forms
// 
	Allows you to trigger a gaaware custom event whenever a form is submitted

	Requirements 
		GA Aware - http://gaaware.com/

	Usage

	!!!! CAREFUL !!!!
		This submits user data to google analytics. Be very careful you are not sending
		credit card, passwords, or other sensitive data. 

	CWjQuery('#form_id').gaaware_forms(  {category: 'Event Category', fields: { 'selector' : {
			label : 'Event Label'
		},
		'#c_74_question_3' :
		{
			label : 'Event Label',
			category : 'Event Category, overrides plugin level category'
		}
	} } );

	Category defaults to gaaware_forms for all events. 

	You must pass a label, the action of the event will be the value of the input 
	at the time the form is submitted. 

	No validation occurs on the input. 



*/ 
(function ($) {

	"use strict";

	// These locally scoped variables help minification by aliasing strings
	var data_key               =  'CW_gaaware_forms-options',
		event_suffix           =  '.CW_gaaware_forms',
	// Custom events
		component_initialized  =  'component_initialized' + event_suffix,
		component_error        =  'component_error'       + event_suffix,
		change                 =  'change'                + event_suffix;

	var methods  =  {

		init  :  function (settings) {

			var $el  =  $(this),
				options  =  $.extend({
					category         :  'gaaware_forms',
					fields           :  {}
				}, settings);
			if(cwGA === undefined ) {
				return false;
			}
			$el.data(data_key, options);
			$el.gaaware_forms('main');

			return this;
		},

		_setup_form : function (element) {
			var	$el      =  $(element),
				category = '',
				options  =  $el.data(data_key);
				$el.on('submit', function(event) {
					event.preventDefault();
					$.each(options.fields,function(index, value) {
					
						
						if( this.label === undefined | this.label === null | this.label === '') {
							return false;
						}

						if( this.category !== undefined && this.category !== null && this.category !== '' ) {
							category = this.category;
						}
						else {
							category = options.category;
						}
						if( $el.find(index).length === 1 ) {
								cwGA.track_event(category, $el.find(index).val(), this.label );
						}
						else {
							var label = this.label;
							$el.find(index).each( function() {
								cwGA.track_event(category,  $(this).val(), label );
								

							})
						}
						
					});
					$el.off('submit');
					$el.submit();
					});

					
				

		},

		main  :  function () {

			var	$el      =  $(this),
				options  =  $el.data(data_key);
			$el.trigger(component_initialized, options);
			methods._setup_form($el);
		}


		
	};

	$.fn.gaaware_forms  =  function (method) {

         if (methods[method] && method.charAt(0) !== '_') {
            var self_arguments = arguments;
            return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(self_arguments, 1)); });
        } else if (typeof method === 'object' || !method) {
            var args  =  arguments;
            return $(this).map(function(i, val) { return methods.init.apply(this, args); });
        }
	};

}(CWjQuery));
