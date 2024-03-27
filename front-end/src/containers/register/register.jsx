import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import Navbar from "../../components/navbar/navbar";
import { Back, LoginModal, FormContainner, FormContainnerTitle } from "./style";
import { Input } from "../../components/form/input/style";
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

  function hasMiddleName() {
    !middleName ? setMiddleName(true) : setMiddleName(false);
  }

  function validateCPF() {
    if (cpf.length < 11 || cpf.length > 11) setValidCpf(false);
    else setValidCpf(true);
    let sum = 0;
    for (var i = 10, j = 0; i >= 2; i--, j++) sum += cpf[j] * i;
    let dig_1 = 11 - (sum % 11);
    sum = 0;
    for (var i = 11, j = 0; i >= 2; i--, j++) sum += cpf[j] * i;
    let dig_2 = 11 - (sum % 11);
    if (cpf[9] != dig_1 && cpf[10] != dig_2) setValidCpf(false);
    else setValidCpf(true);
  }

  async function searchAddress() {
    const address = await api
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.data)
      .then((data) => {
        setStreet(data.logradouro || "");
        setCity(data.localidade || "");
        setState(data.uf || "");
        setNeiboorhood(data.bairro || "");
      });
  }

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
      <Navbar props={props} language={language} />
      <form onSubmit={formik.handleSubmit}>
        <>
          <FormContainnerTitle>Name</FormContainnerTitle>
          <FormContainner>
            <label htmlFor="firstname">First Name</label>
            <Input
              label="First Name"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              type="text"
              onChange={formik.handleChange}
              value={firstName}
            />
            <label htmlFor="middlename"> Has Middle Name</label>
            <Input
              label="First Name"
              id="middlename"
              name="middlename"
              placeholder="First Name"
              type="checkbox"
              onChange={hasMiddleName}
            />
            {middleName ? (
              <>
                <Input
                  label="Middle Name"
                  id="firstname"
                  name="middlename"
                  placeholder="Middle Name"
                  type="text"
                  checked={formik.handleChange}
                  value={formik.values.middleName}
                />
              </>
            ) : (
              ""
            )}
            <label htmlFor="firstname">Last Name</label>
            <Input
              label="Last Name"
              id="lastname"
              name="lastname"
              placeholder="Last Name"
              type="text"
              onChange={formik.handleChange}
              value={lastName}
            />
          </FormContainner>
        </>
        <FormContainnerTitle>Information</FormContainnerTitle>
        <FormContainner>
          <label htmlFor="CPF">
            {!validcpf ? (
              <FontAwesomeIcon icon={faCircleXmark} color="red" size="1x" />
            ) : (
              ""
            )}
            CPF
          </label>
          <Input
            label="CPF"
            id="cpf"
            name="cpf"
            type="text"
            onBlur={validateCPF}
            onChange={(e) => setCpf(e.target.value)}
            {...formik.getFieldProps("cpf")}
          />
          {formik.touched.cpf && formik.errors.cpf ? (
            <div>{formik.errors.cpf}</div>
          ) : null}
          
          <label htmlFor="firstname">He/His</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="radio"
            onChange={formik.handleChange}
            value={firstName}
          />
          <label htmlFor="firstname">She/Her</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="radio"
            onChange={formik.handleChange}
            value={firstName}
          />
          <label htmlFor="firstname">Other</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="radio"
            onChange={formik.handleChange}
            value={firstName}
          />
        </FormContainner>
        <FormContainnerTitle>Address</FormContainnerTitle>
        <FormContainner>
          <label htmlFor="firstname">CEP</label>
          <Input
            label="CEP"
            id="firstname"
            name="firstname"
            placeholder="Ex: 00.000-000"
            type="text"
            onChange={(e) => setCep(e.target.value)}
            onBlur={searchAddress}
          />
          <br />
          <label htmlFor="firstname">Street:</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="text"
            value={street}
          />
          <label htmlFor="firstname">Number</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="ex: 0000"
            type="number"
          />
          <label htmlFor="firstname">Neiboorhood</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="text"
            value={neiboorhood}
          />
          <br />
          <label htmlFor="firstname">City</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="text"
            value={city}
          />
          <label htmlFor="firstname">State</label>
          <Input
            label="First Name"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            type="text"
            value={state}
          />
        </FormContainner>
        <Input type="Submit" value="Save" />
      </form>
    </>
  );
}
