let captureInterval = 60000;
let stopCapture = false;

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
	df.terminal.current.printShellLn("Starting Planet Capture");
	myAccount = df.account;
	while(!stopCapture){
		df.terminal.current.printShellLn("**********Invade&Capture**********");
		df.terminal.current.printShellLn("Capture interval: " + captureInterval/60000 + "min");
		invadingPlan = 0;
		capturePln = 0;
		waitingPln = 0;
		captureZones = df.getCaptureZones();
		candidates = df.getMyPlanets().filter(p=>p.invader == "0x0000000000000000000000000000000000000000");
		for (cZ = captureZones.values(), val=null; val=cZ.next().value;){
			xCoord = val.coords.x;
			yCoord = val.coords.y;
			radiusR = 1000;
			for (planet of candidates){
				if(check_a_point(planet.location.coords.x, planet.location.coords.y, xCoord, yCoord, radiusR)){
					df.terminal.current.printShellLn("Invade: {x: " + planet.location.coords.x + ",y: " + planet.location.coords.y+"}");
					df.invadePlanet(planet.locationId);
					invadingPlan++;
				}
			}
		}
		planets = df.getMyPlanets().filter(p=>p.capturer == "0x0000000000000000000000000000000000000000" && p.invader == myAccount);
		for(planet of planets){
			
			if(planet.invadeStartBlock + 2100 < df.getEthConnection().blockNumber && planet.energy/planet.energyCap*100 >= 81){
				df.terminal.current.printShellLn("Capture: {x: " + planet.location.coords.x + ",y: " + planet.location.coords.y+"}");
				df.capturePlanet(planet.locationId);
				
				capturePln++;
			}
			else
			{
				blocksLeft = planet.invadeStartBlock + 2050 - df.getEthConnection().blockNumber;
				energyProc = Math.ceil(planet.energy/planet.energyCap*100);
				df.terminal.current.printShellLn("Planet: {x: " + planet.location.coords.x + ",y: " + planet.location.coords.y+"}");
				df.terminal.current.printShellLn("   *Blocks: " + blocksLeft);
				df.terminal.current.printShellLn("   *Energy: " + energyProc + "%");
				waitingPln++;
			}
		}
		df.terminal.current.printShellLn("Invading Planets:  " + invadingPlan);
		df.terminal.current.printShellLn("Capturing Planets: " + capturePln);
		df.terminal.current.printShellLn("Waiting2Capture:   " + waitingPln);
		df.terminal.current.printShellLn("##################################");
		await sleep(captureInterval);
	}
	df.terminal.current.printShellLn("Stopping Planet Capture");
}
capturePlanet();
