import { React, useState, useEffect } from "react";

import api from "../../services/api";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [btc, setBtc] = useState(1);
  const [usd, setUsd] = useState(1);
  const [saldoBtc, setSaldoBtc] = useState(1);
  const [saldoUsd, setSaldoUsd] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api
      .get(`/users/${localStorage.getItem("logged_user_id")}`)
      .then((response) => response.data)
      .then((data) => {
        setName(data.user.firstName);
        setSaldoBtc(data.user.btc)
        setSaldoUsd(data.user.usd)
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, []);

  const conversor = (e) => {
    if (e.target.name == "btc") setBtc(e.target.value);
    if (e.target.name == "usd") setUsd(e.target.value);
  };

  const calculoConversao = (moeda) => {
    axios
      .get("https://economia.awesomeapi.com.br/json/last/BTC-USD")
      .then((response) => response.data)
      .then((data) => {
        if(moeda === "btc"){
            const usdConvertido = data.BTCUSD.bid * btc
            setUsd(usdConvertido);
        } if (moeda === "usd") {
            const btcConvertido = usd / data.BTCUSD.bid
            setBtc(btcConvertido);
        }
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }

  const buy = () => {
    setShowModal(true)
    if(saldoUsd >= usd){
        console.log("Compra autorizada", showModal)
        setShowModal(true)
    } else {
        console.log("Saldo USD insuficiente")
    }

  }

  const sell = () => {
    setShowModal(true)
    if(saldoBtc >= btc){
        console.log("Venda autorizada")
    } else {
        console.log("Saldo BTC insuficiente")
    }
  };

  const realizarTransacao = () => {
    try {
        api
        .patch(`/users/update-values/${localStorage.getItem("logged_user_id")}`, {
            btc: btc,
            usd: usd,
          })
        .then((response) => response.data)
        .then((data) => {
          setName(data.user.firstName);
          setSaldoBtc(data.user.btc)
          setSaldoUsd(data.user.usd)
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`);
        });
    } catch (error) {
        
    }
  }

  return (
    <>
      {showModal && (
        <div class="z-3 position-absolute top-50 start-50 translate-middle container card w-25">
          <div class="container card-body">
            <h5 class="row d-flex justify-content-center card-title">Login</h5>

            <div className="row d-flex justify-content-center align-items-center"></div>
            <div className="row d-flex justify-content-center align-items-center">
              <button
                onClick={() => setShowModal(false)}
                value="Login"
                class="w-25 btn btn-dark mt-3"
              >
                Sair
              </button>
              <button
                onClick={() => setShowModal(false)}
                value="Login"
                class="w-50 btn btn-primary mt-3"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div class="z2 position-absolute top-50 start-50 translate-middle">
        <div class="z2 d-flex align-items-center justify-content-center vh-50">
          <div class="container card d-flex w-100 justify-content-center align-middle">
            <div class="container card-body">
              <h5 class="row d-flex justify-content-center card-title">
                Altere os valores de conversão
              </h5>
              <form>
                <div class="row d-flex input-group mb-3">
                  <span
                    class="input-group-text w-25"
                    id="inputGroup-sizing-default"
                  >
                    BTC
                  </span>
                  <input
                    id="btc"
                    name="btc"
                    type="text"
                    onChange={(e) => conversor(e)}
                    value={btc}
                    class="form-control w-50"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                  <button class="btn btn-outline-secondary w-25" type="button" id="button-addon2" onClick={() => calculoConversao("btc")}>Convert</button>
                </div>
                <div class="row d-flex input-group mb-3">
                  <span
                    class="input-group-text w-25"
                    id="inputGroup-sizing-default"
                  >
                    USD
                  </span>
                  <input
                    name="usd"
                    id="usd"
                    type="usd"
                    onChange={(e) => conversor(e)}
                    value={usd}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                <button class="btn btn-outline-secondary w-25" type="button" id="button-addon2" onClick={() => calculoConversao("usd")}>Convert</button>

                </div>
                <div className="row d-flex justify-content-center align-items-center"></div>
                <div className="row d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    onClick={() => buy()}
                    value="Login"
                    class="w-50 btn btn-primary mt-3"
                  >
                    Comprar BTC
                  </button>
                  <button
                    type="button"
                    onClick={() => sell()}
                    value="Login"
                    class="w-50 btn btn-primary mt-3"
                  >
                    Vender BTC
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
