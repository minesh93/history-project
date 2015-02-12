window.Game = {
	WIDTH:800,
	HEIGHT:600,
	VIEW_ANGLE:45,
	ASPECT_RATIO:800/600,
	NEAR_CLIPPING_PLANE:0.1,
	FAR_CLIPPING_PLANE:10000,
	renderer:'',
	scene:'',
	camera:'',

	objects:[],

	init:function (){
		console.log("Initiated.");
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(this.WIDTH,this.HEIGHT);
		var el = document.getElementById('canvas-wrapper');
		el.appendChild(this.renderer.domElement);


		this.renderer.setClearColor(0xccccff);
		this.scene = new THREE.Scene();

		this.initCamera();
		this.initScene();
		render();
	},

	initCamera:function(){

		this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE,this.ASPECT_RATIO,this.NEAR_CLIPPING_PLANE,this.FAR_CLIPPING_PLANE);
		this.camera.position.set(0,0,300);
	},

	initScene:function(){

		var radius = 100;
		var segments = 16;
		var rings = 16;
		var sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xFF0000
		});



		this.objects['sphere'] = new THREE.Mesh( new THREE.SphereGeometry(radius,segments,rings), sphereMaterial);
		this.objects['sphere'].position.y = 2;
		this.scene.add(this.objects['sphere']);

		this.objects['light'] = new THREE.PointLight(0xFFFFFF);
		this.objects['light'].position.x = 10;
		this.objects['light'].position.y = 20;
		this.objects['light'].position.z = 130;

		this.scene.add(this.objects['light']);

	},

	render:function(){

	}

}

function render(){
		Game.renderer.render(Game.scene,Game.camera);
		requestAnimationFrame(render);
}


window.onload = Game.init();