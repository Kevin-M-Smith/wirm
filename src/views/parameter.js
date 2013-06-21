App.Views.ParametersTab = Backbone.View.extend({
  initialize: function(options) {
    console.log('INIT: parameters view');
    var view = this;
    this.parameters = options.parameters;
    this.group = options.group;
    this.listenToOnce(this.parameters, 'sync', this.render);
  },

  render: function() {
    console.log('RENDER: parameters view');
    var view = this;
    this.$el.empty();
    var basicParameters = this.parameters.filter(function (model) { return model.get('group')===view.group;});
    _.each(basicParameters, function(parameter) {
        var parameterContainer = new App.Views.ParameterContainer({model: parameter});
        view.$el.append(parameterContainer.el);
      });
    return this;
  }
});

App.Views.ParameterContainer = Backbone.View.extend({
  className: 'param-row',

  initialize: function() {
    console.log('INIT: container for ' + this.model.get('key'));
    this.parameterLabel = new App.Views.ParameterLabel({model: this.model});
    this.parameterSlider = new App.Views.ParameterSlider({model: this.model});
    this.render();
  },

  render: function() {
    this.$el.empty();
    this.$el.append( this.parameterLabel.render().el );
    this.$el.append( this.parameterSlider.render().el );
    return this;
  }
});

App.Views.ParameterLabel = Backbone.View.extend({
  className: 'param-label',

  template: App.template('template-parameter-label'),

  initialize: function() {
    this.listenTo(this.model, 'change:value', this.render);
  },

  render: function() {
    this.$el.html( this.template( this.model.toJSON() ));
    return this;
  }
});

App.Views.ParameterSlider = Backbone.View.extend({
  className: 'slider param-slider',

  events: {
    'slide': 'slideUpdate'
  },

  initialize: function() {
    this.$el.slider( this.model.toJSON() );
    var max = this.model.get('max'),
        min = this.model.get('min');
    this.$el.slider( 'option', 'step', Math.pow(10,Math.round(Math.log(max-min)/Math.log(10))-2));
    this.listenTo(this.model, 'change:value', this.render);
  },

  slideUpdate: function(event, ui) {
    this.model.set('value', ui.value);
  },

  render: function() {
    this.$el.slider( this.model.toJSON() );
    return this;
  }
});
