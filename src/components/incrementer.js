// Incrementer

import React, { Component } from 'react'

export class Incrementer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : "unnamed",
      count : 0
    }
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  decrement = () => {
    // Do not allow the counter to go into the negatives
    if (this.state.count - 1 >= 0)
      this.setState({ count: this.state.count - 1 });
  }

  render() {
    return(
      <div>
        <h2>{ this.state.name }</h2>
        <p>{ this.state.count }</p>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.increment}>+</button>
      </div>
    )
  }
}

export default Incrementer;