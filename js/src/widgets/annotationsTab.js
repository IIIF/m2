(function($) {

    $.AnnotationsTab = function(options) {
        jQuery.extend(true, this, {
            element:           null,
            appendTo:          null,
            parent:            null,
            manifest:          null,
            visible:           null
        }, options);

        this.init();
    };

    $.AnnotationsTab.prototype = {
        init: function() {
            var _this = this;
            this.windowId = this.parent.id;

            var state = this.state({
                visible: this.visible,
                annotationLists: [],
                focusedList: null
            }, true);

            this.listenForActions();
            this.render(state);
            this.loadTabComponents();
            this.bindEvents();
        },
        state: function(state, initial) {
            if (!arguments.length) return this.tabState;
            this.tabState = state;

            if (!initial) {
                jQuery.publish('annotationsTabStateUpdated' + this.windowId, this.tabState);
            }

            return this.tabState;
        },
        loadTabComponents: function() {
            var _this = this;
        },
        tabStateUpdated: function(visible) {
            var state = this.state();
            state.visible = state.visible ? false : true;

            this.state(state);
        },
        annotationListLoaded: function() {
            var _this = this,
                annotationSources = [],
                state = this.state();

            for(var i = 0; i < _this.parent.annotationsList.length; i++)
            {

                if(typeof _this.parent.annotationsList[i].endpoint === 'string'){

                  annotationSources.push('manifest');

                }else{

                  annotationSources.push(_this.parent.annotationsList[i].endpoint.name);

                }

            }

            // make unique
            annotationSources = annotationSources.filter(function(itm,i,annotationSources){
                return i==annotationSources.indexOf(itm);
            });

            state.annotationLists = annotationSources.map(function(annotationSource) {
                return {
                    annotationSource: annotationSource,
                    layer: null,
                    selected: false,
                    focused: false
                };
            });

            this.state(state);
        },
        selectList: function(listId) {
            var state = this.state();
            state.selectedList = listId;

            state.annotationLists.forEach(function(list){ list.selected = list.annotationSource === listId ? true : false; });

            this.state(state);
        },
        focusList: function(listId) {
            var state = this.state();
            state.focusedList = listId;
            state.annotationLists.forEach(function(list){ list.focused = list.annotationSource === listId ? true : false;});
            this.state(state);
        },
        toggle: function() {},
        listenForActions: function() {
            var _this = this;
            jQuery.subscribe('annotationsTabStateUpdated' + _this.windowId, function(_, data) {
                _this.render(data);
            });

            jQuery.subscribe('tabStateUpdated' + _this.windowId, function(_, data) {
                _this.tabStateUpdated(data.annotationsTab);
            });


            jQuery.subscribe('annotationListLoaded.' + _this.windowId, function(_, data) {
                _this.annotationListLoaded();
            });

            jQuery.subscribe('currentCanvasIDUpdated.' + _this.windowId, function(event) {
              jQuery.subscribe('annotationListLoaded.' + _this.windowId, function(event) {
                  _this.annotationListLoaded();
              });
            });

            jQuery.subscribe('openAnnotationList.' + _this.windowId, function(event, data) {
                _this.selectList(data);
            });

        },
        bindEvents: function() {
            var _this = this,
                listItems = this.element.find('.annotationListItem');

            listItems.on('click', function(event) {
                var listId = jQuery(this).data('id');
                jQuery.publish('openAnnotationList.' + _this.windowId, listId);
            });

        },
        render: function(state) {
            var _this = this,
                templateData = {
                    annotationSources: state.annotationLists
                };

            if (!this.element) {
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            } else {
                _this.appendTo.find(".annotationsPanel").remove();
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            }
            _this.bindEvents();


            if (state.visible) {
                this.element.show();
            } else {
                this.element.hide();
            }
        },
        template: Handlebars.compile([
            '<div class="annotationsPanel">',
            '<ul class="annotationSources">',
            '{{#each annotationSources}}',
            '<li class="annotationListItem {{#if this.selected}}selected{{/if}} {{#if this.focused }}focused{{/if}}" data-id="{{this.annotationSource}}">',
                    '<span>{{this.annotationSource}}</span>',
            '</li>',
            '{{/each}}',
            '</ul>',
            '</div>',
        ].join(''))
    };

}(Mirador));
