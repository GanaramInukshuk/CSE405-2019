// For help, watch this vid: https://www.youtube.com/watch?v=sBws8MSXN7A
// To start, enter "npm start" in the terminal

import React from 'react';
//import logo from './logo.svg';

// CSS
import './App.css';

// Components
import Incrementer from "./components/incrementer";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>
//           Hello world!
//         </p>

//         <p>I'm gonna have fun with this...</p>
//       </header>
//     </div>
//   );
// }


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Incrementer />
        <Incrementer />
      </div>
    )
  }
}

export default App;
