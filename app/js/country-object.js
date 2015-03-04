var Country = function (name){
	this.name = name;
	this.active = false;
	this.raising = true;
	this.raised = false;
	this.position = "";
	this.material = "";
	this.model = {},
	this.capital = "",
	this.data = [];
};

Country.prototype.setCapital = function(path,x,y,z){
	//- this will not work in callbacks
	var that = this;
	var lowername = this.name.toLowerCase().replace(/\s/g, '');
	// console.log('models/capitals/'+lowername+'.DAE');

	if(this.capital != 'Pin'){
		var pos = this.cPos;
		console.log("Loading capital: "+lowername);
		Game.loadModel('models/capitals/'+lowername+'.DAE',function(model){
			that.capital = model;
			that.capital.position.x = pos.x;
			that.capital.position.y = pos.y;
			that.capital.position.z = pos.z;
		});
	}


}

Country.prototype.getCapital = function() {
	return this.capital;
};

Country.prototype.setModel = function(){
	var that = this;
	var lowername = this.name.toLowerCase().replace(/\s/g, '');
	
	Game.loadModel('models/countries/'+lowername+'.DAE',function(model){
		that.model = model;
	});
}

Country.prototype.getModel = function() {
	return this.model;
};

Country.prototype.raise = function(deltaTime) {
	//- Placeholder if using animation

	return this.model;
};

Country.prototype.lower = function() {
	//- Placeholder if using animation
	return this.model;
};