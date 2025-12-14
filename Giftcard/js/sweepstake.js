var survey_validator;
/* page_submitted, current_page, cc and mooli are in series.js */

window.addEvent('domready', function() {
	switch(current_page) {
		case 'page_pregame':
			on_page_pregame();
			break;
		case 'page_reg_half':
			on_page_reg_half();
			break;
		case 'page_reg_full':
			on_page_reg_full();
			break;
		case 'page_survey':
			on_page_survey();
			break;
		case 'page_multicoreg':
			on_page_multicoreg();
			break;
		case 'page_skill':
			on_page_skill();
			break;
		case 'page_logout':
			on_page_logout();
			break;
		case 'page_doi':
			on_page_doi();
			break;
		default:
			break;
	}

	var footer_links = new iframe_selector({
		selectors: {
			'.formrow_optin p a.poplink': {
				'type': 'layer'
			},
			'footer a': {
				'type': 'iframe'
			}
		}
	});

	add_pop_iframe_closer_events();

});

/* page scripts START */
var on_page_pregame = function() {
	cc = new Circle_Clock({
		fields: {
			seconds: $('clock_seconds'),
			minutes: $('clock_minutes'),
			hours: $('clock_hours'),
			days: $('clock_days')
		},
		remaining_seconds: get_milliseconds()
	});

	mooli = new Moolidator_Lite({
		'form_id': 'form_pregame',
		'submit_button_id': 'submit_pregame',
		'rules': moolidator_lite_rules,
		'countries': moolidator_lite_countries
	});
	mooli.addEvents({
		'moolidator_lite_submit': function() {
			if(page_submitted == false) {
				page_submitted = true;
				$('remaining_time').set('value', (new Date()).getTime());
				$('form_pregame').submit();
			}
		}
	});
};

var on_page_reg_half = function() {
};

var get_ms_to_enddate = function() {
	return new Date(use_end_date) - new Date();
};

var on_page_reg_full = function() {
	cc = new Circle_Clock({
		fields: {
			seconds: $('clock_seconds'),
			minutes: $('clock_minutes'),
			hours: $('clock_hours'),
			days: $('clock_days')
		},
		remaining_seconds: get_milliseconds()
	});
	var optinlayer = new Optin_layer({
		form_id: 'form_reg_full'
	});	
	mooli = new Moolidator_Lite({
		'form_id': 'form_reg_full',
		'submit_button_id': 'submit_reg_full',
		'rules': moolidator_lite_rules,
		'countries': moolidator_lite_countries
	});
	mooli.addEvents({
		'moolidator_lite_no_submit': function() {
			popunder_on_submit('fulreg');
		},
		'moolidator_lite_submit': function() {
			if (optinlayer.test_checkboxes() && page_submitted == false) {
				page_submitted = true;
				if (popunder_on_submit('fulreg') === false) {
					$('form_reg_full').submit();
				}
			}
		}
	});

	moolidator_lite_rules.es.firstname.negative.push(/Nombre/);
	moolidator_lite_rules.es.lastname.negative.push(/Apellidos/);
	moolidator_lite_rules['default'].street.negative.push(/Calle/);

	var complete_zipcode = new complete_input({
		container_id: 'complete_zipcode_street',
		todo: 'get_zipcode',
		field_id: 'zipcode',
		condition: /^.{2,5}$/
	});
	var complete_street = new complete_input({
		container_id: 'complete_zipcode_street',
		todo: 'get_street',
		field_id: 'street',
		params: ['zipcode', 'street']
	});	
	var complete_streetnr = new complete_input({
		container_id: 'complete_streetnr',
		todo: 'get_streetnr',
		field_id: 'streetnr',
		params: ['zipcode', 'street', 'streetnr']
	});	

	$$('.submit .optin a').addEvents({
		'click': function() {
			window.open($(this).get('href'));
		}
	});
};

var on_page_survey = function() {
};

var on_page_multicoreg = function() {
};

var on_page_logout = function() {
};

var on_page_doi = function() {
};
/* page scripts END */

var get_milliseconds = function() {
	var now = new Date();
	var use_time = {
		days: 0 * 24 * 60 * 60 * 1000,
		hours: (24 - (now.getHours() + 1)) * 60 * 60 * 1000,
		minutes: (60 - (now.getMinutes() + 1)) * 60 * 1000,
		seconds: (60 - (now.getSeconds() + 1)) * 1000
	};
	var use_seconds = use_time.days + use_time.hours + use_time.minutes + use_time.seconds;
	return use_seconds;
};