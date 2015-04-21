window.Game = {
    WIDTH: 1366,
    HEIGHT: 768,
    VIEW_ANGLE: 45,
    ASPECT_RATIO: 1366 / 768,
    NEAR_CLIPPING_PLANE: 0.1,
    FAR_CLIPPING_PLANE: 10000,
    renderer: '',
    scene: '',
    uiScene:'',
    camera: '',
    controls: '',
    countryArray: [],

    currentCountry: '',
    userState:'IDLE',

    projector: '',
    selected:'',
    prevSelected:'',
    clickSelected:'',
    clickPrevSelected:'',

    mouse: new THREE.Vector2(0, 0),
    currentTime: new Date(),

    cameraLock:false,
    cameraMoving:false,

    cameraCity:{},
    cameraTarget:{},
    cameraInitial:{},

    clock: new THREE.Clock(),
    objects: [],
    ambientObjects: [],

    loaded:false,
    currentYear:1939,
    axisTexture:'',
    alliesTexture:'',
    neutralTexture:'',
    modelLoader: new THREE.ColladaLoader(),

    frameNum: 0,

    init: function () {
        console.log("Initiated.");

        console.log(this.HEIGHT);
        this.HEIGHT = window.innerHeight;
        console.log(this.HEIGHT);
        this.WIDTH = window.innerWidth;
        this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;
        console.log(this.ASPECT_RATIO);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.projector = new THREE.Projector();
        this.modelLoader.options.convertUpAxis = true;

        var el = document.getElementById('canvas-wrapper');
        el.appendChild(this.renderer.domElement);

        window.addEventListener('resize', Game.onWindowResize, false);

        document.addEventListener('dblclick', Game.onDocumentMouseClick, false);
		document.addEventListener('keypress', Game.onKeyPress, false);
        document.addEventListener('mousemove', Game.onDocumentMouseMove, false);

        this.renderer.setClearColor(0x354e77);
        this.renderer.autoClear = false;
        this.scene = new THREE.Scene();
        this.uiScene = new THREE.Scene();

        this.initCamera();
        this.initScene();
        this.render();
    },

    initCamera: function () {

        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT_RATIO, this.NEAR_CLIPPING_PLANE, this.FAR_CLIPPING_PLANE);

        this.camera.rotation.set(-1.1334485586118261, 0.022009294869930782, -0.07153258340446002);
        this.camera.position.set(361.7766252744028, 533.4988933764232, -2.291261939595149);

        this.controls = new THREE.FlyControls(this.camera);
        this.controls.movementSpeed = 300;
        this.controls.domElement = document.getElementById('canvas-wrapper');
        this.controls.rollSpeed = Math.PI / 3;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;
    },
    loadModel: function (path, index, callback) {
        var returnModel = {};
        this.modelLoader.load(path, function (collada) {
            // Here we store the dae in a global variable.
            returnModel = collada.scene;
            returnModel.lookUpIndex = index;
            // Scale your model to the correct size.
            returnModel.keyFrameAnimations = [];
            returnModel.scale.x = 1;
            returnModel.scale.y = 1;
            returnModel.scale.z = 1;
            returnModel.updateMatrix();

            animationsLength = collada.animations.length;
            animations = collada.animations;

            for (var i = 0; i < animationsLength; i++) {
                var animation = animations[i];

                var keyFrameAnimation = new THREE.KeyFrameAnimation(animation);
                keyFrameAnimation.timeScale = 1;
                keyFrameAnimation.loop = false;
                returnModel.keyFrameAnimations.push(keyFrameAnimation);
            }

            // Add the model to the scene.
            Game.scene.add(returnModel);
            callback(returnModel);
        });

    },
    initScene: function () {

        this.axisTexture = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('models/countries/images/0_axis.jpg') } );
        this.alliedTexture = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('models/countries/images/0_allied.jpg') } );
        this.neutralTexture = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('models/countries/images/0_neutral.jpg') } );

        this.loadModel('models/general/spitfire.DAE',0, function (model) {
            Game.ambientObjects['spitfire'] = model;
            Game.ambientObjects['spitfire'].position.x = 230;
            Game.ambientObjects['spitfire'].position.y = 75;
            Game.ambientObjects['spitfire'].position.z = -384;
        });

        this.loadModel('models/ui/dial.DAE',0, function (model) {
            Game.objects['dial'] = model;
            Game.objects['dial'].scale.set(0.5,0.5,0.5);
            Game.objects['dial'].rotation.x = -1.25;
            Game.objects['dial'].rotation.y = 0.25;
            Game.objects['dial']
            Game.uiScene.add(Game.objects['dial']);
              
            Game.loadModel('models/ui/pointer.DAE',0, function (model) {
                Game.objects['pointer'] = model;
                Game.objects['pointer'].scale.set(0.8,0.8,0.8);
                //Game.objects['pointer'].rotation.x = -1.25;
                Game.objects['pointer'].rotation.y = -0.07;
                // Game.objects['pointer'].rotation.y = -3.0000000000000004;
                Game.objects['pointer'].rotation.x = 0.7;
                Game.uiScene.add(Game.objects['pointer']);
                          
                Game.loaded = true;
            });

              
          }); 

        //- Load all models for countries here
        for (var country in Game.countryArray) {
            Game.countryArray[country].loadModels();
        }

        this.light = new THREE.PointLight(0xFFFFFF, 2, 10000);
        this.light.position.x = 240;
        this.light.position.y = 293;
        this.light.position.z = 200;

        this.scene.add(this.light);

        this.uiLight = new THREE.PointLight(0xFFFFFF, 2, 10000);
        this.uiLight.position.x = 240;
        this.uiLight.position.y = 293;
        this.uiLight.position.z = 200;

        this.uiScene.add(this.uiLight);

        this.uiLightTwo = new THREE.PointLight(0xFFFFFF, 2, 10000);
        this.uiLightTwo.position.x = 240;
        this.uiLightTwo.position.y = 293;
        this.uiLightTwo.position.z = 200;

        this.uiScene.add(this.uiLightTwo);

    },

    returnCamera:function(){
        
        if(Game.countryArray[Game.clickSelected] !== undefined){
            Game.countryArray[Game.clickSelected].deactivate();
            Game.countryArray[Game.clickSelected].state = "lowering";
        }

        if(Game.countryArray[Game.clickPrevSelected] !== undefined){
            Game.countryArray[Game.clickPrevSelected].deactivate();
        }
        
        Game.clickSelected = '';
        Game.clickPrevSelected = '';
        Game.cameraTarget = Game.cameraInitial;
        Game.userState = 'IDLE';
        Game.cameraMoving = true;
    },

    animate: function (deltaTime) {

        if(Game.loaded){
            var zCamVec = new THREE.Vector3(0,0,1);
            var position = Game.camera.localToWorld(zCamVec);
            
            Game.objects['dial'].position.set(position.x - 150, position.y - 300, position.z - 70);
            Game.objects['pointer'].position.set(position.x - 140, position.y - 280, position.z - 25);

            this.uiLightTwo.position.x = Game.objects['pointer'].position.x - 10;
            this.uiLightTwo.position.y = Game.objects['pointer'].position.y - 10;
            this.uiLightTwo.position.z = Game.objects['pointer'].position.z - 100;
        }

        if(Game.cameraMoving && Game.cameraLock){
            var distanceDiff = 20;
            var speedFactor = 10;
            if(Game.userState == 'SELECTED'){
                distanceDiff = 50;
                speedFactor = 15;
            }
            Game.camera.lookAt(Game.cameraCity);

            var current = Game.camera.position;
            var target = Game.cameraTarget;

            var diff = {};
            diff.x = Math.abs(current.x - target.x);
            diff.y = Math.abs(current.y - target.y);
            diff.z = Math.abs(current.z - target.z);

            console.log(diff);
            if(diff.x > distanceDiff){
                if(current.x > target.x){
                    Game.camera.position.x -= diff.x/speedFactor;
                } else {
                    Game.camera.position.x += diff.x/speedFactor;
                }
            } 

            if(diff.y > distanceDiff){
                if(current.y > target.y){
                    Game.camera.position.y -= diff.y/speedFactor;
                } else {
                    Game.camera.position.y += diff.y/speedFactor;
                }            
            }

            if(diff.z > distanceDiff){
                if(current.z > target.z){
                    Game.camera.position.z -= diff.z/speedFactor;
                } else {
                    Game.camera.position.z += diff.z/speedFactor;
                }            
            }

            if((diff.x + diff.y + diff.z) < distanceDiff*3){
                Game.cameraMoving = false;
                if(Game.userState != 'SELECTED'){
                    Game.cameraLock = false;
                }
            }
        }

        for (var country in Game.countryArray) {
            Game.countryArray[country].animate();
        }
    },

    animateDial:function(){
    if(Game.frameNum == 6){
     Game.frameNum = 0;
    
    }

    switch(Game.frameNum) {
        case 0:
            Game.objects['dial'].rotation.z = -1;
            break;
        case 1:
            Game.objects['dial'].rotation.z = -2.25;
            break;
        case 2:
            Game.objects['dial'].rotation.z = -3.25;
            break;
        case 3:
            Game.objects['dial'].rotation.z = -4.3;
            break;
        case 4:
            Game.objects['dial'].rotation.z = -5.50;
            break;
        case 5:
            Game.objects['dial'].rotation.z = -6.4;
            break;
        default:

    }
        
    Game.frameNum = Game.frameNum + 1;
        
    
    },

    loopAnimations: function(){
        for (var object in Game.ambientObjects) {

            for (var i = 0; i < Game.ambientObjects[object].keyFrameAnimations.length; i++) {
               var currentAnimation = Game.ambientObjects[object].keyFrameAnimations[i];
               if(currentAnimation.isPlaying && !currentAnimation.isPaused){
                    if(currentAnimation.currentTime == currentAnimation.data.length){
                        currentAnimation.currentTime = 0;
                        currentAnimation.stop();
                    }
                } else {
                    currentAnimation.play();
                }
            }
        }

        for (var country in Game.countryArray) {
            if(Game.countryArray[country].getCapital().keyFrameAnimations !== undefined){
                for (var i = 0; i < Game.countryArray[country].getCapital().keyFrameAnimations.length; i++) {
                    var currentAnimation = Game.countryArray[country].getCapital().keyFrameAnimations[i];
                    if(currentAnimation.isPlaying && !currentAnimation.isPaused){
                        if(currentAnimation.currentTime == currentAnimation.data.length){
                            currentAnimation.currentTime = 0;
                            currentAnimation.stop();
                        }
                    } else {
                        currentAnimation.play();
                    }
                } 
            }
        }

        if(Game.countryArray[Game.clickSelected] !== undefined){
            var models = Game.countryArray[Game.clickSelected].data[Game.currentYear].models;
            for (var i = 0; i < models.length; i++) {
                var currentModel = models[i];
                if(currentModel.hasAnimations){
                    currentAnimation = currentModel.keyFrameAnimations[0];
                    if(currentAnimation.isPlaying && !currentAnimation.isPaused){
                        if(currentAnimation.currentTime == currentAnimation.data.length){
                            currentAnimation.currentTime = 0;
                            currentAnimation.stop();
                        }
                    } else {
                        currentAnimation.play();
                    }
                }
            }
        }

    },

    render: function () {
        var deltaTime = Game.clock.getDelta();
        if(!Game.cameraLock){
            Game.controls.update(deltaTime);
        }
        Game.animate(deltaTime);
        THREE.AnimationHandler.update(deltaTime);
        Game.loopAnimations();
        Game.renderer.clear();                    
        Game.renderer.render(Game.scene, Game.camera);   
        Game.renderer.clearDepth();               
        Game.renderer.render( Game.uiScene, Game.camera );   
        requestAnimationFrame(Game.render);
    },


    setText:function(){
        document.getElementById("current-country").innerHTML = Game.countryArray[Game.selected].name;
        document.getElementById("current-occupation").innerHTML = Game.countryArray[Game.selected].getOccupation();
    },

    clearText:function(){
        document.getElementById("current-country").innerHTML = "";
        document.getElementById("current-occupation").innerHTML = "";
    },

    onWindowResize: function () {
        Game.WIDTH = window.innerWidth;
        Game.HEIGHT = window.innerHeight;
        Game.camera.aspect = Game.WIDTH / Game.HEIGHT;
        Game.camera.updateProjectionMatrix();
        Game.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    incYear:function(){
        Game.currentYear++;
        if(Game.currentYear == 1946){
            Game.currentYear = 1939;
        }

        Game.animateDial();
        document.getElementById("current-year").innerHTML = Game.currentYear;        

        for (var country in Game.countryArray) {
            Game.countryArray[country].setOccupationTexture();
        }

        if(Game.countryArray[Game.clickSelected] !== undefined){
            Game.countryArray[Game.clickSelected].activate();
        }


    },

    onKeyPress: function(event){
        if(event.charCode == 32){
            Game.incYear();
        }
        if(event.charCode == 104){
            Game.toggleControls();
        }
        console.log(event.keyCode)
        if(event.keyCode == 27){
            Game.returnCamera();
        }

    },


    toggleControls:function(){
        document.getElementById("controls").classList.toggle('active');
    },

    onDocumentMouseClick: function (event) {
        event.preventDefault();
        console.log("Clicked");
		// Ray casting
        Game.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Game.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var vector = new THREE.Vector3(Game.mouse.x, Game.mouse.y, 0.5);

        Game.projector.unprojectVector(vector, Game.camera);
        var raycaster = new THREE.Raycaster(Game.camera.position, vector.sub(Game.camera.position).normalize());

        var intersects = raycaster.intersectObjects(Game.scene.children, true);

		// Doing something with returned object
        if (intersects.length) {
            Game.clickPrevSelected = Game.clickSelected;
            if(intersects[0].object.parent.name != Game.clickSelected){
                Game.clickSelected = intersects[0].object.parent.name;
				
				// Make this object active / old object inactive

                if(Game.countryArray[Game.clickSelected] !== undefined){
                    Game.userState = 'SELECTED';
                    Game.countryArray[Game.clickSelected].activate();

                    Game.cameraLock = true;
                    Game.cameraMoving = true;

                    Game.cameraInitial = new THREE.Vector3(Game.camera.position.x,Game.camera.position.y,Game.camera.position.z);
                    Game.cameraCity = Game.countryArray[Game.clickSelected].getCapital().position;
                    Game.cameraTarget = Game.countryArray[Game.clickSelected].getCapital().position;
                }

                if(Game.countryArray[Game.clickPrevSelected]){
                    Game.countryArray[Game.clickPrevSelected].deactivate();
                }

				// Game.countryArray[Game.clickSelected].active = true;
				// Game.countryArray[Game.clickPrevSelected].active = false;

            }
        }
    },

	onDocumentMouseMove: function (event) {
        event.preventDefault();
		
		// Ray casting
        Game.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Game.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var vector = new THREE.Vector3(Game.mouse.x, Game.mouse.y, 0.5);

        Game.projector.unprojectVector(vector, Game.camera);
        var raycaster = new THREE.Raycaster(Game.camera.position, vector.sub(Game.camera.position).normalize());

        var intersects = raycaster.intersectObjects(Game.scene.children, true);

		// Doing something with returned object
        if (intersects.length) {
            //Game.prevSelected = Game.selected;
            if (intersects[0].object.parent.name != Game.selected) {
                Game.prevSelected = Game.selected;
                Game.selected = intersects[0].object.parent.name;
                Game.setText();
                
                if (Game.countryArray[Game.selected] != null) {
                    Game.countryArray[Game.selected].state = "raising";
                }
                if (Game.countryArray[Game.prevSelected] != null) {
                    Game.countryArray[Game.prevSelected].state = "lowering";
                }
            }
        } else {
            Game.clearText();
            if (Game.countryArray[Game.selected] != null) {
                Game.countryArray[Game.selected].state = "lowering";
            }
            if (Game.countryArray[Game.prevSelected] != null){
                Game.countryArray[Game.prevSelected].state = "lowering";
            }
            Game.prevSelected = "";
            Game.selected = "";
        }
    }

}
