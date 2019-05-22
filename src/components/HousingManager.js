// Housing Manager
// Giovanni Orijuela

// This is a housing manager class intended for use with a crudely built
// city simulator


// The logic for this program should operate like a healthbar, except the
// healthbar can change its max hitpoints (which already happens in some
// games):
// - Adding/removing houses changes the max number of hitpoints
// - Adding/removing occupants heals or damages the player
// - this._occupiedHouses is the player's current health
// - VacantHouses() is the HP needed to get to max health and is basically
//   the difference between the max health and current health
// - Positive housing demand is healing over time
// - Negative housing demand is damage over time

class HousingManager {
  // Housing weights
  // https://www.statista.com/statistics/242189/disitribution-of-households-in-the-us-by-household-size/
  // https://www.statista.com/statistics/183648/average-size-of-households-in-the-us/
  // Based on the stats above, this vector represents the percentage of houses
  // with 1, 2, 3, 4, 5, 6, 7, or 8 people living inside
  // 2.5 is the current US average; 3 was the average in the 70s
  // 3.5 was an extrapolated figure found using Poisson distribution
  // For 2.5 people/house: [.280, .340, .150, .130, .060, .020, .010, .010];
  // For 3.0 people/house: [.180, .300, .170, .160, .090, .050, .040, .010];
  // For 3.5 people/house: [.120, .190, .230, .180, .140, .080, .040, .020];
  // I'm not against changing these weights so that they represent a higher
  // average occupancy (SC4 and C:S both do that, albeit extremely); just be
  // sure the housing weights total up to 1
  get HOUSING_WEIGHTS() { 
    return [.180, .300, .170, .160, .090, .050, .040, .010];
  }

  constructor() {
    this._hv = [0, 0, 0, 0, 0, 0, 0, 0];
    this._occupiedHouses = 0;
    this._totalHouses    = 0;
    // this._totalOccupants = 0;
  }

  // Getters
  get HousingVector()  { return this._hv; }
  get VacantHouses()   { return this._totalHouses - this._occupiedHouses; }
  get OccupiedHouses() { return this._occupiedHouses; }
  get TotalHouses()    { return this._totalHouses; }

  // Setters; in case of loading from a savefile
  set OccupiedHouses(h) { if (h > 0) this._occupiedHouses = h; }
  set TotalHouses(t)    { if (t > 0) this._totalHouses    = t; }
  set HousingVector(hv) { if (Array.isArray(hv)) this._hv = hv; }

  // Function for adding/removing houses to the Housing Manager
  // Using the healthbar analogy, this is changing the size of the healthbar
  addHousing(nHouses) {
    // console.log("[HousingManager]: Attempting to add houses: " + nHouses);

    // Don't allow the housing count to become negative
    // If a value gets entered that would make it negative, have the count go
    // to zero instead

    // let prevTotal = this._totalHouses;
    // let prevOccup = this._occupiedHouses;

    if ((this._totalHouses + nHouses) < 0) this._totalHouses = 0;
    else this._totalHouses += nHouses;

    // Trying to remove houses runs the risk of evicting occupants out of an
    // already occupied house; the lazy way to simulate this is that any
    // houses removed will always be empty if there are empty houses
    // available; otherwise, if there are no empty houses, the number of
    // occupied houses will decrease as well

    // A more interesting way to do this is to decrease the number of occupied
    // houses based on a probability such that the probability is the number of
    // occupied houses divided the total number of houses, but this gets
    // complicated really quick; just pretend the city's generously relocating
    // the tenants to a vacant house

    if (this._occupiedHouses >= this._totalHouses)
      this._occupiedHouses = this._totalHouses;
  }

