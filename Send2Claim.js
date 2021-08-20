function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function ClaimPlanet() {
	let planetFrom = "0000821101e918873b0bb18aa7018760137c33a60366a3db6409a0df44bab089";
	let planetTo = "000035f90289311b4ccadb5dc7010aba8f6ccb0f64dcb26afdf947e7f1013a95";
	let planetEnergy = Math.floor(df.getPlanetWithId(planetFrom).energy);
	df.terminal.current.printShellLn("Planet's energy: " + planetEnergy);
	let energyToSpend = planetEnergy - planetEnergy / 100;		//send 99% of planet's energy
	df.terminal.current.printShellLn("Energy sent: " + energyToSpend);
	let travelTime = df.getTimeForMove(planetFrom, planetTo);
	df.terminal.current.printShellLn("Travel time: " + travelTime);
	df.terminal.current.printShellLn("Sleep time: " + travelTime * 1000);
	df.move(planetFrom, planetTo, energyToSpend, 0);
	await sleep(travelTime * 1000);
	df.terminal.current.printShellLn("Claiming the planet");
	df.claimLocation(planetId);
	df.terminal.current.printShellLn("Done");
}
ClaimPlanet();
