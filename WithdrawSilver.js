wTotal = 0;
for (planet of df.getMyPlanets().filter(p => p.planetType === 3)){
    if (planet.silver/planet.silverCap >= 0.5){
        df.withdrawSilver(planet.locationId, Math.floor(planet.silver))
		wTotal += Math.floor(planet.silver);
    }
}
console.log("Total silver withdrawed: ", wTotal);
