import React from 'react';
import './App.css';
import Navbar from './components/navbar';
import Routers from './routes';


function App(props) {
  return (
    <>

      <Navbar props={props}/>
      <Routers/>
   </>

  )
}

export default App;
