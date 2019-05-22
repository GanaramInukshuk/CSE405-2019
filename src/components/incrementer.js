//import { isTSExpressionWithTypeArguments } from "@babel/types";

// Incrementer

// import React, { Component } from 'react'

export class Incrementer {
  constructor(initialCount, negativeAllowed) {
    // Passing no parameters defaults to a counter limited to [0, infinity)
    if (arguments.length === 0) {
      this._count = 0;
      this._negativeAllowed = false;
    } else {
      this._count = initialCount;
      this._negativeAllowed = negativeAllowed;
    }
  }

  // Setters and getters
  get Count()  { return this._count; }
  // set Count(c) { if (c >= 0) this._count = c; }

  // Rewriting this function meant that inc/dec can be handled by one function
  // where decrements are handled using negative increment amounts
  // Oh, and somehow passing 0 arguments defaults to incrementing by 1
  increment(incAmount) {
    if (arguments.length === 0) this._count++;
    else {
      // If negatives aren't allowed and incAmount is a number that would
      // make this._count become negative, make this._count zero
      // otherwise, add incAmount to this._count
      if (!this._negativeAllowed && (this._count + incAmount) < 0)
        this._count = 0;
      else 
        this._count += incAmount;
    }
  }

  // increment10 = () => {
  //   //this.setState({ count: this.state.count + 1 });
  //   this.setState((prevState, props) => {
  //     return { count: prevState.count + 10 }
  //   })
  // }

  // decrement = () => {
  //   // Do not allow the counter to go into the negatives

  // }

  // decrement10 = () => {
  //   // If the counter would go into the negatives, just go back to 0
  //   if (this.state.count - 10 >= 0)
  //     this.setState((prevState, props) => {
  //       return { count: prevState.count - 10 }
  //     })
  //   else 
  //     this.setState((prevState, props) => {
  //       return { count: 0 }
  //   })
  // }

  // render() {
  //   return(
  //     <div>
  //       <h2>{this.state.name}</h2>
  //       <p>Current count: {this.state.count}</p>
  //       <button onClick={this.decrement10}>-10</button>
  //       <button onClick={this.decrement}>-</button>
  //       <button onClick={this.increment}>+</button>
  //       <button onClick={this.increment10}>+10</button>
  //     </div>
  //   )
  // }
}

export default Incrementer;