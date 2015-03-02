var Country = function (){
	this.active = false;
	this.raising = true;
	this.raised = false;
	this.position = new THREE.Vector3(0,0,0);
	this.material = new THREE.MeshLambertMaterial({color: 0xFF0000})
	this.model = new THREE.Mesh( new THREE.BoxGeometry(200,150,10), this.material );
	this.data = [];
};

Country.prototype.getModel = function() {
	return this.model;
};

Country.prototype.setModel = function(path) {
	//- Model loading code here
};

Country.prototype.raise = function(deltaTime) {
	if(this.raising && !this.raised){
		if(this.model.position.z >= 200){
			this.raising = false;
			this.raised = true;
		} else {
			this.model.position.z += 120 * deltaTime;
		}
	}
	return this.model;
};

Country.prototype.lower = function() {

	if(!this.raising && this.raised){
		if(this.model.position.z <= 30){
			this.raising = true;
			this.raised = false;
		} else {
			this.model.position.z -= 120 * deltaTime;
		}
	}
	return this.model;
};