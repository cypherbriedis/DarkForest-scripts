function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}


let maxEnergyToSpend = 90;
let moves = 0;
let myAccount = df.account;
for(planet of df.getMyPlanets().filter(p => (p.destroyed === false && p.heldArtifactIds.length > 0))){
	moves += sendArtifact(planet.locationId, maxEnergyToSpend);
}
df.terminal.current.printShellLn("Total Art moved: " + moves);

function sendArtifact(planetLocationId, maxEnergyToSpend){
	let energySpent = 0;
	let moves = 0;
	let planet = df.getPlanetWithId(planetLocationId);
	let unconfirmed = df.getUnconfirmedMoves().filter(move => move.from === planetLocationId)
    if (unconfirmed.length > 5) {
        return 0;
    }
	
	let candidates_ = [];
	for (artId of planet.heldArtifactIds){
		if(df.getArtifactWithId(artId).rarity === 1){
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => (
				p.owner === myAccount && //get player planets
				p.planetType === 3 && // filer space rift
				p.planetLevel >= 2))
				.map(to => [to, distance(planet, to)])
				.sort((a, b) => a[1] - b[1]);
		}
		else if(df.getArtifactWithId(artId).rarity === 2){
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => (
				p.owner === myAccount && //get player planets
				p.planetType === 3 && // filer space rift
				p.planetLevel >= 3))
				.map(to => [to, distance(planet, to)])
				.sort((a, b) => a[1] - b[1]);
		}
		else{
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => (
				p.owner === myAccount && //get player planets
				p.planetType === 3 && // filer space rift
				p.planetLevel >= 4))
				.map(to => [to, distance(planet, to)])
				.sort((a, b) => a[1] - b[1]);
		}
		if(candidates_.length > 0){
			if(df.getArtifactWithId(artId).lastActivated === 0 || df.getArtifactWithId(artId).lastActivated - df.getArtifactWithId(artId).lastDeactivated < 0){
				const energyBudget = Math.floor(planet.energy);
				const energyLeft = energyBudget - energySpent;

				// Remember its a tuple of candidates and their distance
				const candidate = candidates_[0][0];

				// Rejected if has unconfirmed pending arrivals
				const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId);
				const energyForMove = df.getEnergyNeededForMove(planet.locationId, candidate.locationId, 1);
				const energyNeeded = Math.ceil(energyForMove);
				if (unconfirmed.length < 6 && energyLeft - energyNeeded > 0) {
					ui.setArtifactSending(artId, candidate.locationId)
					df.move(planet.locationId, candidate.locationId, energyNeeded, 0, artId);
					energySpent += energyNeeded;
				}
				//console.log("Sending to SR");
				moves += 1;
			}
		} else {
			let bigPlanets_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => (
				p.owner === myAccount && //get player planets
				p.planetLevel >= 2))
				.map(to => [to, distance(planet, to)])
				.sort((a, b) => a[1] - b[1]);
			if(bigPlanets_.length > 0){
				for(bigPlanet of bigPlanets_){
					let nextHop_ = df.getPlanetsInRange(bigPlanet[0].locationId, 99)
					.filter(p => (
						p.owner === myAccount && //get player planets
						p.planetType === 3 && // filer space rift
						p.planetLevel >= 2))
						.map(to => [to, distance(bigPlanet[0], to)])
						.sort((a, b) => a[1] - b[1]);
					if(nextHop_.length > 0){
						if(df.getArtifactWithId(artId).lastActivated === 0 || df.getArtifactWithId(artId).lastActivated - df.getArtifactWithId(artId).lastDeactivated < 0){
							const bEnergyBudget = Math.floor(planet.energy);
							const bEnergyLeft = bEnergyBudget - energySpent;
							// Rejected if has unconfirmed pending arrivals
							const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === bigPlanet[0].locationId)
							let energyForMove = df.getEnergyNeededForMove(planet.locationId, bigPlanet[0].locationId, 1);
							const bEnergyNeeded = Math.ceil(energyForMove);
							if (unconfirmed.length < 5 && bEnergyLeft - bEnergyNeeded > 0) {
								ui.setArtifactSending(artId, bigPlanet[0].locationId);
								df.move(planet.locationId, bigPlanet[0].locationId, bEnergyNeeded, 0, artId);
								energySpent += bEnergyNeeded;
								moves += 1;
								return moves;
							} else {
								//console.log("Could not find next hop for: ", planet)
							}
						}
					}
				}
			}
		}
		
	}
	return moves;
}
