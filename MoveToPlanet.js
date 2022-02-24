let tragetPlanet = "00007726000b19ad974c64223907943ea59693027cffd1d15b79cf1fd89f4bf4";
let srcPlanetList = ["000080dd258235c64b936add1c10dfd166adf711ec55376381de41402670768e"];

function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveToNewHome(){
	while(true){
		console.log("Starting Main Loop");
		df.terminal.current.printShellLn("Starting a move");
		moveStatus = false;
		lastHop = "";
		timeForMove = 0;
		energyFull = false;
		abandonPlanet = false;
		console.log(srcPlanetList);
		srcPlnObj = df.getPlanetWithId(srcPlanetList[srcPlanetList.length - 1]);
		trgPlnObj = df.getPlanetWithId(tragetPlanet);
		candidates = df.getPlanetsInRange(srcPlnObj.locationId, 99)
			.filter(p => (
				p.owner === "0x0000000000000000000000000000000000000000" &&
				p.planetLevel >= 1))
			.map(to => [to, distance(trgPlnObj, to)])
			.sort((a, b) => a[1] - b[1]);
		for (cand of candidates){
			if(df.getEnergyNeededForMove(srcPlnObj.locationId, cand[0].locationId, Math.floor(cand[0].energy*10)) < srcPlnObj.energy && df.getAllVoyages().filter(p => p.toPlanet === cand[0].locationId).length == 0){
				console.log(cand[0].locationId);
				moveTx = df.move(srcPlnObj.locationId, cand[0].locationId, Math.floor(srcPlnObj.energy*.99), Math.floor(srcPlnObj.silver));
				console.log(moveTx.hash);
				unconf = true;
				while(unconf){
					console.log("Waiting for move confirmation");
					if(df.getUnconfirmedMoves().filter(move => move.from === srcPlnObj.locationId) == 0){
						unconf = false;
						move2start = true;
						df.terminal.current.printShellLn("Move confirmed");
					}
					await sleep(5000);
				}
				
				while(move2start){
					console.log("Waiting for move to start");
					if(df.getAllVoyages().filter(p => (
									p.toPlanet === srcPlnObj.locationId &&
									p.fromPlanet === cand[0].locationId)) == 0){
						move2start = false;
						lastHop = cand[0].locationId;
						df.terminal.current.printShellLn("Move started");
					}
					await sleep(5000);
				}
				moveStatus = true;
				timeForMove = df.getTimeForMove(srcPlnObj.locationId, cand[0].locationId);
				console.log("Time for move: " + timeForMove + "sec");
				df.terminal.current.printShellLn("Time for a move: " + timeForMove + "sec")
				break;
			}
		}
		while(moveStatus){
			if(df.getPlanetWithId(lastHop).owner === df.account){
				srcPlanetList.push(cand[0].locationId);
				console.log("Move finised");
				moveStatus = false;
				energyFull = false;
				df.terminal.current.printShellLn("Move finished")
			}
			console.log("Waiting for move to finish");
			await sleep(60000);
		}
		
		while(!energyFull){
			if(df.getPlanetWithId(lastHop).energy*100/df.getPlanetWithId(lastHop).energyCap > 90){
				energyFull = true;
				junkAm = df.getPlayerSpaceJunk(df.account);
				console.log("Abandone old planet, junk = " + junkAm);
				df.move(srcPlanetList[srcPlanetList.length-3], srcPlanetList[srcPlanetList.length-2],0,0,0,true);
				while(junkAm <= df.getPlayerSpaceJunk(df.account)){
					console.log("Waiting for planet purge");
					await sleep(5000);
				}
				df.terminal.current.printShellLn("Old planet abandoned");
				junkAm = df.getPlayerSpaceJunk(df.account);
				console.log("Abandone old planet, junk = " + junkAm);
				console.log("Ready for next move");
				df.terminal.current.printShellLn("Ready for a next move");
			}
			await sleep(60000);
		}
	}
}
moveToNewHome()
