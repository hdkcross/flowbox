var page_submitted = false,
	current_page = '',
	mooli,
	cc;

window.addEvents({
	'domready': function() {
		current_page = $(document.body).get('id');

		switch(current_page) {
			case 'page_pregame':
				series_on_page_pregame();
				break;
			case 'page_reg_full':
				series_on_page_reg_full();
				break;
			default:
				break;
		}
	},
	'load': function() {
	},
	'resize': function() {
	}
});

/* page scripts START */
var series_on_page_pregame = function() {
};

var series_on_page_reg_full = function() {
};
/* page scripts END */

/* countdown START */
var Circle_Clock = new Class({
	Implements: [Options],

	options: {
		fields: {
			seconds: false,
			minutes: false,
			hours: false,
			days: false,
			month: false
		},
		dimensions: {
			seconds: [0, 0],
			minutes: [0, 0],
			hours: [0, 0],
			days: [0, 0],
			month: [0, 0]
		},
		colors: {
			seconds: '#7995d5',
			minutes: '#acc742',
			hours: '#e7629a',
			days: '#ff9900',
			month: '#7995d5'
		},
		remaining_seconds: false,
		line_width: 5,
		show_date: false,
		count: true,
		duration: 'month'
	},

	STATIC_CANVAS: false,
	STATIC_TICK_INTERVAL: false,
	STATIC_CIRCLE: Math.PI * 2,
	STATIC_TICK_DIVIDER: {},
	STATIC_TICKS: {},
	STATIC_ROTATION: Math.PI / 2 * -1,
	STATIC_CONTEXT_SECONDS: false,
	STATIC_CONTEXT_MINUTES: false,
	STATIC_CONTEXT_HOURS: false,
	STATIC_CONTEXT_DAYS: false,
	STATIC_CONTEXT_MONTH: false,
	STATIC_TEXT_SECONDS: false,
	STATIC_TEXT_MINUTES: false,
	STATIC_TEXT_HOURS: false,
	STATIC_TEXT_DAYS: false,
	STATIC_TEXT_MONTH: false,
	STATIC_DAY: 1000 * 60 * 60 * 24,
	STATIC_HOUR: 1000 * 60 * 60,
	STATIC_MINUTE: 1000 * 60,
	STATIC_SECOND: 1000,
	STATIC_TODAY: new Date(),
	STATIC_DEADLINE: {},

	ATTR_CURRENT_TIME: false,

	initialize: function(options) {
		var _self = this;
		if(Object.getLength(options) > 0) {
			_self.setOptions(options);
			if(!!window.CanvasRenderingContext2D) {
				_self.STATIC_CANVAS = true;
			}
			_self.set_ticks();
			_self.set_deadline();

			if(typeOf(_self.options.remaining_seconds) != 'number') {
				_self.ATTR_CURRENT_TIME = _self.STATIC_TODAY.getTime();
			} else {
				if(_self.options.show_date == false) {
					_self.ATTR_CURRENT_TIME = _self.STATIC_DEADLINE - _self.options.remaining_seconds;
				} else {
					_self.ATTR_CURRENT_TIME = _self.options.remaining_seconds;
				}
			}

			_self.set_fields();
			if(_self.options.show_date == false) {
				if(_self.options.count == true) {
					_self.STATIC_TICK_INTERVAL = setInterval(function() {
						_self.control_clock();
					}, 1000);
				} else {
					_self.control_clock();
				}
			} else {
				_self.control_date();
			}
		}
	},

	set_ticks: function() {
		var _self = this;
		_self.STATIC_TICK_DIVIDER = {
			month: 12,
			days: 0,
			hours: 24,
			minutes: 60,
			seconds: 60
		};
		switch(_self.options.duration) {
			case 'month':
				_self.STATIC_TICK_DIVIDER.days = new Date(_self.STATIC_TODAY.getUTCFullYear(), _self.STATIC_TODAY.getUTCMonth() + 1, 0).getDate();
				break;
			case 'year':
				_self.STATIC_TICK_DIVIDER.days = 366;
				break;
		}
		_self.STATIC_TICKS = {
			month: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		};
		Object.each(_self.STATIC_TICKS, function(value, key) {
			_self.STATIC_TICKS[key] = Math.PI * 2 / _self.STATIC_TICK_DIVIDER[key];
		});
	},

	set_deadline: function() {
		var _self = this;
		var deadline = {
			year: _self.STATIC_TODAY.getUTCFullYear(),
			month: _self.STATIC_TODAY.getUTCMonth(),
			day: 1
		};
		if(deadline.month < 11) {
			deadline.month++;
		} else {
			deadline.month = 0;
			deadline.year++;
		}
		_self.STATIC_DEADLINE = (new Date(deadline.year, deadline.month, deadline.day)).getTime();
	},

	set_fields: function() {
		var _self = this;
		if(_self.STATIC_CANVAS == true) {
			var canvas = {
				seconds: false,
				minutes: false,
				hours: false,
				days: false,
				month: false
			};
			Object.each(canvas, function(value, key) {
				if(_self.options.fields[key] != false) {
					canvas[key] = _self.options.fields[key].getElement('canvas');
					_self.options.dimensions[key][0] = parseInt(canvas[key].getStyle('width'));
					_self.options.dimensions[key][1] = parseInt(canvas[key].getStyle('height'));
				}
			});
			if(canvas.seconds != false) _self.STATIC_CONTEXT_SECONDS = canvas.seconds.getContext('2d');
			if(canvas.minutes != false) _self.STATIC_CONTEXT_MINUTES = canvas.minutes.getContext('2d');
			if(canvas.hours != false) _self.STATIC_CONTEXT_HOURS = canvas.hours.getContext('2d');
			if(canvas.days != false) _self.STATIC_CONTEXT_DAYS = canvas.days.getContext('2d');
			if(canvas.month != false) _self.STATIC_CONTEXT_MONTH = canvas.month.getContext('2d');
		}
		if(_self.options.fields.seconds != false) _self.STATIC_TEXT_SECONDS = _self.options.fields.seconds.getElement('span');
		if(_self.options.fields.minutes != false) _self.STATIC_TEXT_MINUTES = _self.options.fields.minutes.getElement('span');
		if(_self.options.fields.hours != false) _self.STATIC_TEXT_HOURS = _self.options.fields.hours.getElement('span');
		if(_self.options.fields.days != false) _self.STATIC_TEXT_DAYS = _self.options.fields.days.getElement('span');
		if(_self.options.fields.month != false) _self.STATIC_TEXT_MONTH = _self.options.fields.month.getElement('span');
	},

	control_clock: function() {
		var _self = this;
		var time = _self.get_remaining_time();
		_self.draw_clock(_self.STATIC_TEXT_SECONDS, _self.STATIC_CONTEXT_SECONDS, 'seconds', time);
		_self.draw_clock(_self.STATIC_TEXT_MINUTES, _self.STATIC_CONTEXT_MINUTES, 'minutes', time);
		_self.draw_clock(_self.STATIC_TEXT_HOURS, _self.STATIC_CONTEXT_HOURS, 'hours', time);
		_self.draw_clock(_self.STATIC_TEXT_DAYS, _self.STATIC_CONTEXT_DAYS, 'days', time);
		_self.ATTR_CURRENT_TIME = _self.ATTR_CURRENT_TIME + 1000;
		if(_self.ATTR_CURRENT_TIME > _self.STATIC_DEADLINE) {
			window.clearInterval(_self.STATIC_TICK_INTERVAL);
		}
	},

	control_date: function() {
		var _self = this;
		var time = _self.get_entry_date();
		_self.draw_clock(_self.STATIC_TEXT_MINUTES, _self.STATIC_CONTEXT_MINUTES, 'minutes', time);
		_self.draw_clock(_self.STATIC_TEXT_HOURS, _self.STATIC_CONTEXT_HOURS, 'hours', time);
		_self.draw_clock(_self.STATIC_TEXT_DAYS, _self.STATIC_CONTEXT_DAYS, 'days', time);
		_self.draw_clock(_self.STATIC_TEXT_MONTH, _self.STATIC_CONTEXT_MONTH, 'month', time);
	},

	draw_clock: function(text, clock, scale, time) {
		var _self = this;
		text.set('text', time[scale]);
		if(_self.STATIC_CANVAS == true) {
			var data = _self.get_tick_data(_self.options.dimensions[scale][0], _self.options.dimensions[scale][1], time[scale], _self.STATIC_TICKS[scale], _self.STATIC_TICK_DIVIDER[scale]);
			clock.clearRect(0, 0, _self.options.dimensions[scale][0], _self.options.dimensions[scale][1]);
			clock.beginPath();
			clock.arc(data.half_width, data.half_height, data.radius, _self.STATIC_ROTATION, data.time);
			clock.lineWidth = _self.options.line_width;
			clock.strokeStyle = _self.options.colors[scale];
			clock.stroke();
		}
	},

	get_tick_data: function(width, height, time, tick, tick_divider) {
		var _self = this;
		//
		var radius = parseInt((width - _self.options.line_width) / 2);
		if(height < width) {
			radius = parseInt((height - _self.options.line_width) / 2);
		}
		var data = {
			half_width: width / 2,
			half_height: height / 2,
			radius: radius,
			time: (tick_divider - time) * tick + _self.STATIC_ROTATION
		}
		if(_self.options.show_date == true) {
			data.time = time * tick + _self.STATIC_ROTATION;
		}
		return data;
	},

	get_difference: function() {
		var _self = this;
		return _self.STATIC_DEADLINE - _self.ATTR_CURRENT_TIME;
	},

	get_entry_date: function() {
		var _self = this;
		var date = new Date(_self.ATTR_CURRENT_TIME);
		var entry_date = {
			month: date.getUTCMonth() + 1,
			days: date.getUTCDate(),
			hours: date.getUTCHours() + 1,
			minutes: date.getUTCMinutes()
		};
		return entry_date;
	},

	get_remaining_time: function() {
		var _self = this;
		var remaining_time = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		};
		var difference = _self.get_difference();
		remaining_time.days = Math.floor(difference / _self.STATIC_DAY);
		difference = difference - (remaining_time.days * _self.STATIC_DAY);
		remaining_time.hours = Math.floor(difference / _self.STATIC_HOUR);
		difference = difference - (remaining_time.hours * _self.STATIC_HOUR);
		remaining_time.minutes = Math.floor(difference / _self.STATIC_MINUTE);
		difference = difference - (remaining_time.minutes * _self.STATIC_MINUTE);
		remaining_time.seconds = Math.floor(difference / _self.STATIC_SECOND);
		return remaining_time;
	}
});
/* countdown END */

