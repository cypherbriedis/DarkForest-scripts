let wArt = 0;
for(planet of df.getMyPlanets().filter(p => p.planetType === 3).filter(p => p.heldArtifactIds.length > 0)){
	for (i of planet.heldArtifactIds){
		//console.log(planet.locationId, "-", i)
		df.withdrawArtifact(planet.locationId, i);
		wArt++;
	}
}
console.log("Withdrawed artfacts: ", wArt);
