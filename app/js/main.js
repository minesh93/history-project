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
	controls:'',
	//-
	countryArray:[],
	currentCountry:'',
	now:0,
	currentTime:new Date(),
	clock:new THREE.Clock(),
	objects:[],
	rise:false,
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
		this.render();
	},

	initCamera:function(){

		this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE,this.ASPECT_RATIO,this.NEAR_CLIPPING_PLANE,this.FAR_CLIPPING_PLANE);
		// 0.06636389772195989, _y: -0.8648781502759016, _z: -0.030489611766917137
		// -591.0329190552981, y: -287.87343007596024, z: 936.1095241470686
		this.camera.rotation.set(0,0,0);
		this.camera.position.set(0,0,400);
		this.camera.rotation.set(0.06636389772195989,-0.8648781502759016, -0.030489611766917137);
		this.camera.position.set(-591,-287,936);
		this.controls = new THREE.FlyControls( this.camera );
		this.controls.movementSpeed = 100;
		this.controls.domElement = document.getElementById('canvas-wrapper');
		this.controls.rollSpeed = Math.PI/6;
		this.controls.autoForward = false;
		this.controls.dragToLook = true;
	},

	initScene:function(){

		var radius = 100;
		var segments = 16;
		var rings = 3;
		var sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xFF0000
		});

		this.scene.add(Game.countryArray.France.getModel());

		this.objects['light'] = new THREE.PointLight(0xFFFFFF,2,10000);
		this.objects['light'].position.x = -50;
		this.objects['light'].position.y = -100;
		this.objects['light'].position.z = 200;

		this.scene.add(this.objects['light']);

	},

	animate:function(deltaTime){
			// Game.countryArray.France.raise(deltaTime);
	},


	render:function(){
		Game.renderer.render(Game.scene,Game.camera);
		var deltaTime = Game.clock.getDelta();
		Game.controls.update(deltaTime);
		Game.animate(deltaTime);
		requestAnimationFrame(Game.render);
	},

	country:{
		getByName:function(name){
			return Game.countryArray[name];
		},
		getByNameYear:function(name,year){
			return Game.countryArray[name].data[year];
		},

	}

}
