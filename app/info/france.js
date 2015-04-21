Game.countryArray['France'] = new Country('France');
Game.countryArray['France'].capital = 'Pin';
Game.countryArray['France'].cPos = { x: 232, y: 25, z: -314 };

Game.countryArray['France'].data[1939] = {
	occupation:'Allied',
	events:[],
	models:[]
}

Game.countryArray['France'].data[1940] = {
	occupation:'Allied',
	events:[
		{
			title:'German Occupation',
			text:'German forces started to push into france in an attempt capture it.',
		},
	],
	models:[
		{
			path:'models/general/tank.DAE',
			pos: { x: 253, y: 48, z: -311 },
			rot:{x:0,y:83.9,z:0},
			animate:true
		},
	]
}

Game.countryArray['France'].data[1941] = {
	occupation:'Allied',
	events:[],
	models:[]
}

Game.countryArray['France'].data[1942] = {
	occupation:'Axis',
	events:[],
	models:[]
}

Game.countryArray['France'].data[1943] = {
	occupation:'Axis',
	events:[],
	models:[]
}

Game.countryArray['France'].data[1944] = {
	occupation:'Allied',
	events:[
		{
			title:'D-Day',
			text:'Britian landed in france, in an attempt to liberate France',
		},
		{
			title:'Battle For Paris',
			text:'The Allied forces pushed into Paris and liberated it from Axis rule. After Paris was liberated the Allied forced managed to push Axis forces out of France.',
		}
	],
	models:[
		{
			path:'models/general/boat.DAE',
			pos:{x:200,y:48,z:-340},
			rot:{x:0,y:0,z:0},
			animate:false
		},
		{
			path:'models/general/boat.DAE',
			pos:{x:180,y:48,z:-345},
			rot:{x:0,y:70,z:0},
			animate:false
		},
		{
			path:'models/general/tank.DAE',
			pos: {x: 200, y: 48, z: -322 },
			rot:{x:0,y:85.8,z:0},
			animate:true
		},
		{
			path:'models/general/tank.DAE',
			pos:{ x: 219, y: 48, z: -324 },
			rot:{x:0,y:85.8,z:0},
			animate:true
		},	

	]
}

Game.countryArray['France'].data[1945] = {
	occupation:'Allied',
	events:[],
	models:[]
}