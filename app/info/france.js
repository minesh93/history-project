Game.countryArray['France'] = new Country('France');
Game.countryArray['France'].capital = 'Pin';
Game.countryArray['France'].cPos = { x: 232, y: 25, z: -314 };

Game.countryArray['France'].data[1939] = {
	occupation:'Allied',
	events:[]
}

Game.countryArray['France'].data[1940] = {
	occupation:'Allied',
	events:[]
}

Game.countryArray['France'].data[1941] = {
	occupation:'Allied',
	events:[]
}

Game.countryArray['France'].data[1942] = {
	occupation:'Axis',
	events:[]
}

Game.countryArray['France'].data[1943] = {
	occupation:'Axis',
	events:[]
}

Game.countryArray['France'].data[1944] = {
	occupation:'Allied',
	events:[
		{
			title:'D Day',
			text:'',
			models:[{
				path:'models/general/boat.DAE',
				pos:{x:200,y:25,z:-340},
				rot:{x:0,y:0,z:0}
			}]
		}
	]
}

Game.countryArray['France'].data[1945] = {
	occupation:'Allied',
	events:[]
}