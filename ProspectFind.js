let artAtTime = 5;	//Prospect+Find artifacts at the same time
let pNbr = 0;
for(planet of df.getMyPlanets().filter(p => p.planetType === 2)){
    if(!planet.prospectedBlockNumber && Math.ceil(planet.energy/planet.energyCap*100) > 96 && pNbr < artAtTime){
		df.terminal.current.printShellLn(planet.locationId);
		//console.log("Planet energy: ", (Math.ceil(planet.energy/planet.energyCap*100)))
        df.prospectPlanet(planet.locationId, 1);
		df.findArtifact(planet.locationId, 1);
		pNbr++;
    }
}
df.terminal.current.printShellLn("Processed: " + pNbr + " planets");
