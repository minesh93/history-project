var Country = function (name){
	this.name = name;
	this.active = false;
	this.raising = false;
	this.raised = false;
	this.lowring = false;
	this.down = true;
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
	if(this.loaded){
		
		
		// active + raised
		// active + raising
		// active + down
		// active + lowering
		// inactive + raised
		// inactive + raising
		// inactive + down
		// inactive + lowering
		
		// the country has been clicked
		if (this.active){
			
			if (this.raised){
				// do nowt
			} else {
				this.raising = true;
				this.lowering = false;
				this.down = false;
				this.raise();
			}
		} else {
			// Inactive
			
			if(this.down){
				// do nowt
			} else {
				this.lowering = true;
				this.raising = false;
				this.raised = false;
				this.lower();
			}	
		}
	}
}


Country.prototype.getModel = function() {
	return this.model;
};

Country.prototype.raise = function(deltaTime) {
	this.model.position.y++;
				if(this.model.position.y == 25){
					this.raising = false;
					this.raised = true;
				}

	return this.model;
};

Country.prototype.lower = function() {
	this.model.position.y = this.model.position.y-2;
				if(this.model.position.y <= 25){
					this.raising = false;
					this.raised = true;
					this.model.position.y = 0;
				}
	return this.model;
};