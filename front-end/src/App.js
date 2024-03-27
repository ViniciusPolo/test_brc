import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Routers from './routes';
import Home from './components/home/home';


function App(props) {
  return (
    <>    
      <Navbar props={props}/>
      <Routers/>
   </>

  )
}

export default App;
