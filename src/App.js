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
import EducationManager  from "./components/EducationManager";
import WorkplaceManager  from './components/WorkplaceManager';

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
      money: 250000,
      housingOccupied: 0,
      housingTotal: 0,
      population: 0,
      gameTime: 0,

      educationCapacity: 0,
      studentCount: 0,

      // Pass the employee count to WorkplaceManager and it will then return
      // the number of employeed workers
      employeeCount: 0,
      industrialCapacity: 0,

      testField: 12345
    }

    // A different JSON object for various costs
    this.cost = {
      housing: 1000,
      propertyTax: 5,

      education: 20,

      revenuePerExport: 8,
      salesTax: 3,

      test: 123
    }

    // this.getDataFromChild.bind();
  }

  gameTick = () => {
    this.setState({
      gameTime: this.state.gameTime + 1
    });

    // Game updates go here and happen every 120 game ticks
    if (this.state.gameTime % 120 === 0) {
      // Up to half of the current vacancy will be added as new residents
      // or 1/50th of current occupancy will move out
      let housingDemand = 1;
      let rand = Math.floor(Math.random() * 20);
      if (rand === 0)
        housingDemand = Math.round(Math.random() / 50 * this.hsgMgr.OccupiedHouses);
      else
        housingDemand = Math.round(Math.random() / 2 * this.hsgMgr.VacantHouses);

      // console.log(rand);
      this.updateOccupancy(housingDemand);

      

      let revenue = 0;
      revenue += this.state.housingOccupied * this.cost.propertyTax;
      revenue -= this.state.educationCapacity * this.cost.education;

      // Calculate revenue from exports
      if (this.state.employeeCount >= this.state.industrialCapacity) {
        revenue += this.state.industrialCapacity * this.cost.revenuePerExport;
      } else {
        revenue += this.state.employeeCount * this.cost.revenuePerExport;
      }

      // console.log("Education cost: " + this.state.educationCapacity * this.cost.education);

      let newState = {
        // Property tax; this gets added back to this.money
        money: this.state.money + revenue,

        // Update student count
        studentCount: Math.round((this.popMgr.ChildPop + this.popMgr.TeenPop) * 0.60),

        // Update eligible workforce
        employeeCount: Math.round((this.popMgr.YoungAdultPop + this.popMgr.AdultPop) * 0.60),
      }

      this.setState(newState);
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
    // Demolishing houses only recoups 10% construction cost
    let constructionCost;
    if (amt >= 0 ) constructionCost = amt * this.cost.housing;
    else constructionCost = amt * this.cost.housing / 10;

    if (constructionCost <= this.state.money) {
      this.hsgMgr.addHousing(amt);
      this.hsgMgr.generateHousingOccupancy();

      this.setState({
        housingOccupied: this.hsgMgr.OccupiedHouses,
        housingTotal:    this.hsgMgr.TotalHouses
      })

      this.setState({
        money: this.state.money - constructionCost
      });
    }
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
    if (this.state.housingOccupied < 100) return "Population: ???";
    else return "Population: " + this.state.population;
  }

  // For getting data from child
  getDataFromChild = (updatedState) => {
    // console.log("[App]: From child: " + data);
    this.setState(updatedState);
  }

  render() {
    return (
      <div className="App">
      <h1>Experimental City Incrementer</h1>
        <div className="MainContainer">
          <h3>City Overview and Population Breakdown</h3>
          <p>Money: {this.state.money}</p>
          <Timekeeper tickCountFromParent={this.state.gameTime}/>
          <p>Population breakdown updates each week. Meaningful information is generated at a 100 occupied houses.</p>
          <p>{this.updatePopulation()}</p>
          <p>Maximum eligible workforce: {this.state.employeeCount}</p>
          <p>Maximum educatable children: {this.state.studentCount}</p>
          {/* <p>Employed: {this.state.industrialWorkers} </p> */}
        </div>
        <div className="MainContainer">
          <h3>Residential</h3>
          <p>{this.state.housingOccupied} out of {this.state.housingTotal} houses total ({this.state.housingTotal - this.state.housingOccupied} available)</p>
          <p>Construction cost per house: {this.cost.housing}; Expected property tax revenue: {this.cost.propertyTax * this.state.housingOccupied}</p>
          <div className="Subcontainer">
            <button onClick={() => this.updateHousing(-100)}>-100</button>
            <button onClick={() => this.updateHousing(- 10)}>-10</button>
            <button onClick={() => this.updateHousing(-  1)}>-1</button>
            <button onClick={() => this.updateHousing(   1)}>+1</button>
            <button onClick={() => this.updateHousing(  10)}>+10</button>
            <button onClick={() => this.updateHousing( 100)}>+100</button>
          </div>
        </div>
        {/* <div className="MainContainer">
          <h3>Population Breakdown</h3>

        </div> */}
        {/* <div className="MainContainer">
          <h3>DEBUG PANEL</h3>
          <p>Occupied houses
            <button onClick={() => this.updateOccupancy(-Infinity)}>ZERO</button>
            <button onClick={() => this.updateOccupancy(-10)}>-10</button>
            <button onClick={() => this.updateOccupancy(- 1)}>-1</button>
            <button onClick={() => this.updateOccupancy(  1)}>+1</button>
            <button onClick={() => this.updateOccupancy( 10)}>+10</button>
            <button onClick={() => this.updateOccupancy(Infinity)}>MAX</button>
          </p>
          <p>Test field: {this.state.testField}</p>
        </div> */}
        <EducationManager methodFromParent={this.getDataFromChild} maxStudentCount={this.state.studentCount} costPerSeat={this.cost.education}/>
        <WorkplaceManager methodFromParent={this.getDataFromChild} industrialWorkerCount = {this.state.industrialWorkers} maxWorkerCount={this.state.employeeCount} revenuePerExport={this.cost.revenuePerExport}/>
      </div>
    )
  }
}

export default App;
