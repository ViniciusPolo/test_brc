import { React, useState, useEffect } from "react";

import api from "../../services/api";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [name, setName] = useState("");
  const [btc, setBtc] = useState(1);
  const [usd, setUsd] = useState(1);
  const [saldoBtc, setSaldoBtc] = useState(1);
  const [saldoUsd, setSaldoUsd] = useState(1);
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showConfirmExecutionModal, setShowConfirmExecutionModal] =
    useState(false);
  const [showConfirmAllExecutionsModal, setShowConfirmAllExecutionsModal] =
    useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [typeOfTransaction, setTypeOfTransaction] = useState("");
  const [currency, setCurrency] = useState("btc");
  const [data, setData] = useState([]);
  const [last, setLast] = useState([]);
  const [lastDay, setLastDay] = useState([]);
  const [high, setHigh] = useState(0);
  const [low, setLow] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalSellPrice, setTotalSellPrice] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [totalBuyPrice, setTotalBuyPrice] = useState(0);
  const [blockButton, setBlockButton] = useState(false)

  const fetchData = async () => {
    try {
      await axios
        .get("https://economia.awesomeapi.com.br/json/last/BTC-USD")
        .then((response) => response.data)
        .then((data) => data.BTCUSD)
        .then((data) => {
          setHigh(data.high);
          setLow(data.low);
        });

      await api
        .get(`/orders/${localStorage.getItem("logged_user_id")}`)
        .then((response) => response.data)
        .then((data) => {
          setOrders(data);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`);
        });

      await api
        .get(`/orders/last-order`)
        .then((response) => response.data)
        .then((data) => {
          console.log("data1",data)
          if (!data){
            data = []
          }
          console.log("data2",data)
          setLast(data);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`);
        });

      await api
        .get(`/orders/last-day/${localStorage.getItem("logged_user_id")}`)
        .then((response) => response.data)
        .then((data) => {
          setLastDay(data);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`);
        });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    api
      .get(`/users/${localStorage.getItem("logged_user_id")}`)
      .then((response) => response.data)
      .then((data) => {
        setName(data.user.firstName);
        setSaldoBtc(data.user.btc);
        setSaldoUsd(data.user.usd);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, []);

  useEffect(() => {
    calculateTotalSellAmount();
    calculateTotalSellPrice();
    calculateTotalBuyAmount();
    calculateTotalBuyPrice();
  }, [orders]);

  const calculateTotalSellAmount = () => {
    const totalSellAmount = orders
      .filter((o) => o.active && o.type_of_transaction === "SELL")
      .reduce(
        (accumulator, currentOrder) => accumulator + currentOrder.amount,
        0
      );
    setTotalSellAmount(totalSellAmount);
  };

  const calculateTotalSellPrice = () => {
    const totalSellPrice = orders
      .filter((o) => o.active && o.type_of_transaction === "SELL")
      .reduce(
        (accumulator, currentOrder) => accumulator + currentOrder.price,
        0
      );
    setTotalSellPrice(totalSellPrice);
  };

  const calculateTotalBuyAmount = () => {
    const totalBuyAmount = orders
      .filter((o) => o.active && o.type_of_transaction === "BUY")
      .reduce(
        (accumulator, currentOrder) => accumulator + currentOrder.amount,
        0
      );
    setTotalBuyAmount(totalBuyAmount);
  };

  const calculateTotalBuyPrice = () => {
    const totalBuyPrice = orders
      .filter((o) => o.active && o.type_of_transaction === "BUY")
      .reduce(
        (accumulator, currentOrder) => accumulator + currentOrder.price,
        0
      );
    setTotalBuyPrice(totalBuyPrice);
  };

  const conversor = (e) => {
    if (e.target.name == "btc") setBtc(e.target.value);
    if (e.target.name == "usd") setUsd(e.target.value);
  };

  const calculoConversao = (moeda) => {
    axios
      .get("https://economia.awesomeapi.com.br/json/last/BTC-USD")
      .then((response) => response.data)
      .then((data) => {
        if (moeda === "btc") {
          const usdConvertido = data.BTCUSD.bid * btc;
          setUsd(usdConvertido);
        }
        if (moeda === "usd") {
          const btcConvertido = usd / data.BTCUSD.bid;
          setBtc(btcConvertido);
        }
        setBlockButton(false)
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  };

  const orderBuy = () => {
    if (saldoUsd >= usd) {
      setShowConfirmOrderModal(true);
    } else {
      toast.error("Saldo USD insuficiente");
    }
  };

  const orderSell = () => {
    if (saldoBtc >= btc) {
      setShowConfirmOrderModal(true);
    } else {
      toast.error("Saldo BTC insuficiente");
    }
  };

  const buy = (amount, price) => {
    if (saldoUsd >= price) {
      const newSaldoUsd = parseFloat(saldoUsd) - parseFloat(price);
      const newSaldoBtc = parseFloat(saldoBtc) + parseFloat(amount);
      ajustaSaldo(newSaldoUsd, newSaldoBtc);
    } else {
      toast.error("Saldo USD insuficiente");
    }
  };

  const sell = (amount, price) => {
    if (saldoBtc >= amount) {
      const newSaldoUsd = parseFloat(saldoUsd) + parseFloat(price);
      const newSaldoBtc = parseFloat(saldoBtc) - parseFloat(amount);
      ajustaSaldo(newSaldoUsd, newSaldoBtc);
    } else {
      toast.error("Saldo BTC insuficiente");
    }
  };

  const executarOrdemIndividual = async () => {
    setShowConfirmExecutionModal(true);
    try {
      await api
        .patch(
          `/order/execute-order/${data[0]}/user/${localStorage.getItem(
            "logged_user_id"
          )}`,
          {
            active: false,
            type_of_transaction: data[1],
          }
        )
        .then((response) => response.data)
        .then(() => {
          if (data[1] == "SELL") sell(data[2], data[3]);
          if (data[1] == "BUY") buy(data[2], data[3]);
          toast.success("Ordem Liquidada com sucesso!");
          setShowConfirmExecutionModal(false);
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });
    } catch (error) {}
  };

  const executarOrdens = async () => {
    debugger;
    setShowConfirmExecutionModal(true);
    try {
      await api
        .patch(
          `/order/execute-orders/${localStorage.getItem("logged_user_id")}`,
          {
            active: false,
            type_of_transaction: data[1],
          }
        )
        .then((response) => response.data)
        .then(() => {
          if (data[1] == "SELL") sell(data[2], data[3]);
          if (data[1] == "BUY") buy(data[2], data[3]);
          toast.success("Ordem Liquidada com sucesso!");
          setShowConfirmAllExecutionsModal(false);
        })
        .catch((e) => {
          setShowConfirmAllExecutionsModal(false);
          toast.error("Houve um erro:" + e);
        });
    } catch (error) {}
  };

  const ajustaSaldo = async (newSaldoUsd, newSaldoBtc) => {
    try {
      await api
        .patch(
          `/users/update-values/${localStorage.getItem("logged_user_id")}`,
          {
            btc: newSaldoBtc,
            usd: newSaldoUsd,
          }
        )
        .then(() => {
          setSaldoBtc(newSaldoBtc);
          setSaldoUsd(newSaldoUsd);
          setShowConfirmExecutionModal(false);
          setShowTransactionModal(false);
          toast.success("Transação Executada com sucesso!");
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });
    } catch (error) {}
  };

  const createOrder = () => {
    try {
      api
        .post(`/orders/${localStorage.getItem("logged_user_id")}`, {
          type_of_transaction: typeOfTransaction,
          amount: btc,
          price: usd,
        })
        .then((response) => response.data)
        .then((data) => {
          setShowTransactionModal(false);
          setShowConfirmOrderModal(false);
          toast.success("Ordem Cadastrada com sucesso!");
        })
        .catch((e) => {
          setShowConfirmOrderModal(false);
          toast.error("Houve um erro:" + e);
        });
    } catch (error) {}
  };

  return (
    <>
      {showConfirmOrderModal && (
        <div class="z-3 position-absolute top-50 start-50 translate-middle container card w-25">
          <div class="container card-body">
            <h5 class="row d-flex justify-content-center card-title">
              Confirma Criação Ordem
            </h5>

            <div className="row d-flex justify-content-center align-items-center"></div>
            <div className="row d-flex justify-content-center align-items-center">
              <button
                onClick={() => setShowConfirmOrderModal(false)}
                value="Login"
                class="w-25 btn btn-dark m-3"
              >
                Sair
              </button>
              <button
                onClick={createOrder}
                value="Login"
                class="w-50 btn btn-primary m-3"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmExecutionModal && (
        <div class="z-3 position-absolute top-50 start-50 translate-middle container card w-25">
          <div class="container card-body">
            <h5 class="row d-flex justify-content-center card-title">
              Confirma negociação
            </h5>

            <div className="row d-flex justify-content-center align-items-center"></div>
            <div className="row d-flex justify-content-center align-items-center">
              <button
                onClick={() => setShowConfirmExecutionModal(false)}
                value="Login"
                class="w-25 btn btn-dark m-3"
              >
                Sair
              </button>
              <button
                onClick={() => executarOrdemIndividual()}
                value="Login"
                class="w-50 btn btn-primary m-3"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmAllExecutionsModal && (
        <div class="z-3 position-absolute top-50 start-50 translate-middle container card w-25">
          <div class="container card-body">
            <h5 class="row d-flex justify-content-center card-title">
              Confirma negociação
            </h5>

            <div className="row d-flex justify-content-center align-items-center"></div>
            <div className="row d-flex justify-content-center align-items-center">
              <button
                onClick={() => setShowConfirmExecutionModal(false)}
                value="Login"
                class="w-25 btn btn-dark m-3"
              >
                Sair
              </button>
              <button
                onClick={() => executarOrdens()}
                value="Login"
                class="w-50 btn btn-primary m-3"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {showTransactionModal && (
        <div class="z2 position-absolute top-50 start-50 translate-middle">
          <div class="z2 d-flex align-items-center justify-content-center vh-50">
            <div class="container card d-flex w-100 justify-content-center align-middle">
              <div class="container card-body">
                <h5 class="row d-flex justify-content-center card-title">
                  Altere os valores de conversão
                </h5>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    onChange={() => setCurrency("btc")}
                    checked={currency == "btc"}
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Converter por BTC
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    onChange={() => setCurrency("usd")}
                    checked={currency == "usd"}
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    Converter por USD
                  </label>
                </div>
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
                      type="number"
                      onChange={(e) => {conversor(e)
                                        setBlockButton(true)}}
                      value={btc}
                      class="form-control w-50"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-default"
                      disabled={currency == "usd"}
                    />
                    {currency == "btc" && (
                      <button
                        class="btn btn-outline-secondary w-25"
                        type="button"
                        id="button-addon2"
                        onClick={() => calculoConversao("btc")}
                      >
                        Convert
                      </button>
                    )}
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
                      type="number"
                      onChange={(e) => {conversor(e)
                                        setBlockButton(true)}}
                      value={usd}
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-default"
                      disabled={currency == "btc"}
                    />
                    {currency == "usd" && (
                      <button
                        class="btn btn-outline-secondary w-25"
                        type="button"
                        id="button-addon2"
                        onClick={() => calculoConversao("usd")}
                      >
                        Convert
                      </button>
                    )}
                  </div>
                  <div className="row d-flex justify-content-center align-items-center"></div>
                  <div className="row d-flex justify-content-center align-items-center">
                    <button
                      type="button"
                      onClick={() => setShowTransactionModal(false)}
                      value="Login"
                      class="w-25 btn btn-dark m-3"
                    >
                      Voltar
                    </button>
                    {typeOfTransaction == "BUY" && (
                      <button
                        type="button"
                        onClick={() => orderBuy()}
                        value="Login"
                        class="w-50 btn btn-primary m-3"
                        disabled = {blockButton}
                      >
                        Investir
                      </button>
                    )}
                    {typeOfTransaction == "SELL" && (
                      <button
                        type="button"
                        onClick={() => orderSell()}
                        value="Login"
                        class="w-50 btn btn-primary m-3"
                        disabled = {blockButton}
                      >
                        Resgatar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mb-3">
      <h2 class="row">Olá {name}, bem vindo ao seu monitor de Transações</h2>
      </div>
      <div className="container border border-primary p-3 rounded-3 mb-3">
        <h2 class="row">Statistics</h2>
        <div class="table-responsive border border-secondary p-3" style={{ maxHeight: "200px" }}>
          <table class="table table-striped table-hover w-100">
            <tbody>
              <tr scope="row">
                <td>High</td>
                <td>{high}</td>  
              </tr>
              <tr scope="row">
                <td>Low</td>
                <td>{low}</td>  
              </tr>
              <tr scope="row">
                <td>User BTC Balance</td>
                <td>{saldoBtc}</td>  
              </tr>
              <tr scope="row">
                <td>User USD Balance</td>
                <td>{saldoUsd}</td>   
              </tr>
              <tr>
                <td>Last Price</td>
                <td>{last.price/last.amount || 0}</td>   
              </tr>
              <tr>
                <td>Sum of the last 24 hours/BTC </td>
                <td>{lastDay.sumOfAmount || 0}</td>   
              </tr>
              <tr>
                <td>Sum of the last 24 hours/USD </td>
                <td>{lastDay.sumOfPrice || 0}</td>   
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="container">
        <div className="row justify-content-around">
          <button
            type="button"
            onClick={() => {
              setShowTransactionModal(true);
              setTypeOfTransaction("BUY");
            }}
            value="Login"
            class="w-25 btn btn-primary mb-3"
          >
            Investir BTC
          </button>
        
          <button
            type="button"
            onClick={() => {
              setShowTransactionModal(true);
              setTypeOfTransaction("SELL");
            }}
            value="Login"
            class="w-25 btn btn-primary mb-3"
          >
            Resgatar BTC
          </button>
        </div>
      </div>

            
      <div className="container border border-primary p-3 rounded-3  mb-3">
        <h2 class="row">Minhas Ordens Abertas </h2>
        <div class="table-responsive" style={{ maxHeight: "200px" }}>
          <table class="table table-striped table-hover w-100 border border-secondary p-3">
            <thead class="thead thead-dark">
              <th scope="col">Código Ordem</th>
              <th scope="col">Amount</th>
              <th scope="col">Price</th>
              <th scope="col">Type</th>
              <th scope="col">----</th>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.active)
                .map((o) => {
                  const openedOrdersFiltered = orders.filter(
                    (o) => o.active
                  );
                  console.log("ttttt", openedOrdersFiltered.length)
                  if (openedOrdersFiltered.length >= 1) {
                    return (
                      <tr scope="row">
                        <td>{o.id}</td>
                        <td>{o.amount}</td>
                        <td>{o.price}</td>
                        <td>{o.type_of_transaction}</td>
                        <td>
                          {o.active ? (
                            <button
                              class="btn btn-light"
                              onClick={() => {
                                setData([
                                  o.id,
                                  o.type_of_transaction,
                                  o.amount,
                                  o.price,
                                ]);
                                setShowConfirmExecutionModal(true);
                              }}
                            >
                              Executar ordem
                            </button>
                          ) : (
                            "X"
                          )}
                        </td>
                      </tr>
                    );
                  } else {
                    <tr scope="row">
                      <td rowSpan={5}>Sem ordens abertas</td>
                    </tr>;
                  }
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="container border border-primary p-3 rounded-3 mb-3">
        <h2 class="row">Meu Histórico de Transações </h2>
        <div class="table-responsive border border-secondary p-3" style={{ maxHeight: "200px" }}>
          <table class="table table-striped table-hover w-100">
            <thead class="thead thead-dark">
              <th scope="col">Código Ordem</th>
              <th scope="col">Amount</th>
              <th scope="col">Price</th>
              <th scope="col">Type</th>
              <th scope="col">----</th>
            </thead>
            <tbody>
              {orders
                .filter((o) => !o.active)
                .map((o) => {
                  return (
                    <tr scope="row">
                      <td>{o.id}</td>
                      <td>{o.amount}</td>
                      <td>{o.price}</td>
                      <td>{o.type_of_transaction}</td>
                      <td>
                        {o.active ? (
                          <button class="btn btn-light">Executar</button>
                        ) : (
                          "X"
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container border border-primary p-3 rounded-3  mb-3">
        <h2 class="row">ASK/BID </h2>
        <div class="table-responsive border border-secondary p-3" style={{ maxHeight: "200px" }}>
          <table class="table table-striped table-hover w-100">
            <thead class="thead thead-dark">
              <th scope="col">Price</th>
              <th scope="col">Volume</th>
              <th scope="col">BID/ASK</th>
            </thead>
            <tbody>
              <tr scope="row">
                <td>{totalBuyAmount}</td>
                <td>{totalBuyPrice}</td>
                <td>
                  <button
                    class="btn btn-light"
                    onClick={() => {
                      setData([null, "BUY", totalBuyAmount, totalBuyPrice]);
                      setShowConfirmAllExecutionsModal(true);
                    }}
                  >
                    Executar BID
                  </button>
                </td>
              </tr>
              <tr scope="row">
                <td>{totalSellAmount}</td>
                <td>{totalSellPrice}</td>
                <td>
                  <button
                    class="btn btn-light"
                    onClick={() => {
                      setData([null, "SELL", totalSellAmount, totalSellPrice]);
                      setShowConfirmAllExecutionsModal(true);
                    }}
                  >
                    Executar ASK
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
