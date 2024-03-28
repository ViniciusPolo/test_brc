import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import api from "../../services/api";

export default function CreateAccount() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            betteremail: '',
            confirmemail: '',
            keyword: '',
            keywordconfirm: ''
        },
        onSubmit: values => {
            var validate = false
            for (const value in values) {
                if (values[value] != 0) validate = true
            }
            if (values.betteremail !== values.confirmemail) {
                validate = false
                alert('Oh no! Your email are different')
            }
            else if (values.keyword !== values.keywordconfirm) {
                validate = false
                alert('Oh, why Did You put differents keywords?')
            }
            else if (!validate) alert('Oh no! Please fill all informations')
                 
            else if (validate) {
                api.post(`/users`, {
                    firstName: values.firstname,
                    lastName: values.lastname,
                    email: values.betteremail,
                    password: values.keywordconfirm
                })
                .then(response => response.status)
                .then(status => {
                    if (status === 200) {
                        alert( "Usuário cadastrado com sucesso")
                        navigate(-1)
                    } else {
                        alert ("Ocorreu um erro, tente novamente")
                    }

                }
                    )
            }
        },
    })
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>

                <input
                    label="First Name"
                    id="firstname"
                    name="firstname"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.firstname}
                />
                <input
                    label="Last Name"
                    id="lastname"
                    name="lastname"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.lastname}
                />
                <input
                    label="Your better email"
                    id="betteremail"
                    name="betteremail"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.betteremail}
                />
                <input
                    label="Confirm email"
                    id="confirmemail"
                    name="confirmemail"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.confirmemail}
                />
                <input
                    label="Keyword"
                    type="password"
                    id="keyword"
                    name="keyword"
                    onChange={formik.handleChange}
                    value={formik.values.keyword}
                />
                <input
                    label="Confirm keyword"
                    type="password"
                    id="keywordconfirm"
                    name="keywordconfirm"
                    onChange={formik.handleChange}
                    value={formik.values.keywordconfirm}
                />
                <input type="Submit" value="Save" />
            </form>
        </div>
    )
}