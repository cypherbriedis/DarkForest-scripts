function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r) {
        return true;
    }
    return false;
}
async function capturePlanet() {
	loop = true;
	while(loop){
		captureZones = df.getCaptureZones();
		for (cZ = captureZones.values(), val=null; val=cZ.next().value;){
			xCoord = val.coords.x;
			yCoord = val.coords.y;
			radiusR = 1000;
			for (planet of df.getMyPlanets().filter(p=>p.invader == "0x0000000000000000000000000000000000000000")){
				if(check_a_point(planet.location.coords.x, planet.location.coords.y, xCoord, yCoord, radiusR)){
					df.terminal.current.printShellLn("Invading planet: " + planet.locationId);
					df.invadePlanet(planet.locationId);
				}
			}
		}
		planets = df.getMyPlanets().filter(p=>p.capturer == "0x0000000000000000000000000000000000000000" && p.invader == df.account)
		for(planet of planets){
			
			if(planet.invadeStartBlock + 2100 < df.getEthConnection().blockNumber && planet.energy/planet.energyCap*100 >= 81){
				df.terminal.current.printShellLn("Requesting:" + planet.locationId);
				df.capturePlanet(planet.locationId);
			}
			else
			{
				blocksLeft = planet.invadeStartBlock + 2100 - df.getEthConnection().blockNumber;
				energyProc = Math.ceil(planet.energy/planet.energyCap*100);
				df.terminal.current.printShellLn("Blocks Left: " + blocksLeft + " Energy: " + energyProc + " LocationId: " + planet.locationId);
			}
		}
		df.terminal.current.printShellLn("********")
		await sleep(60000);  //Check every 1min
	}
}
capturePlanet();
