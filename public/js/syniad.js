/**
 * syniad.js
 */

/* application */
window.Syniad = Ember.Application.create();


Syniad.ApplicationAdapter = DS.FixtureAdapter.extend();


/* router */

Syniad.Router.map(function(){
	this.resource('ideas',{ path:'/' }, function(){
		this.resource('idea',{path:'/:idea_id'}, function(){});
	});

});

Syniad.IdeasRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('idea');
	}
});

Syniad.IdeasIndexRoute = Ember.Route.extend({
	model: function(){
		return this.modelFor('ideas')
	}
});

Syniad.IdeaRoute = Ember.Route.extend({
	model : function(){
		return this.store.find('idea', params.idea_id);
	}
});

/*Syniad.IdeasSpecificRoute = Ember.Route.extend({
	mode: function(){
		return this.store.find('idea').get('children');
	},
	renderTemplate: function(controller){
		this.render('ideas/children',{controller:controller});
	}
})*/

/* models */

Syniad.Idea = DS.Model.extend({
	ideaBody : DS.attr('string'),
	title: DS.attr('string', {defaultValue:"[No Title]"}),
	collapsed : DS.attr('boolean'),
	link : DS.hasMany('idea'), // one to many
	date : DS.attr('date'),
	bgColor: DS.attr('string'),
	parent: DS.belongsTo('idea'),
	children : DS.hasMany('idea') // one to many
});

Syniad.Idea.FIXTURES = [
{
	id: 1,
	ideaBody: "Test 1",
	collapsed: true,
	date : '',
	bgColor: '000000',
},{
	id: 2,
	ideaBody: "Test 2",
	collapsed: false,
	date : '',
	bgColor: '000000',
},{
	id: 3,
	ideaBody: "Test 1",
	collapsed: false,
	date : '',
	bgColor: '000000',
}
];

/* Components */
/* http://emberjs.jsbin.com/OGEnOdA/18/edit */
/*Syniad.EditableViewComponent = Ember.Component.extend({
  actions: {
    toggleEditing: function() {
      this.toggleProperty('isEditing');
    } 
  }
});*/

/* Controller */

//Group controller
Syniad.IdeasController = Ember.ArrayController.extend({
	actions :{
		createIdea: function(){
			var ideaBody = this.get('newIdeaBody');
			if(!ideaBody.trim()){ return; }

			var idea = this.store.createRecord('idea', {
				ideaBody: ideaBody,
				title: ""
			});

			this.set('newIdeaBody', '');

			idea.save();
		}
	}
	/*
	remaining: function() {
  return this.filterBy('isCompleted', false).get('length');
}.property('@each.isCompleted'),

inflection: function() {
  var remaining = this.get('remaining');
  return remaining === 1 ? 'item' : 'items';
}.property('remaining')
// ... additional lines truncated for brevity ...
	 */
});

//Single Controller
Syniad.IdeaController = Ember.ObjectController.extend({
	actions: {
		editTitle :function(){
			this.set('isEditingTitle', true);
		},
		editIdeaBody : function(){
			this.set('isEditingIdeaBody', true);
		},
		acceptIdeaBodyChanges : function(){
			this.set('isEditingIdeaBody', false);

			if(Ember.isEmpty(this.get('model.ideaBody'))){
				this.send('removeIdea');
			} else{
				this.get('model').save();
			}
		},
		acceptChanges : function(){
			this.set('isEditingTitle', false);

			if(Ember.isEmpty(this.get('model.title'))){
				this.set('model.title',"[No title]");
			} else{
				this.get('model').save();
			}
		},
		removeIdea: function(){
			var idea= this.get('model');
			idea.deleteRecord();
			idea.save();
		}
	},
	isEditingTitle: false,
	isEditingIdeaBody: false,

	/*
	 isCompleted: function(key, value){
    var model = this.get('model');

    if (value === undefined) {
      // property being used as a getter
      return model.get('isCompleted');
    } else {
      // property being used as a setter
      model.set('isCompleted', value);
      model.save();
      return value;
    }
  }.property('model.isCompleted')
	 */
});

/* views */
Syniad.EditIdeaView = Ember.TextArea.extend({
	didInsertElement: function(){
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-idea', Syniad.EditIdeaView);


// in theory... 

/*
{
	id: "xx",
	body: "texttext",
	link: ["xx"],
	date : "xx",
	bgColor : "xxx",
	children :[{}]
}
 */
