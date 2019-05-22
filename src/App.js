// For help, watch this vid: https://www.youtube.com/watch?v=sBws8MSXN7A
// To start, enter "npm start" in the terminal

import React from 'react';
//import logo from './logo.svg';

// CSS
import './App.css';

// Components
// import Incrementer       from "./components/Incrementer";
import HousingManager    from "./components/HousingManager";
import PopulationManager from "./components/PopulationManager";
import Timekeeper        from "./components/Timekeeper";

// Notes for timekeeping:
// Except for a few values that have to update more often, the game updates
// every value in its state every week (let's say one week is 20 seconds);
// the calendar is loosely based off of the Symmetry454 calendar but without
// leap year calculations, so all but four months (FEB, MAY, AUG, NOV) are
// 28 days long (the other four are 35 days long)

// If one second is one tick, then one week is 20 ticks; stuff that updates
// more frequently may be updated every tick instead or every x amt of ticks

class App extends React.Component {
  constructor() {
    super();
    // Counters
    // this.testCounter = new Incrementer();

    // Managers
    // this.tk = new Timekeeper();
    this.hsgMgr = new HousingManager();
    this.popMgr = new PopulationManager();

    // For testing out the managers
    this.hsgMgr.addHousing(0);
    this.hsgMgr.addOccupants(0);

    // Call each manager's generate function
    this.hsgMgr.generateHousingOccupancy();
    this.popMgr.generatePopulationCensus(this.hsgMgr.HousingVector);

    // Define values here...
    this.state = {
      money: 100000,

      housingOccupied: 0,
      housingTotal: 0,

      population: 0,

      gameTime: 0
    }
  }

  gameTick = () => {
    this.setState({
      gameTime: this.state.gameTime + 1
    });

    // Game updates go here and happen every 120 game ticks
    if (this.state.gameTime % 120 === 0) {
      // This represents a residential demand of 5 households per week
      this.updateOccupancy(5);
    }
  }

  // For game clock
  componentDidMount() {
    // Time interval between game ticks in milliseconds
    // There are 120 ticks per in-game week
    let subinterval = 50;
    this.interval = setInterval(this.gameTick, subinterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateHousing = (amt) => {
    this.hsgMgr.addHousing(amt);
    this.hsgMgr.generateHousingOccupancy();

    this.setState({
      housingOccupied: this.hsgMgr.OccupiedHouses,
      housingTotal:    this.hsgMgr.TotalHouses
    })
  }

  updateOccupancy = (amt) => {
    this.hsgMgr.addOccupants(amt);
    this.hsgMgr.generateHousingOccupancy();
    this.popMgr.generatePopulationCensus(this.hsgMgr.HousingVector);

    this.setState({
      housingOccupied: this.hsgMgr.OccupiedHouses,
      population:      this.popMgr.PopulationTotal
    })
  }

  // Function needed to display the population
  updatePopulation = () => {
    if (this.state.housingOccupied < 100)
      return "Minimum of 100 occupied houses needed to generate a census.";
    else
      return this.state.population + " residents";
  }

  render() {
    return (
      <div className="App">
      <h1>Experimental City Incrementer</h1>
        <div className="MainContainer">
          <h3>City Overview</h3>
          <p>Money: (This counter doesn't work yet)</p>
          <Timekeeper tickCountFromParent={this.state.gameTime}/>
        </div>
        <div className="MainContainer">
          <h3>Residential</h3>
          <p>{this.state.housingOccupied} out of {this.state.housingTotal} houses total ({this.state.housingTotal - this.state.housingOccupied} available)</p>
          <div className="Subcontainer">
            <button onClick={() => this.updateHousing(-100)}>-100</button>
            <button onClick={() => this.updateHousing(- 10)}>-10</button>
            <button onClick={() => this.updateHousing(-  1)}>-1</button>
            <button onClick={() => this.updateHousing(   1)}>+1</button>
            <button onClick={() => this.updateHousing(  10)}>+10</button>
            <button onClick={() => this.updateHousing( 100)}>+100</button>
          </div>
        </div>
        <div className="MainContainer">
          <h3>Population</h3>
          <p>Population is updated each week</p>
          <p>{this.updatePopulation()}</p>
        </div>
        <div className="MainContainer">
          <h3>Workforce</h3>
          <p>Maximum eligible workforce: {this.popMgr.YoungAdultPop + this.popMgr.AdultPop}</p>
        </div>
        <div className="MainContainer">
          <h3>DEBUG PANEL</h3>
          <p>Occupied houses
            <button onClick={() => this.updateOccupancy(-Infinity)}>ZERO</button>
            <button onClick={() => this.updateOccupancy(-10)}>-10</button>
            <button onClick={() => this.updateOccupancy(- 1)}>-1</button>
            <button onClick={() => this.updateOccupancy(  1)}>+1</button>
            <button onClick={() => this.updateOccupancy( 10)}>+10</button>
            <button onClick={() => this.updateOccupancy(Infinity)}>MAX</button>
          </p>
        </div>
      </div>
    )
  }
}

export default App;
