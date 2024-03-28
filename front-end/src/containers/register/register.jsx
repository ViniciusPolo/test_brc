import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function Register(props) {
  const language = sessionStorage.getItem("language");
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cep, setCep] = useState(0);
  const [cpf, setCpf] = useState("");
  const [validcpf, setValidCpf] = useState(true);
  const [street, setStreet] = useState("");
  const [neiboorhood, setNeiboorhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [middleName, setMiddleName] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("logged_user_id");
    const user = api
      .get(`/users/${user_id}`)
      .then((response) => response.data)
      .then((data) => {
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
      });
  }, []);


  const validationSchema = Yup.object().shape({
    cpf: Yup.string().required("Required Field"),
  });

  const formik = useFormik({
    initialValues: {
      cpf: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      alert("save");
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <>
          <div>Name</div>
          <div>
            <label htmlFor="firstname">First Name</label>
            <input
              label="First Name"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              type="text"
              onChange={formik.handleChange}
              value={firstName}
            />
          

            <label htmlFor="lastname">Last Name</label>
            <input
              label="Last Name"
              id="lastname"
              name="lastname"
              placeholder="Last Name"
              type="text"
              onChange={formik.handleChange}
              value={lastName}
            />
          </div>
        </>
        <input type="Submit" value="Save" />
      </form>
    </>
  );
}
