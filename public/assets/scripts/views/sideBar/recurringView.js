define(
[
"jquery",
"underscore",
"marionette"
],
function ($, _, Marionette) {
	return Marionette.Layout.extend({
		template: 'sideBar/recurring',

		templateHelpers: {
			build_select: function(options, attributes, opts) {
                attributes = attributes || {};
                opts = opts || {};

                attributes['class'] = "btn-group " + (attributes['class'] || '');

                // get specific attributes from attributes object
                var style = attributes.style,
                    name = attributes.name,
                    selectedVal = attributes.value,
                    numDividers = 0;

                var selectedLabel, firstOption, i = 0, menu =
                        _.reduce(options, function(memo, label, value) {
                            var divider = false, action = false, childNodes = '', children = false;

                            // account for different styles of input
                            if (_.isArray(options)) {
                                if (_.isObject(label)) {
                                    divider = label.divider;
                                    action = !!label.action;
                                    value = label.value;
                                    children = label.children;
                                    label = label.label;
                                } else {
                                    value = label;
                                }
                            } else if (_.isObject(label)) {
                                divider = label.divider;
                                action = !!label.action;
                                children = label.children;
                                label = label.label;
                            }

                            firstOption = firstOption || {label: label, value: value}; // get the first option we encounter

                            // if value was passed in, or it's the first item, set selectedLabel
                            if (i++ == 0 || value == selectedVal) {
                                selectedLabel = label;
                            }

                            if(_.isArray(children)) {
                                childNodes = '<ul class="dropdown-menu">' + _.reduce(children, function(nodes, child, parent) {
                                            return nodes + '<li>' +
                                                '<a href="#" data-value="'+child.value+'" data-action="'+!!child.action+'">' +
                                                    child.label +
                                                '</a>' +
                                            '</li>';
                                }, '') + '</ul>'
                            }

                            numDividers += divider ? 1 : 0;

                            return memo +
                                (divider ? '<li class="divider"></li>' : '') +
                                '<li ' + (childNodes ? 'class="dropdown-submenu"' : '') + '>' +
                                    '<a href="#" ' + (childNodes ? '': 'data-value="'+value+'"') + ' data-action="'+action+'">' +
                                        label +
                                    '</a>' +
                                    childNodes +
                                '</li>';
                        }, "") +
                    '</ul>';

                // prepend opening tag, doing it after because we need to run thru the menu to generate attrs here properly
                menu = '<ul class="dropdown-menu" style="'+(_.size(options)+numDividers > 9 ? 'overflow-y: scroll;' : '')+'">' + menu;

                // if we still don't have a selected value, set it to the first option's value
                if (!selectedVal) {
                    selectedVal = firstOption && firstOption.value;
                }

                var dropdown =
                '<div' + this.build_attributes(attributes, ['style', 'name', 'value']) + ' value="'+selectedVal+'">' +

                    // hidden input field - used to store value and comply with forms
                    '<input style="display: none;" type="text" '+this.build_attributes({name: name, value: selectedVal})+' />' +

                    '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown">' +

                        // label, current selected item
                        '<div class="dropdown-label" style="'+(style || '')+'">' +
                            (opts.title || selectedLabel) +
                        '</div>'+
                        '<span class="caret"></span>'+

                    '</button>' +
                    menu +
                '</div>';
                return dropdown;
            },

            build_attributes: function(attributes, toSkip) {
                var s = "";
                toSkip = toSkip || [];
                _.each(attributes, function(value, attr) {
                    if (!_.include(toSkip, attr)) { // ignore value we want to skip
                        s += " " + attr + "=\"" + value + "\"";
                    }
                });

                return s + " ";
            }
		},

		attributes: {
			// prevents jump with slideDown due to margin collapse
			style: 'padding: 1px 0;'
		},

		ui: {
			everyInput: 'input[name="every"]',
			unitSelector: '.unit-selector',
            specInput: '.spec-input'
		},

		events: {
			"click .btn-group .dropdown-menu li a": "dropdownClick",
			'change input[name="every"]': 'changeEvery',
			'change .unit-selector': 'changeUnit'
		},

		dropdownClick: function(e) {
			e.preventDefault();
            e.stopImmediatePropagation();

            var $item = $(e.currentTarget);
            if($item.data('value') !== undefined) {
                var $selector = $item.closest('.btn-group');
                this.setDropdownVal($selector, $item, $item.data('value'));
                $selector.removeClass('open');
                $item.trigger('change'); // trigger change event
            }
		},

		setDropdownVal: function($dropdown, $item, value) {
            var title;

            $dropdown.val(value);
            $dropdown.find('input[type=text]').val(value);

            var title = !!$item.data('action') ? false : $item.html();
            if (title) {
                $dropdown.find('.dropdown-label').html(title);
            }
        },

		onShow: function() {
			this.changeUnit();
		},

		changeEvery: function(e) {
			this.model.set('every', parseInt(this.ui.everyInput.val()) || 1);
		},

		changeUnit: function(e) {
			var val = this.ui.unitSelector.find('input').val().toLowerCase();
			this.model.set('unit', val);

            this.ui.specInput
                .datepicker({
                    multiSelect: true
                }).on('changeDate', function(e) {
                        console.log('picked', e.date);
                    });
		}
	});
});