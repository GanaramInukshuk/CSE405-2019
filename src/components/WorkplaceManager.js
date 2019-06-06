// WorkplaceManager
// Giovanni Orijuela

// How it works:
// The logic for this should also work like a healthbar, much like the EducationManager
// Max eligible workforce => current health
// Max workforce capacity (or industrial capacity) => max health

// Current health using the healthbar analogy represents the number
// of workers currently employeed; this is returned back to the main app
// to calculate revenue from exported goods

import React from 'react';

class WorkplaceManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      industrialCapacity: 0,
      industrialWorkers: 0
    }

    this.updateIndustry();
  }

  // addCommercialCapacity = (incAmt) => {
  //   let newCapacity = this.state.commercialCapacity + incAmt;
  //   if (newCapacity < 0) {
  //     newCapacity = 0;
  //     this.setState({commercialCapacity: 0});
  //   } else 
  //     this.setState({commercialCapacity: newCapacity});

  //   this.feedbackToParent(newCapacity, this.state.industrialWorkers);
  // }

  addIndustrialCapacity = (incAmt) => {
    let newCapacity = this.state.industrialCapacity + incAmt;
    if (newCapacity < 0) {
      newCapacity = 0;
      this.setState({
        industrialCapacity: 0
      });
    } else {
      this.setState({
        industrialCapacity: newCapacity
      });
    }

    this.feedbackToParent({ industrialCapacity: newCapacity });
  }

  feedbackToParent = (v) => {
    // console.log(this.state.currentCapacity);
    // var updatedState = {
    //   industrialCapacity: v
    // };
    this.props.methodFromParent(v);
  }

  updateIndustry = () => {
    if (this.props.maxWorkerCount >= this.state.industrialCapacity) {
      return this.state.industrialCapacity;
    } else { 
      return this.props.maxWorkerCount + (" (Available openings: " + (this.state.industrialCapacity - this.props.maxWorkerCount) + ")");
    }
  }

  updateExports = () => {
    // return this.state.industrialWorkers * this.props.revenuePerExport;
    if (this.props.maxWorkerCount >= this.state.industrialCapacity) {
      return this.state.industrialCapacity * this.props.revenuePerExport;
    } else { 
      return this.props.maxWorkerCount * this.props.revenuePerExport;
    }
  }

  render() {
    return(
      <div className="WorkplaceManager, MainContainer">
        <h3>Employment</h3>
        {/* <p>Commercial service demand: derp</p>
        <div className="Subcontainer">
          <button onCLick={() => this.addCommercialCapacity(-10)}>-10</button>
          <button onCLick={() => this.addCommercialCapacity(10)}>10</button>
        </div> */}
        <p>Workers employed: {this.updateIndustry()}</p>
        <p>Revenue per export per worker: {this.props.revenuePerExport}; Weekly revenue from exports: {this.updateExports()}</p>
        <p>{this.props.testField}</p>
        <div className="Subcontainer">
          <button onClick={() => this.addIndustrialCapacity(-100)}>-100</button>
          <button onClick={() => this.addIndustrialCapacity(-10)}>-10</button>
          <button onClick={() => this.addIndustrialCapacity(10)}>10</button>
          <button onClick={() => this.addIndustrialCapacity(100)}>100</button>
        </div>
      </div>
    )
  }
}

export default WorkplaceManager;