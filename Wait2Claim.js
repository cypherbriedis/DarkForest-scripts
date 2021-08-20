function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkClaimer() {
	let planetId = "000095c90010a750cf9893a25aa02024ab889f0a166f294740bc06b2fd111f08";    //planetID of planet to clime
	let myId = df.account;
	let planetClaimer = df.getPlanetWithId(planetId);
	while(planetClaimer.claimer === undefined){
		console.log("Checking planet");
		planetClaimer = df.getPlanetWithId(planetId);
		if(planetClaimer.owner === myId && planetClaimer.claimer === undefined){
				df.claimLocation(planetId);
		}
		await sleep(30000);
	}
	if(planetClaimer === myId){
		console.log("Yesssss, it's mine: " + planetClaimer.claimer);
	} else {
		console.log("Shit, i lost it: " + planetClaimer.claimer);
	}
}
checkClaimer();
