function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}

let artCollec = 0;
let energySpent = 0;
let addEnergy = 10;
for(planet of df.getMyPlanets().filter(p => p.destroyed === false).filter(p => p.heldArtifactIds.length > 0)){
	for (artId of planet.heldArtifactIds){
		let candidates_ = [];
		if(df.getArtifactWithId(artId).rarity === 1){
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType === 3) // filer space rift
			.filter(p => p.planetLevel >= 2)
			.map(to => [to, distance(planet, to)])
			.sort((a, b) => a[1] - b[1]);
		}
		else if(df.getArtifactWithId(artId).rarity === 2){
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType === 3) // filer space rift
			.filter(p => p.planetLevel >= 3)
			.map(to => [to, distance(planet, to)])
			.sort((a, b) => a[1] - b[1]);
		}
		else{
			candidates_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType === 3) // filer space rift
			.filter(p => p.planetLevel >= 4)
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
				const energyNeeded = Math.ceil(energyForMove + energyForMove * addEnergy / 100);
				if (unconfirmed.length < 6 && energyLeft - energyNeeded > 0) {
					ui.setArtifactSending(artId, candidate.locationId)
					df.move(planet.locationId, candidate.locationId, energyNeeded, 0, artId);
					artCollec++;
					energySpent += energyNeeded;
				}
			}
		}
		else
		{
			let bigPlanets_ = df.getPlanetsInRange(planet.locationId, 99)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType != 1)	//Do not send to Asteroids
			.filter(p => p.planetLevel > 2)
			.map(to => [to, distance(planet, to)])
			.sort((a, b) => a[1] - b[1]);
			if(bigPlanets_.length > 0){
				for(bigPlanet of bigPlanets_){
					let nextHop_ = df.getPlanetsInRange(bigPlanet[0].locationId, 99)
					.filter(p => p.owner === df.getAccount()) //get player planets
					.filter(p => p.planetType === 3) // filer space rift
					.filter(p => p.planetLevel > 2)
					.map(to => [to, distance(bigPlanet[0], to)])
					.sort((a, b) => a[1] - b[1]);
					if(nextHop_.length > 0){
						if(df.getArtifactWithId(artId).lastActivated === 0 || df.getArtifactWithId(artId).lastActivated - df.getArtifactWithId(artId).lastDeactivated < 0){
							const energyBudget = Math.floor(planet.energy);
							const energyLeft = energyBudget - energySpent;

							// Rejected if has unconfirmed pending arrivals
							const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === bigPlanet[0].locationId)
							let energyForMove = df.getEnergyNeededForMove(planet.locationId, bigPlanet[0].locationId, 1);
							const energyNeeded = Math.ceil(energyForMove + energyForMove * addEnergy / 100);
							if (unconfirmed.length < 5 && energyLeft - energyNeeded > 0) {
								ui.setArtifactSending(artId, bigPlanet[0].locationId)
								df.move(planet.locationId, bigPlanet[0].locationId, energyNeeded, 0, artId);
								console.log(planet.locationId, artId)
								artCollec++;
								energySpent += energyNeeded;
								console.log("Found next hop for: ", artId);
							}
						}
					}
					else
					{
						console.log("Could not find next hop for: ", artId)
					}
				}
			}
			else {
				console.log("Could not find next planet with LvL > 2");
			}
		}
	}
}
df.terminal.current.printShellLn("Artifacts collected: " + artCollec);
