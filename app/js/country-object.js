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
			that.capital.scale.x = 0;
			that.capital.scale.y = 0;
			that.capital.scale.z = 0;
		});
	} else {
		Game.loadModel('models/general/pin.DAE',function(model){
			that.capital = model;
			that.capital.position.x = pos.x;
			that.capital.position.y = pos.y;
			that.capital.position.z = pos.z;
			that.capital.scale.x = 0;
			that.capital.scale.y = 0;
			that.capital.scale.z = 0;
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
		that.setOccupationTexture();
		that.loaded = true;
	});
}

Country.prototype.setOccupationTexture = function(){
	 switch(this.getOccupation()) {
	    case "Allied":
	        this.model.children[1].children[0].material = Game.alliedTexture;
	        break;
	    case "Axis":
	        this.model.children[1].children[0].material = Game.axisTexture;
	        break;
	    default:
	    this.model.children[1].children[0].material = Game.neutralTexture;
	} 
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

// Country.prototype.generateEvents = (){
	
// }

Country.prototype.getModel = function() {
	return this.model;
};

// Raises a country
Country.prototype.raise = function(deltaTime) {
		this.model.position.y++;
		this.capital.position.y++;
		this.capital.scale.x = this.capital.scale.x + 0.04;
		this.capital.scale.y = this.capital.scale.y + 0.04;
		this.capital.scale.z = this.capital.scale.z + 0.04;
		

		if(this.model.position.y >= 25){
		    this.state = "up";
		    this.model.position.y = 25;
			this.capital.scale.x = 1;
			this.capital.scale.y = 1;
			this.capital.scale.z = 1;
		}
		return this.model;
};

// Lowers a country
Country.prototype.lower = function(deltaTime) {
	if(!this.active){
	    this.model.position.y--;
	    this.capital.position.y--;
		this.capital.scale.x = this.capital.scale.x - 0.04;
		this.capital.scale.y = this.capital.scale.y - 0.04;
		this.capital.scale.z = this.capital.scale.z - 0.04;
		
	    if (this.model.position.y <= 0) {
	        this.state = "down";
	        this.model.position.y = 0;
			this.capital.scale.x = 0;
			this.capital.scale.y = 0;
			this.capital.scale.z = 0;
	    }
	    return this.model;
	}
};

// Grows a model
Country.prototype.grow = function(deltatime){
}

// Shrinks a model
Country.prototype.shrink = function(deltatime){
}

Country.prototype.getOccupation = function(){
	return this.data[Game.currentYear].occupation;
}