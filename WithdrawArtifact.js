let wArt = 0;
for(planet of df.getMyPlanets().filter(p => p.planetType === 3).filter(p => p.heldArtifactIds.length > 0)){
	for (i of planet.heldArtifactIds){
		console.log(planet.locationId, i)
		if(planet.planetLevel >= df.getArtifactWithId(i).rarity){
			df.withdrawArtifact(planet.locationId, i);
			wArt++;
		}
		else {
		 console.log("Space rift LvL too small: ", planet.planetLevel, df.getArtifactWithId(i).rarity);
		}
	}
}
console.log("Withdrawed artfacts: ", wArt);
