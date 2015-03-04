var Country = function (){
	this.active = false;
	this.raising = true;
	this.raised = false;
	this.position = new THREE.Vector3(0,0,0);
	this.material = new THREE.MeshLambertMaterial({color: 0xFF0000})
	this.model = new THREE.Mesh( new THREE.BoxGeometry(200,150,10), this.material );
	this.capital = {},
	this.data = [];
};

Country.prototype.setCapital = function(path,x,y,z){
	//- this will not work in callbacks
	var that = this;
	Game.loadModel(path,function(model){
		that.capital = model;
		that.capital.position.x = x;
		that.capital.position.y = y;
		that.capital.position.z = z;
	});
}

Country.prototype.getModel = function() {
	return this.model;
};

Country.prototype.setModel = function(path) {
	//- Model loading code here
};

Country.prototype.raise = function(deltaTime) {
	//- Placeholder if using animation

	return this.model;
};

Country.prototype.lower = function() {
	//- Placeholder if using animation
	return this.model;
};