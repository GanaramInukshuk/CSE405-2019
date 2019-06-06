// Timekeeping script

// How it works:
// - Most updates in-game are done on a weekly basis; there are 52 weeks in an
//   in-game year
// - There are 12 months, each with 4 or 5 weeks each (based on Symmetry454);
// - JAN MAR APR JUN JUL SEP OCT DEC have 4 weeks, FEB MAY AUG NOV have 5
// - For simplicity's sake, leap year calcuations aren't implemented; Sym454
//   adds seven intercalary days (effectively an extra week) at the end of
//   DEC every 5 to 6 years

import React from 'react';

export class Timekeeper extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  calculateTime = () => {
    let tickCount = this.props.tickCountFromParent;
    let ticksPerWeek = 120;
    let weeksPerYear = 52;
    let daysPerWeek = 7;

    // Get the number of ticks the current week is in
    let tick = tickCount % ticksPerWeek;
    
    // Get the number of weeks the current year is in
    // ticksPerWeek * weeksPerYear => ticksPerYear
    let week = Math.floor(tickCount % (ticksPerWeek * weeksPerYear) / ticksPerWeek);

    // Get the year
    let year = Math.floor(tickCount / (ticksPerWeek * weeksPerYear));

    // Get the day
    let day = Math.floor(tickCount % (ticksPerWeek * weeksPerYear) / ticksPerWeek * daysPerWeek);

    // Use a switch-case statement to determine the month
    // Also determines the day in Sym454
    // Week 1 - 4 => JAN
    //  5 -  9 => FEB
    // 10 - 13 => MAR
    // 14 - 17 => APR
    // 18 - 22 => MAY
    // 23 - 26 => JUN
    // and so on up to DEC
    let month;
    switch (true) {
      case (week <  4) : { month = "JAN";             break; }
      case (week <  9) : { month = "FEB"; day -=  28; break; }
      case (week < 13) : { month = "MAR"; day -=  63; break; }
      case (week < 17) : { month = "APR"; day -=  91; break; }
      case (week < 22) : { month = "MAY"; day -= 119; break; }
      case (week < 26) : { month = "JUN"; day -= 154; break; }
      case (week < 30) : { month = "JUL"; day -= 182; break; }
      case (week < 35) : { month = "AUG"; day -= 210; break; }
      case (week < 39) : { month = "SEP"; day -= 245; break; }
      case (week < 43) : { month = "OCT"; day -= 273; break; }
      case (week < 48) : { month = "NOV"; day -= 301; break; }
      case (week < 52) : { month = "DEC"; day -= 336; break; }
      default : { month = "MONTH ERROR"; }
    }

    let dayOfWeek;
    switch (day % 7) {
      case (0) : { dayOfWeek = "MON"; break; }
      case (1) : { dayOfWeek = "TUE"; break; }
      case (2) : { dayOfWeek = "WED"; break; }
      case (3) : { dayOfWeek = "THU"; break; }
      case (4) : { dayOfWeek = "FRI"; break; }
      case (5) : { dayOfWeek = "SAT"; break; }
      case (6) : { dayOfWeek = "SUN"; break; }
      default : { dayOfWeek = "DAY ERROR"; }
    }

    return "Date: " + dayOfWeek + ", " + (day + 1) + " " + month + " " + (year + 2000) + " (Week " + (week + 1) /*+ "; Tick: " + (tick)*/ + ")";
  }

  render() {
    return(
      <p className="Timekeeper">{this.calculateTime()}</p>
    );
  }
}

export default Timekeeper;