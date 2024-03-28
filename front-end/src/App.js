import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Routers from './routes';
import Home from './components/home/home';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer } from 'react-toastify';


function App(props) {
  return (
    <>    
      <ToastContainer theme="colored"></ToastContainer>
      <Navbar props={props}/>
      <Routers/>
   </>

  )
}

export default App;
