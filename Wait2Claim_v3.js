function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkClaimer() {
	let planetId = "000045d202a2d07ef027b6fef565e4636355bf0e6b2e8841c7e23afa07f4c093";    //planetID of planet to clime
	let myId = df.account;
	let planetClaimer = df.getPlanetWithId(planetId);
	while(planetClaimer.claimer === undefined){
		var d = new Date();
		planetClaimer = df.getPlanetWithId(planetId);
		let voyage = df.getAllVoyages().filter(p=>(p.player === df.account && p.toPlanet === planetId));
		let trTime = voyage[0].arrivalTime * 1000;
		let secLeft = trTime - Date.now();
		let enLeft = Math.floor(voyage[0].energyArriving - planetClaimer.energy * planetClaimer.defense/100);
		let inpStr = "Ok";
		if (enLeft <=0){
			inpStr = "No energy";
		}
			
		df.terminal.current.printShellLn(d.toTimeString().split(' ')[0] + " " + inpStr + " " + secLeft + "s " + enLeft);
		if(planetClaimer.owner === myId && planetClaimer.claimer === undefined){
			
				df.claimLocation(planetId);
		}
		await sleep(30000);
	}
	if(planetClaimer.claimer === myId){
		df.terminal.current.printShellLn("Yesssss, it's mine: " + planetClaimer.claimer);
	} else {
		df.terminal.current.printShellLn("Shit, i lost it: " + planetClaimer.claimer);
	}
}

async function claimPlanet() {
	let startSnark = 2000;																	//Start generating contract 2sec before arriving. Depends on how fast is PC
	let planetFrom = "000066230001a179beb7b2086e3fd5ded221beca52c94af9780f22164dec7067";	//Change to planet ID you're going FROM
	let planetTo = "000045d202a2d07ef027b6fef565e4636355bf0e6b2e8841c7e23afa07f4c093";		// Change to planet ID you're going TO
	let travelTime = df.getTimeForMove(planetFrom, planetTo);								//Just for information
	df.terminal.current.printShellLn("Travel time: " + travelTime);							//Just for information
	let voyage = df.getAllVoyages().filter(p=>(p.player === df.account && p.toPlanet === planetTo));
	let trTime = voyage[0].arrivalTime * 1000;
	let secLeft = trTime - Date.now() - startSnark;
	df.terminal.current.printShellLn("Voyage time: " + secLeft / 1000);						//Just for information
	df.terminal.current.printShellLn("Sleep time: " + secLeft);								//Just for information
	await sleep (secLeft);
	df.terminal.current.printShellLn("Claiming planet");
	df.claimLocation(planetTo);
	await sleep (10000);
	if(df.getPlanetWithId().claimer === df.account){
		df.terminal.current.printShellLn("Done!");
	} else {
		df.terminal.current.printShellLn("Something went wrong :(");
	}
}
checkClaimer();
claimPlanet();
