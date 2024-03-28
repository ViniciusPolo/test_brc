import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../services/api";


export default function Navbar(props) {
  const history = useNavigate();

  const language = sessionStorage.getItem("language");
  const [whoIAm, setWhoIAm] = useState("");
  const [whatIknow, setWhatIKnow] = useState("");
  const [myProjects, setMyProjects] = useState("");
  const [talkToMe, setTalkToMe] = useState("");
  const [settings, setSettings] = useState("");
  const [showUpdateLanguage, setShowUpdateLanguage] = useState(false);
  const [changeLanguage, setChangeLanguage] = useState("");

  //const secondaryColor = sessionStorage.getItem('secondaryColor')

  useEffect(() => {
    api
      .get(`/languages/${language}`)
      .then((response) => response.data)
      .then((data) => {
        const json = JSON.parse(data.languages[0].words);
        setWhoIAm(json.whoIAm);
        setWhatIKnow(json.whatIKnow);
        setMyProjects(json.myProjects);
        setTalkToMe(json.talkToMe);
        setSettings(json.settings || "Settings");
        setChangeLanguage(json.changeLanguage);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, []);

  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link class="nav-link active" to="/login">Logout</Link>
            </li>
            <li>
              <Link class="nav-link active" to="/register">Register</Link>
            </li>
            <li><Link class="nav-link active" to="/login">Login</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
