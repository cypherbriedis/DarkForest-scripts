/*
Send Voyage to planet you want to claim. When MOVE is confirmed, run this script.
*/

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function claimPlanet() {
	let startSnark = 2000;																	//Start generating contract 2sec before arriving. Depends on how fast is PC
	let planetFrom = "0000673e02adb2e5c5671eef4626b94d19f7adb9dce797a0e3342487cefe15e4";	//Change to planet ID you're going FROM
	let planetTo = "0000544f0e5834319a1ae415f6c5c16c1870df67f44d804b31da216ff00a3f37";		// Change to planet ID you're going TO
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
claimPlanet();
