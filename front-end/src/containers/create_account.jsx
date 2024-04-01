import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import api from "../services/api";

export default function CreateAccount() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      cpf: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      var validate = false;
      for (const value in values) {
        if (values[value].length) validate = true;
      }
      if (values.password !== values.confirmPassword) {
        validate = false;
        alert("Oh no! Your email are different");
      } else if (!validate) alert("Oh no! Please fill all informations");
      else if (validate) {
        api
          .post(`/users`, {
            firstName: values.firstName,
            lastName: values.lastName,
            cpf: values.cpf,
            password: values.password,
          })
          .then((response) => response.status)
          .then((status) => {
            if (status === 200) {
              alert("Usuário cadastrado com sucesso");
              navigate("/login");
            } else {
              alert("Ocorreu um erro, tente novamente");
            }
          });
      }
    },
  });

  return (
    <>
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="container col-12 col-md-4 card d-flex justify-content-center align-middle">
          <div class="container card-body">
            <h5 class="row d-flex justify-content-center card-title">
              Criar Conta
            </h5>
            <form onSubmit={formik.handleSubmit}>
              <div class="row d-flex input-group mb-3">
                <span
                  class="input-group-text w-25"
                  id="inputGroup-sizing-default"
                >
                  Nome
                </span>
                <input
                  label="Nome"
                  id="firstName"
                  name="firstName"
                  placeholder="Nome"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
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
                  Sobrenome
                </span>
                <input
                  label="Sobrenome"
                  id="lastName"
                  name="lastName"
                  placeholder="Sobrenome"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
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
                  CPF
                </span>
                <input
                  label="CPF"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
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
                  Senha
                </span>
                <input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
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
                  Confirme Senha
                </span>
                <input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  class="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="row d-flex justify-content-center align-items-center">
              <button
                type="submit"
                value="Login"
                class="w-50 btn btn-primary mt-3"
              >
                Create
              </button>
              </div>
            </form>
            </div>
          </div>
        </div>
    </>
  );
}
