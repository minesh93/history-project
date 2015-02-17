var Country = function (){
	this.active = false;
	this.position = new THREE.Vector3(0,0,0);
	this.material = new THREE.MeshLambertMaterial({color: 0xFF0000})
	this.model = new THREE.Mesh( new THREE.BoxGeometry(50,50,50), this.material );
	this.data = [];
};

Country.prototype.getModel = function() {
	return this.model;
};