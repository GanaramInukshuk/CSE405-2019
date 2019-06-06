// Education Manager
// Giovanni Orijuela

// How it works:
// The logic for this should work like a healthbar except this component has no
// control over what the current health is
// Max educatable children => current health
// Max health => Max school capacity

// The max health (max school capacity) has a weekly cost associated with it;
// this should represent the school's upkeep
// School capacity goes by increments of 10

import React from 'react';

class EducationManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCapacity: 0
    };
  }

  addCapacity = (incAmt) => {
    let newCapacity = this.state.currentCapacity + incAmt;
    if (newCapacity < 0) {
      newCapacity = 0;
      this.setState({currentCapacity: 0});
    } else 
      this.setState({currentCapacity: newCapacity});

    // console.log(this.state.currentCapacity);

    this.feedbackToParent(newCapacity);
  }

  updateEnrollment = () => {
    // this.feedbackToParent();

    if (this.props.maxStudentCount >= this.state.currentCapacity)
      return this.state.currentCapacity + " (Demand: " + (this.props.maxStudentCount - this.state.currentCapacity) + ")";
    else 
      return this.props.maxStudentCount + " (Available seats: " + (this.state.currentCapacity - this.props.maxStudentCount) + ")";
  
    }

  feedbackToParent = (v) => {
    // console.log(this.state.currentCapacity);
    var updatedState = {
      educationCapacity: v
    };
    this.props.methodFromParent(updatedState);
  }

  render() {
    return(
      <div className="EducationManager, MainContainer">
        <h3>Education</h3>
        <p>Current student capacity: {this.state.currentCapacity}; Enrolled: {this.updateEnrollment()}</p>
        <p>Cost per seat per week: { this.props.costPerSeat}; Total cost per week: {this.props.costPerSeat * this.state.currentCapacity}</p>
        <div className="Subcontainer">        
          <button onClick={() => this.addCapacity(-100)}>-100</button>
          <button onClick={() => this.addCapacity(-10)}>-10</button>
          <button onClick={() => this.addCapacity( 10)}>10</button>
          <button onClick={() => this.addCapacity( 100)}>100</button>
        </div>
      </div>
    )
  }
}

export default EducationManager;