var get_ms_to_enddate = function() {
	return new Date(use_end_date) - new Date();
};

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

// selector to open iframe
// searching all a-tags in the selector or as selector
// define id = '#id', class = '.class', multi = '#id .class'
// define 'type': 'iframe'
// define 'regex' : {0:/RegEx/}
// Object with avalible keys('id', 'class');
var iframe_selector = new Class({
    Implements: Options,
    options: {
        /*selectors : {
            '#id' : {
                'type' : 'iframe'
            },
            '.class' : {
                'type' : 'iframe',
                'regex' : {
                    '0' : /Regex/
                }
            }
        },*/
        target_window : 'popped_iframe'
    },

	regex_pdf: /\.pdf$/,
	regex_javascript : /^javascript/,

    initialize: function(options) {
        var _self = this;
        _self.setOptions(options);
        _self.check_selectors();
    },

    check_selectors: function() {
        var _self = this;

        Object.each(_self.options.selectors, function(value,key) {
            for(var i = 0; i< $$(key).length; i++) {
                if($$(key)[i].get('tag') == 'a') {
                    if(value.regex && typeof(value.regex) == 'object') {
                        if(_self.check_selector_regex($$(key)[i], value.regex) === true) {
                            _self.setup_selector($$(key)[i], value.type);
                        }
                    } else {
                        _self.setup_selector($$(key)[i], value.type);
                    }
                } else {
                    i = $$(key).length +1;
                    var links = $$(key+ ' a');
                    for(var x = 0; x < links.length; x++) {
                        if(value.regex && typeof(value.regex) == 'object') {
                            if(_self.check_selector_regex(links[x], value.regex) === true) {
                                _self.setup_selector(links[x], value.type);
                            }
                        } else {
                            _self.setup_selector(links[x], value.type);
                        }
                    }
                }
            }
        });
    },

    setup_selector: function(element, type) {
        var _self = this;

        if(element.hasClass('advertiselink') || element.hasClass('ignore') || element.href.test(_self.regex_javascript, 'i')) return;

        if(element.href) {
            element.removeEvents();
            if(element.href.test(_self.regex_pdf) == false) {
                if(type == 'iframe') {
                    element.target = _self.options.target_window;
                    element.addEvent('click', function() {
                        open_iframe();
                    });
                }
                if(type == 'layer') {
                    element.target = _self.options.target_window;
                    element.addEvent('click', function() {
                        open_layer(element,element.href);
                    });
                }
            } else {
                element.target = _self.options.target_window;
                element.addEvent('click', function() {
                    open_iframe();
                });
            }
        }
    },

    check_selector_regex: function(element, regex_obj) {
        var _self = this;
        var clear = false;

        if(regex_obj[0] !== undefined) {
            Object.each(regex_obj, function(value, key) {
                if(element.href && element.href.test(value)){
                    clear = true;
                }
            });
        } else {
            if(element.href && element.href.test(regex_obj)){
                clear = true;
            }
        }

        return clear;
    }
});

