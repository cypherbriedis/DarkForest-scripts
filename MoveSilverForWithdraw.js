function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}
sTotal = 0;
sTotalMoved = 0;

for(planet of df.getMyPlanets().filter(p => p.planetType === 1).filter(p => p.planetLevel <= 4).filter(p => p.planetLevel >= 3)){
	if (Math.floor(planet.silver)/planet.silverCap > 0.75){
		const candidates_ = df.getPlanetsInRange(planet.locationId, 85)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType === 3) // filer planet or space rift 
			.filter(p => p.planetLevel >= 4) // filer level
			.map(to => [to, distance(planet, to)])
			.sort((a, b) => a[1] - b[1]);
		if(candidates_.length > 0){
		  let i = 0;
		  const energyBudget = Math.floor(85 * planet.energy);
		  const silverBudget = Math.floor(planet.silver);

		  let energySpent = 0;
		  let silverSpent = 0;
		  while (energyBudget - energySpent > 0 && i < candidates_.length) {

			const silverLeft = silverBudget - silverSpent;
			const energyLeft = energyBudget - energySpent;

			// Remember its a tuple of candidates and their distance
			const candidate = candidates_[i++][0];

			// Rejected if has unconfirmed pending arrivals
			const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
			if (unconfirmed.length !== 0) {
			  continue;
			}

			
			let silverRequested = Math.ceil(candidate.silverCap - candidate.silver);
			for (s of df.getAllVoyages().filter(p => p.toPlanet === candidate.locationId)){
				silverRequested -= s.silverMoved;
			}
			const silverNeeded = silverRequested > silverLeft ? silverLeft : silverRequested;


			// Setting a 100 silver guard here, but we could set this to 0
			if (silverNeeded < 100) {
			  continue;
			}

			// needs to be a whole number for the contract
			const energyNeeded = Math.ceil(df.getEnergyNeededForMove(planet.locationId, candidate.locationId, 1));
			if (energyLeft - energyNeeded < 0) {
			  continue;
			}

			df.move(planet.locationId, candidate.locationId, energyNeeded, silverNeeded);
			sTotal +=  silverNeeded;
			energySpent += energyNeeded;
			silverSpent += silverNeeded;
		  }
		} else {
		  const candidates2_ = df.getPlanetsInRange(planet.locationId, 85)
			.filter(p => p.owner === df.getAccount()) //get player planets
			.filter(p => p.planetType === 1) // filer planet or space rift 
			.filter(p => p.planetLevel >= 5) // filer level
			.map(to => [to, distance(planet, to)])
			.sort((a, b) => a[1] - b[1]);

		  let f = 0;
		  const energyBudget2 = Math.floor(85 * planet.energy);
		  const silverBudget2 = Math.floor(planet.silver);

		  let energySpent2 = 0;
		  let silverSpent2 = 0;
		  while (energyBudget2 - energySpent2 > 0 && f < candidates2_.length) {

			const silverLeft2 = silverBudget2 - silverSpent2;
			const energyLeft2 = energyBudget2 - energySpent2;

			// Remember its a tuple of candidates and their distance
			const candidate2 = candidates2_[f++][0];

			// Rejected if has unconfirmed pending arrivals
			const unconfirmed2 = df.getUnconfirmedMoves().filter(move => move.to === candidate2.locationId)
			if (unconfirmed2.length !== 0) {
			  continue;
			}

			
			let silverRequested2 = Math.ceil(candidate2.silverCap - candidate2.silver);
			for (s of df.getAllVoyages().filter(p => p.toPlanet === candidate2.locationId)){
				silverRequested2 -= s.silverMoved;
			}
			const silverNeeded2 = silverRequested2 > silverLeft2 ? silverLeft2 : silverRequested2;


			// Setting a 100 silver guard here, but we could set this to 0
			if (silverNeeded2 < 100) {
			  continue;
			}

			// needs to be a whole number for the contract
			const energyNeeded = Math.ceil(df.getEnergyNeededForMove(planet.locationId, candidate2.locationId, 1));
			if (energyLeft2 - energyNeeded < 0) {
			  continue;
			}

			df.move(planet.locationId, candidate2.locationId, energyNeeded, silverNeeded2);
			sTotalMoved +=  silverNeeded2;
			energySpent2 += energyNeeded;
			silverSpent2 += silverNeeded2;
		  }
		}
		  
	}
}
console.log("Total silver sent: ", sTotal);
console.log("Total silver moved: ", sTotalMoved);
