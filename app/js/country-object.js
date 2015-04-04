var Country = function (name){
	this.name = name;
	this.active = false;
	this.state = "down";
	this.loaded = false;
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

	var pos = this.cPos;
	if(this.capital != 'Pin'){
		console.log("Loading capital: "+lowername);
		Game.loadModel('models/capitals/'+lowername+'.DAE',function(model){
			that.capital = model;
			that.capital.position.x = pos.x;
			that.capital.position.y = pos.y;
			that.capital.position.z = pos.z;
		});
	} else {
		Game.loadModel('models/general/pin.DAE',function(model){
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
		that.model.targetName = that.name;
		that.loaded = true;
	});
}

Country.prototype.animate = function() {
	
	// Check that the model is loaded - if not, stuff will break!
    if (this.loaded) {
        // State machine for country movement
	    switch(this.state) {
	        case "down":
	            // stuff like stop capital animations
	            break;
	        case "raising":
	            this.raise();
	            break;
	        case "up":
	            // stuff like run animate on capital city model
	            break;
	        case "lowering":
	            this.lower();
	            break;
	        default:
	        // default stuff
	    } 
	}
}


Country.prototype.getModel = function() {
	return this.model;
};

Country.prototype.raise = function(deltaTime) {
		this.model.position.y++;
		this.capital.position.y++;
		if(this.model.position.y >= 25){
		    this.state = "up";
		    this.model.position.y = 25;
		}
		return this.model;
};

Country.prototype.lower = function(deltaTime) {
	if(!this.active){
	    this.model.position.y--;
	    this.capital.position.y--;
	    if (this.model.position.y <= 0) {
	        this.state = "down";
	        this.model.position.y = 0;
	    }
	    return this.model;
	}
};