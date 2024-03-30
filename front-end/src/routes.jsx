import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/home";
import Login from "./containers/login";
import CreateAccount from "./containers/create_account";

export default function Routers(props) {
    return(
        <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/create-account" element={<CreateAccount/>}/>
            <Route exact path="/" element={<Home/>}/>
        </Routes>
    )
}