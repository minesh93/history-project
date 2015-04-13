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
    projector: '',
    selected:'',
    prevSelected:'',
    clickSelected:'',
    clickPrevSelected:'',
    mouseOn:'',
    mouse: new THREE.Vector2(0, 0),
    currentTime: new Date(),
    cameraMoving:false,
    cameraTarget:{},
    clock: new THREE.Clock(),
    objects: [],
    //- don't know if you class a spitfire as ambient
    ambientObjects: [],
    x:-5,
    y:-65.2,
    z:0,
    loaded:false,
    currentYear:1939,
    axisTexture:'',
    alliesTexture:'',
    neutralTexture:'',
    modelLoader: new THREE.ColladaLoader(),
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

        document.addEventListener('dblclick', Game.onDocumentMouseDown, false);
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
        // 0.06636389772195989, _y: -0.8648781502759016, _z: -0.030489611766917137
        // -591.0329190552981, y: -287.87343007596024, z: 936.1095241470686
        this.camera.rotation.set(-0.47950680676215296, 0.20616691477392507, -0.03438771783635605);
        this.camera.position.set(293.58995771984328, 240.451532243403, -27.41075915421712);
        // this.camera.rotation.set(0.06636389772195989,-0.8648781502759016, -0.030489611766917137);
        // this.camera.position.set(-591,-287,936);
        this.controls = new THREE.FlyControls(this.camera);
        this.controls.movementSpeed = 300;
        this.controls.domElement = document.getElementById('canvas-wrapper');
        this.controls.rollSpeed = Math.PI / 3;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;
    },
    loadModel: function (path, callback) {
        var returnModel = {};
        this.modelLoader.load(path, function (collada) {
            // Here we store the dae in a global variable.
            returnModel = collada.scene;

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

        this.loadModel('models/general/spitfire.DAE', function (model) {
            Game.ambientObjects['spitfire'] = model;
            Game.ambientObjects['spitfire'].position.x = 230;
            Game.ambientObjects['spitfire'].position.y = 75;
            Game.ambientObjects['spitfire'].position.z = -384;
        });



        this.loadModel('models/general/tank.DAE', function (model) {
            Game.objects['tank'] = model;
            Game.objects['tank'].position.x = 232;
            Game.objects['tank'].position.y = 25;
            Game.objects['tank'].position.z = -314;
        });

       // this.loadModel('models/ui/YearDial.DAE', function (model) {
       //      Game.objects['dial'] = model;
       //      Game.objects['dial'].scale.set(0.5,0.5,0.5);
       //      Game.objects['dial'].rotation.x = 1.0000000000000004;
       //      Game.objects['dial']
       //      Game.uiScene.add(Game.objects['dial']);
       //      Game.loadModel('models/ui/YearPointer.DAE', function (model) {
       //          Game.objects['pointer'] = model;
       //          Game.objects['pointer'].scale.set(0.3,0.3,0.3);

       //          // Game.objects['pointer'].rotation.y = -3.0000000000000004;
       //          Game.objects['pointer'].rotation.x = 0.7;
       //          Game.uiScene.add(Game.objects['pointer']);
       //          Game.loaded = true;
       //      });
       //  });



        //- Load all models for countries here
        for (var country in Game.countryArray) {
            Game.countryArray[country].setModel();
            Game.countryArray[country].setCapital();
        }



        this.loadModel('models/general/boat.DAE', function (model) {
            Game.objects['boat'] = model;
            Game.objects['boat'].position.x = 200;
            Game.objects['boat'].position.y = 25;
            Game.objects['boat'].position.z = -340;
        });

        this.loadModel('models/general/boat.DAE', function (model) {
            Game.objects['boat2'] = model;
            Game.objects['boat2'].position.x = 180;
            Game.objects['boat2'].position.y = 25;
            Game.objects['boat2'].position.z = -345;
            Game.objects['boat2'].rotation.y = 70;
        });


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

    },

    animate: function (deltaTime) {

        if(Game.loaded){
            var zCamVec = new THREE.Vector3(0,0,1);
            var position = Game.camera.localToWorld(zCamVec);
            
            Game.objects['pointer'].position.set(position.x - 100 + Game.x, position.y - 120 + Game.y, position.z - 200 + Game.z);
            Game.objects['dial'].position.set(position.x - 100, position.y - 200, position.z - 200);
            // Game.objects['dial'].position.applyMatrix4( Game.camera.matrixWorld );
            // Game.objects['pointer'].position.applyMatrix4( Game.camera.matrixWorld );
            // Game.objects.dial.rotation.y += deltaTime;
        }

        if(Game.cameraMoving){
            // var pos = ;
            Game.camera.lookAt(Game.cameraTarget);


            var current = Game.camera.position;
            var target = Game.cameraTarget;
            var diff = {};
            diff.x = Math.abs(current.x - target.x);
            diff.y = Math.abs(current.y - target.y);
            diff.z = Math.abs(current.z - target.z);


            if(diff.x > 50){
                if(current.x > target.x){
                    Game.camera.position.x -= diff.x/60;
                } else {
                    Game.camera.position.x += diff.x/60;
                }
            } 

            if(diff.y > 50){
                if(current.y > target.y){
                    Game.camera.position.y -= diff.y/60;
                } else {
                    Game.camera.position.y += diff.y/60;
                }            
            }

            if(diff.z > 50){
                if(current.z > target.z){
                    Game.camera.position.z -= diff.z/60;
                } else {
                    Game.camera.position.z += diff.z/60;
                }            
            }

            if((diff.x + diff.y + diff.z) < 150){
                Game.cameraMoving = false;
            }

        }


        for (var country in Game.countryArray) {
            Game.countryArray[country].animate();
        }
    },

    loopAnimations: function(){
        for (var object in Game.objects) {
            // console.log(object);
            for (var i = 0; i < Game.objects[object].keyFrameAnimations.length; i++) {
               var currentAnimation = Game.objects[object].keyFrameAnimations[i];
                if(currentAnimation.currentTime == currentAnimation.data.length){
                    currentAnimation.stop();
                }
            };
        }

        for (var object in Game.ambientObjects) {
            // console.log(object);
            for (var i = 0; i < Game.ambientObjects[object].keyFrameAnimations.length; i++) {
               var currentAnimation = Game.ambientObjects[object].keyFrameAnimations[i];
               if(currentAnimation.isPlaying && !currentAnimation.isPaused){
                    //console.log("Reached End");
                    if(currentAnimation.currentTime == currentAnimation.data.length){
                        //console.log("End");
                        currentAnimation.currentTime = 0;
                        currentAnimation.stop();
                    }
                } else {
                    currentAnimation.play();
                }
            };
        }

        for (var country in Game.countryArray) {
            //console.log(country);
            if(Game.countryArray[country].getCapital().keyFrameAnimations !== undefined){
                for (var i = 0; i < Game.countryArray[country].getCapital().keyFrameAnimations.length; i++) {
                    var currentAnimation = Game.countryArray[country].getCapital().keyFrameAnimations[i];
                    if(currentAnimation.isPlaying && !currentAnimation.isPaused){
                        //console.log("Reached End");
                        if(currentAnimation.currentTime == currentAnimation.data.length){
                            //console.log("End");
                            currentAnimation.currentTime = 0;
                            currentAnimation.stop();
                        }
                    } else {
                        currentAnimation.play();
                    }
                }; 
            }

        }

    },

    render: function () {
        var deltaTime = Game.clock.getDelta();
        Game.controls.update(deltaTime);
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

    country: {
        getByName: function (name) {
            return Game.countryArray[name];
        },

        getByNameYear: function (name, year) {
            return Game.countryArray[name].data[year];
        }
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

        document.getElementById("current-year").innerHTML = Game.currentYear;        

        for (var country in Game.countryArray) {
            Game.countryArray[country].setOccupationTexture();
        }

    },

    onKeyPress: function(event){
        // console.log(event.key);
        switch(event.key){
            case "h":
                Game.incYear();
                break
        }
    },

    onDocumentMouseDown: function (event) {
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
				    Game.countryArray[Game.clickSelected].active = true;
                    console.log(Game.countryArray[Game.clickSelected].name + " is active");
                    Game.cameraTarget = Game.countryArray[Game.clickSelected].getCapital().position;
                    Game.cameraMoving = true;
                }

                if(Game.countryArray[Game.clickPrevSelected]){
				    Game.countryArray[Game.clickPrevSelected].active = false;
                    console.log(Game.countryArray[Game.clickPrevSelected].name + " is inactive");
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