var open_iframe = function() {
    scroll_position_x = window.getScroll().y;

    $('pop_iframe').setStyle('display', 'block');
    $('content_wrapper').setStyle('display','none');

    var height;
    if(window.innerHeight) {
        height = window.innerHeight;
    } else if (document.body) {
        height = document.body.clientHeight;
    } else {
        height = $(document.body).getStyle('height');
    }

    $('popped_iframe').setStyle('height', (document.documentElement.clientHeight || window.innerHeight) - 4);
    window.scroll(0, 0);
};

var open_layer = function(element, href) {
    scroll_position_x = window.getScroll().y;

    if(href) {
        var link = href;
    } else {
        var link = element.href;
    }

    new Request({
        url: link,
        method: 'GET',
        onSuccess: function(response) {
            $('pop_iframe').setStyle('display', 'block');
            $$('#pop_iframe iframe')[0].setStyle('height', 0);
            $$('#pop_iframe iframe')[0].setStyle('display','none');
            if($('content_wrapper')){
                $('content_wrapper').setStyle('display','none');
            }

            if(!$('popped_layer')) {
                var popped_layer  = new Element('div', {
                    id: 'popped_layer'
                });
                popped_layer.inject($('pop_iframe_closer'), 'before');
            }

            // clean content
            $('popped_layer').set('html', response);
            $$('#popped_layer link').dispose();
            $$('#popped_layer meta').dispose();
            $$('#popped_layer style').dispose();
            $$('#popped_layer title').dispose();
            $$('#popped_layer a').each(function(element){
                if(element.href.test(/self.close()/) == true || element.href.test(/window.close()/) == true) {
                    element.dispose();
                }
            });

            $('pop_iframe_closer').addClass('popped_layer');
            $('pop_iframe').setStyle('background-color', $('popped_layer').getStyle('background-color'));
            $$('#popped_layer .poplink, #popped_layer .sponsoren_iframe').each(function(element, index) {
                if(element.href.test(/sponsor.htm|cgi-bin|_sponsoren/) === true) {
                    if(element.hasClass('ignore') === false) {
                        element.removeAttribute('target');
                        var href = element.href;
                        element.href = '#';
                        element.removeClass('poplink');
                        element.addEvent('click', function() {
                            $('pop_iframe_closer').fireEvent('click');
                            open_layer(element, href);
                        });
                    }
                }
            });
        }
    }).send();
    window.scroll(0, 0);
};

var clean_links = function(link) {
};

var add_pop_iframe_closer_events = function() {
    $('pop_iframe_closer').addEvent('click', function() {
        if($('content_wrapper')){
            $('content_wrapper').setStyle('display', 'block');
        }
        $('pop_iframe').setStyle('display', 'none');
        $('pop_iframe').setStyle('height', '0px');
        $('popped_iframe').set('src', 'about:blank');
        if($('popped_layer')) {
            $('popped_layer').empty();
            $('popped_layer').destroy();
            $$('#pop_iframe iframe')[0].removeProperty('style');
            $('pop_iframe_closer').removeClass('popped_layer');
        }
		if (typeof(scroll_position_x) != 'undefined') {
			window.scroll(0, scroll_position_x);
		}
    });
};