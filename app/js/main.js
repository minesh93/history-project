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
	modelLoader: new THREE.ColladaLoader(),
	init:function (){
		console.log("Initiated.");

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(this.WIDTH,this.HEIGHT);

		this.modelLoader.options.convertUpAxis = true;

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
		this.camera.rotation.set(-0.47950680676215296,0.20616691477392507,-0.03438771783635605);
		this.camera.position.set(293.58995771984328,240.451532243403,-27.41075915421712);
		// this.camera.rotation.set(0.06636389772195989,-0.8648781502759016, -0.030489611766917137);
		// this.camera.position.set(-591,-287,936);
		this.controls = new THREE.FlyControls( this.camera );
		this.controls.movementSpeed = 100;
		this.controls.domElement = document.getElementById('canvas-wrapper');
		this.controls.rollSpeed = Math.PI/6;
		this.controls.autoForward = false;
		this.controls.dragToLook = true;
	},
	loadModel:function(path,callback){
		var returnModel = {};
		this.modelLoader.load(path, function ( collada ) {
			// Here we store the dae in a global variable.
			returnModel = collada.scene;

			// Position your model in the scene (world space).
			returnModel.position.x = 0;
			returnModel.position.y = 0;
			returnModel.position.z = 0;

			// Scale your model to the correct size.
			returnModel.scale.x = 1;
			returnModel.scale.y = 1;
			returnModel.scale.z = 1;
			returnModel.updateMatrix();
			// Add the model to the scene.
			Game.scene.add(returnModel);
			callback(returnModel);
		});

	},
	initScene:function(){

		this.loadModel('models/map.DAE',function(model){
			Game.objects['mapeu'] = model;
		});

		this.loadModel('models/tank.DAE',function(model){
			Game.objects['tank'] = model;
		});

		this.objects['light'] = new THREE.PointLight(0xFFFFFF,2,10000);
		this.objects['light'].position.x = 240;
		this.objects['light'].position.y = 293;
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
