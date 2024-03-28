import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import api from "../../services/api";

export default function Login(props) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      cpf: "",
      password: "",
    },
    onSubmit: (values) => {
      try {
        console.log("login");
        const log = api
          .post("/login", {
            cpf: values.cpf,
            password: values.password,
          })
          .then((response) => response.data)
          .then((data) => {
            console.log("RESPONSE", data);
            if (data.auth) {
              localStorage.setItem("x-access-token", data.token);
              localStorage.setItem("valid_token", data.auth);
              localStorage.setItem("logged_user_id", data.user_id);
              navigate("/");
            } else alert("Email or Password incorrect");
          });
        if (log) console.log("log", log);
      } catch (error) {
        alert("Please type a correct a email and Password");
      }
    },
  });

  return (
    <div class="d-flex align-items-center justify-content-center vh-100">
      <div class="container card d-flex w-50 justify-content-center align-middle">
        <div class="container card-body">
          <h5 class="row d-flex justify-content-center card-title">Login</h5>
          <form onSubmit={formik.handleSubmit}>
            <div class="row d-flex input-group mb-3">
              <span
                class="input-group-text w-25"
                id="inputGroup-sizing-default"
              >
                CPF
              </span>
              <input
                id="cpf"
                name="cpf"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.cpf}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div class="row d-flex input-group mb-3">
              <span
                class="input-group-text w-25"
                id="inputGroup-sizing-default"
              >
                Password
              </span>
              <input
                name="password"
                id="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div className="row d-flex justify-content-center align-items-center">
              <Link class="w-50 btn btn-primary" to="/create-account">
                Create Account
              </Link>
            </div>
            <div className="row d-flex justify-content-center align-items-center">
              <button
                type="submit"
                value="Login"
                class="w-50 btn btn-primary mt-3"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
