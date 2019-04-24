// Testbed for all the managers I'm writing
// Giovanni Orijuela

// Include the managers
var PopulationManager = require("./population_manager");
var HousingManager    = require("./housing_manager");

var hsgMgr = new HousingManager();
var popMgr = new PopulationManager();

hsgMgr.addHousing(3000);

// Think of each iteration as one month of game time
for (var i = 0; i < 200; i++) {
  //console.log("Year: " + Math.floor(i / 12) + " Month: " + (i % 12 + 1));
  hsgMgr.addOccupants(10);
  hsgMgr.generateHousingOccupancy()
  popMgr.generatePopulationCensus(hsgMgr.HousingVector);

  hsgMgr.printHousingVector();
  popMgr.printPopulationVector();
  console.log("\n");
}

for (var i = 0; i < 4; i++) {
  hsgMgr.addOccupants(0);
  popMgr.generatePopulationCensus(hsgMgr.HousingVector);

  hsgMgr.printHousingVector();
  popMgr.printPopulationVector();
  console.log("\n");
}