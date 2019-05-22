// Population Manager
// Giovanni Orijuela

// This is a population manager class intended for use with a crudely built
// city simulator

// Citizens are grouped into 10 "buckets", each bucket representing an age
// range from 0-9, 10-19, and so on to 90+.

// The old version of the Population Manager would build up the population
// straight from the buckets; the new one starts with a population total
// and divides it using a vector of percentages, each percentage representing
// an age group representing how much that group contributes to the overall
// population; this new implementation effectively has a built-in birth and
// death rate that equalize with each other and become zero

// Also note: I'm using underscore notation to (loosely) define private members
// since at the time of me writing this, the proposed # notation has not been
// implemented: https://www.sitepoint.com/javascript-private-class-fields/

// A future Desirability Manager could affect these weighted percentages, but
// for now, the vector of percentages will remain constant... unless I have my
// way with random numbers...

class PopulationManager {
  // Population weights
  // The weights are loosely based off of the US's own population pyramid:
  // https://www.populationpyramid.net/united-states-of-america/2019/
  // Also, it's written like this to avoid tampering by outside functions
  get POPULATION_WEIGHTS() { 
    // CONSTANT; only to be modified in an IDE
    return [ .130, .130, .130, .130, .130, .130, .115, .075, .025, .005 ];
  }

  // Constructor; initialize population and population vector
  constructor() {
    this._population = 0;
    this._pv = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  }

  // // Constructor; initialize population and population vector with a
  // // starting population
  // constructor(pop) {
  //   this._population = pop;
  //   this._pv = this.generatePopulationCensus();
  // }

  // Getters for the internal values
  // The setter for PopulationTotal also won't accept negative numbers
  get PopulationVector() { return this._pv; }
  get PopulationTotal()  { return this._population; }

  // Setters; in case this game has to load from a savefile
  set PopulationTotal(p)   { if (p > 0) this._population     = p; }
  set PopulationVector(pv) { if (Array.isArray(pv)) this._pv = pv; }

  // Getters for individual age demographics
  // This coincides with Cities: Skylines population breakdown
  // Because of how I work with increments of 10, the senior population starts
  // at age 70 instead of 65
  // There's nothing stopping me from using finer increments; I went with 10
  // year increments because 5-year increments would require a 20-element array
  get ChildPop()      { return this._pv[0];                             }
  get TeenPop()       { return this._pv[1];                             }
  get YoungAdultPop() { return this._pv[2] + this._pv[3];               }
  get AdultPop()      { return this._pv[4] + this._pv[5] + this._pv[6]; }
  get SeniorPop()     { return this._pv[7] + this._pv[8] + this._pv[9]; }

  // Function for generating a population census
  // This function is "overloaded" so that it accepts a raw population number,
  // the housing vector from the Housing Manager, or no parameters
  // Note: A census won't be generated if the population is below a certain
  // amount; I've seen this work for populations as low as 100, but I've
  // currently set the minimum slightly higher to be on the safe side
  generatePopulationCensus(p) {
    // If an argument was passed, save it as the population
    // if (arguments.length !== 0 && typeof p === "number")
    //   // The population was a straight-up number
    //   this.PopulationTotal = p;
    if (arguments.length !== 0 && Array.isArray(p)) {
      // The population was the housing vector
      let pIncrement = 0;
      for (let i = 0; i < p.length; i++) pIncrement += p[i] * (i + 1);
      this._population = pIncrement;
    }

    // If the population's below a certain threshold, don't bother
    // The all-zero vector represents a population that's too small to get any
    // meaningful statistics out of it
    // 300 is the minimum population to get any meaningful statistics
    // This code is basically useless since statistics can only be generated
    // with a minimum housing occupancy of 100 and the HousingManager will
    // pass a vector of 0's if it's any less
    // if (this.PopulationTotal <= 290) {
    //   this._pv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //   return;
    // }

    // TODO: Rename these variables to something more descriptive; the last
    // time I tried, I messed up and got NaN's in the population vector
    // wv -> weightVector
    // fv -> fluctuationVector or flucVector
    // wSum -> weightSum
    // vSum -> vectorSum
    // rDiff -> roundingDifference or roundingDiff

    // Generate a weight vector with tiny fluctuations to add randomness
    // This works by taking a copy of the default population weights and
    // effectively adding/subtracting up to 2.5% of that weight.
    // Since the new weights won't total up to 100%, a new sum of weights
    // needs to be calculated alongside this weights vector
    let wv = this.POPULATION_WEIGHTS;
    let fv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let wSum = 0;   // Sum of weights

    // To vary the weight, generate a random number [0, 1), subtract 0.5
    // from it [-0.5, 0.5), then divide by 20 [-0.025, 0.025)
    // For +/- 5% fluctuations, divide by 10
    // or divide by 40 for +/- 1.25%
    // Fluctuations have an effective range of [-1.25%, 1.25%)
    if (this._population > 500) {
      for (let i = 0; i < wv.length; i++) {
        fv[i] = wv[i] * (1 + ((Math.random() - 0.5) / 100));
        wSum += fv[i];
      }
    } else {
      fv = wv;
      wSum = 1;
    }

    // Generate the population vector
    let vSum = 0;     // Sum of the overall vector
    for (let i = 0; i < wv.length; i++) {
      this._pv[i] = Math.round(this._population * fv[i] / wSum);
      vSum += this._pv[i];
    }

    // Shh... I'm trying to sneakily get rid of the rounding error...
    // A positive rDiff means there are more people than there should be
    // A negative rDiff means there are fewer people than there should be
    // Rounding errors are corrected by ideally removing from the oldest
    // poulation group, but this effect should be mitigated by the fact that
    // there's a minimum population for this to work
    let rDiff = vSum - this._population;
    if (rDiff !== 0) {
      // Traverse the array from end to beginning
      // Find the first element such that adding/subtracting rDiff produces
      // zero or a positive number
      let i = this._pv.length - 1;
      for (; i > 0; i--)
        if (this._pv[i] - rDiff >= 0) break;

      this._pv[i] -= rDiff;

      // console.log("[PopulationManager]: Corrected a rounding error of " + rDiff + " by adjusting index " + i);
    }
  }

  // Debug function for printing the individual age buckets
  printPopulationVector() {
    var pv = this._pv;
    console.log("[PopulationManager]: Total: " + this.PopulationTotal + " Indiv: " + pv[0] + " " + pv[1] + " " + pv[2] + " " + pv[3] + " " + pv[4] + " " + pv[5] + " " + pv[6] + " " + pv[7]+ " " + pv[8] + " " + pv[9]);
  }
}

// For making this accessible as a module for other .js files;
// to access, add this LOC to the main program:
// var PopulationManager = require("./population_manager");
module.exports = PopulationManager;

// // Test code
// var testPop = 250;
// var pm = new PopulationManager();
// pm.PopulationTotal = testPop;

// console.log("Initial population:");
// pm.printPopulationVector();

// for (var i = 0; i < 10; i++) {
//   console.log("Year: " + (i + 1));
//   pm.generatePopulationCensus();
//   pm.printPopulationVector();
// }