  // Function for adding or removing occupants
  // Using the healthbar analogy, this is either healing or taking damage
  // Occupancy is measured by heads of households, not the number of occupants
  addOccupants(nHouses) {
    if (nHouses > 0 && nHouses > this.VacantHouses)
      // Adding health but the healthbar is close to max health
      this._occupiedHouses = this._totalHouses;
    else if (nHouses < 0 && (this._occupiedHouses + nHouses) < 0)
      // Removing health but the healthbar is close to 0 health
      this._occupiedHouses = 0;
    else
      // Normal healing or damage calculation
      this._occupiedHouses += nHouses;

    // Also update the occupancy
    // The game has to update this frequently enough to account for new 
    // residents to be accounted for but not so infrequently that they're
    // effectively squatters or something; since this function may be called
    // for however many times a house gets built, having this function call its
    // generate function is too frequent
    //this.generateHousingOccupancy();

    
    // console.log(this._occupiedHouses + " and " + this._totalHouses);

    // return this._occupiedHouses;
  }

  // Function for generating occupancy
  // Meaningful occupancy data can only be generated if there's at least 100
  // occupied households
  generateHousingOccupancy() {
    if (this._occupiedHouses <= 99) {
      this._hv = [0, 0, 0, 0, 0, 0, 0, 0];
      return;
    } else {
      // Generate tiny fluctuations for the housing weights, but only do so if
      // the number of occupied houses is above 100
      let wVector = this.HOUSING_WEIGHTS;       // Copy of the housing weights
      let fVector = [0, 0, 0, 0, 0, 0, 0, 0];   // Fluctuations vector
      let wSum = 0;
      if (this._occupiedHouses > 10) {
        for (let i = 0; i < wVector.length; i++) {
          // Divide by 40 for +/- 1%
          fVector[i] = wVector[i] * (1 + ((Math.random() - 0.5) / 40));
          wSum += fVector[i];
        }
      } else {
        fVector = wVector;
        wSum = 1;
      }

      // Generate the housing vector
      let vSum = 0;   // The sum of the housing vector's elements
      for (let i = 0; i < wVector.length; i++) {
        this._hv[i] = Math.round(this._occupiedHouses * fVector[i] / wSum);
        vSum += this._hv[i];
      }

      // Correct the rounding error here
      // A positive rDiff means there are more houses than there should be
      // A negative rDiff means there are fewer houses than there should be
      // Rounding errors are corrected by ideally adding/removing houses of the
      // smallest household size, which only adds/removes one person at a time
      let rDiff = vSum - this._occupiedHouses;
      if (this._occupiedHouses === 1) {
        // This is to introduce the really interesting case of having a city with
        // a population of 1
        this._hv = [1, 0, 0, 0, 0, 0, 0, 0];
      } else {
        if (rDiff !== 0) {
          // Traverse the array from beginning to end
          // Find the first element such that adding/subtracting rDiff produces
          // zero or a positive number
          let i = 0;
          for (; i < this._hv.length; i++)
            if (this._hv[i] - rDiff >= 0) break;

          this._hv[i] -= rDiff;

          // console.log("[HousingManager]: Corrected a rounding error of " + rDiff + " by adjusting index " + i);
        }
      }
    }
  }

  // Debug function for printing the individual age buckets
  printHousingVector() {
    let pv = this._hv;
    console.log("[HousingManager]: Total: " + this.TotalHouses + " Occupied: " + this.OccupiedHouses + " Indiv: " + pv[0] + " " + pv[1] + " " + pv[2] + " " + pv[3] + " " + pv[4] + " " + pv[5] + " " + pv[6] + " " + pv[7]);
  }
}

// For making this accessible as a module for other .js files;
// to access, add this LOC to the main program:
// var HousingManager = require("./housing_manager");
module.exports = HousingManager;

// // Test code
// var hm = new HousingManager();

// hm.addHousing(50);

// for (var i = 0; i < 50; i++) {
//   hm.addOccupants(1);
//   hm.printHousingVector();
// }

// hm.addHousing(150);
// hm.addOccupants(150);

// for (var i = 0; i < 5; i++) {
//   hm.generateHousingOccupancy();
//   hm.printHousingVector();
// }