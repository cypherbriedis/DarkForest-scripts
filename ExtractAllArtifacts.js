function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}

let artCollec = 0
for(planet of df.getMyPlanets().filter(p => p.heldArtifactIds.length > 0)){
	const candidates_ = df.getPlanetsInRange(planet.locationId, 99)
		.filter(p => p.owner === df.getAccount()) //get player planets
		.filter(p => p.planetType === 3) // filer planet or space rift 
		.map(to => [to, distance(planet, to)])
		.sort((a, b) => a[1] - b[1]);
	if(candidates_.length > 0){
		for (artId of planet.heldArtifactIds){
			if(!df.getArtifactWithId(artId).isInititalized){
				const energyBudget = Math.floor(99 * planet.energy);

				let energySpent = 0;
				const energyLeft = energyBudget - energySpent;

				// Remember its a tuple of candidates and their distance
				const candidate = candidates_[i++][0];

				// Rejected if has unconfirmed pending arrivals
				const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
				if (unconfirmed.length !== 0) {
				  continue;
				}


				// needs to be a whole number for the contract
				const energyNeeded = Math.ceil(df.getEnergyNeededForMove(planet.locationId, candidate.locationId, 1));
				if (energyLeft - energyNeeded < 0) {
				  continue;
				}
				ui.setArtifactSending(artId, candidate.locationId)
				df.move(planet.locationId, candidate.locationId, energyNeeded, 0, artId);
				artCollec++;
				energySpent += energyNeeded;
			}
		}
	}
}
console.log("Artifacts collected: ", artCollec);
