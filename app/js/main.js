window.Game = {
	WIDTH:1366,
	HEIGHT:768,
	VIEW_ANGLE:45,
	ASPECT_RATIO:1366/768,
	NEAR_CLIPPING_PLANE:0.1,
	FAR_CLIPPING_PLANE:10000,
	renderer:'',
	scene:'',
	camera:'',
	controls:'',
	countryArray:[],
	currentCountry:'',
	currentTime:new Date(),
	clock:new THREE.Clock(),
	objects:[],
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

		// this.loadModel('models/redundant/Europe3d.DAE',function(model){
		// 	Game.objects['mapeu'] = model;
		// });

		this.loadModel('models/general/tank.DAE',function(model){
			Game.objects['tank'] = model;
			Game.objects['tank'].position.x = 0;
			Game.objects['tank'].position.y = 26;
			Game.objects['tank'].position.z = 0;
		});


		this.loadModel('models/general/boat.DAE',function(model){
			Game.objects['boat'] = model;
			Game.objects['boat'].position.x = 200;
			Game.objects['boat'].position.y = 23;
			Game.objects['boat'].position.z = -320;
		});

		//- Load all models for countries here
		for(var country in Game.countryArray){

			Game.countryArray[country].setModel();
			Game.countryArray[country].setCapital();
		}

		// // { x: 20, y: 5, z: -63 }
		// Game.countryArray['Britain'].setCapital('models/capitals/big-ben.DAE',0,0,0);
		// // { x: 232, y: 25, z: -314 }
		// // Game.countryArray['France'].setCapital('models/capitals/Paris.DAE',232,25,-314);
		// Game.countryArray['France'].setCapital('models/countries/france.DAE',0,30,0);
		// Game.countryArray['Germany'].setCapital('models/countries/germany.DAE',0,30,0);
		// // { x: 335, y: 26, z: -325 }
		// // Game.countryArray['Germany'].setCapital('models/capitals/Berlin.DAE',335,26,-325);

		// // Game.countryArray['Egypt'].setCapital('models/capitals/Cairo.DAE',300,26,-344);
		// // { x: 500, y: 26, z: -344 }
		// Game.countryArray['Russia'].setCapital('models/capitals/Moscow.DAE',500,26,-344);
		// // { x: 300, y: 26, z: -208 }
		// Game.countryArray['Italy'].setCapital('models/capitals/Rome.DAE',300,26,-208);

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
		}
	}

}
