import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./containers/login/login";
import CreateAccount from "./containers/create_account/create_account";
import Register from "./containers/register/register";

export default function Routers(props) {
    return(
        <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/create-account" element={<CreateAccount/>}/>
            <Route exact path="/register" element={<Register/>}/>
            <Route exact path="/" element={<Home/>}/>
        </Routes>
    )
}