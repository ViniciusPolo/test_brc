import { React, useState, useEffect } from "react";

import api from "../services/api";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [name, setName] = useState("");
  const [btc, setBtc] = useState(1);
  const [usd, setUsd] = useState(1);
  const [unityBtc, setUnityBtc] = useState(1);
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
  const [ordersByUser, setOrdersByUser] = useState([]);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalSellPrice, setTotalSellPrice] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [totalBuyPrice, setTotalBuyPrice] = useState(0);
  const [blockButton, setBlockButton] = useState(true);

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
        .get(`/orders/opened`)
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
          if (!data) {
            data = [];
          }
          setLast(data);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`);
        });

        await api
        .get(`/orders/${localStorage.getItem("logged_user_id")}`)
        .then((response) => response.data)
        .then((data) => {
          if (!data) {
            data = [];
          }
          setOrdersByUser(data);
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
      .filter((o) => o.active && o.type_of_transaction === "SELL" && o.id_user != localStorage.getItem("logged_user_id"))
      .reduce(
        (accumulator, currentOrder) => accumulator + currentOrder.amount,
        0
      );
    setTotalSellAmount(totalSellAmount);
  };

  const calculateTotalSellPrice = () => {
    const totalSellPrice = orders
      .filter((o) => o.active && o.type_of_transaction == "SELL" && o.id_user != localStorage.getItem("logged_user_id"))
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
    setUnityBtc();
  };

  const calculoConversao = (moeda) => {
    axios
      .get("https://economia.awesomeapi.com.br/json/last/BTC-USD")
      .then((response) => response.data)
      .then((data) => {
        const askOrBid =
          typeOfTransaction == "BUY" ? data.BTCUSD.ask : data.BTCUSD.bid;
        if (moeda === "btc") {
          const usdConvertido = askOrBid * btc;
          setUsd(usdConvertido);
          setUnityBtc(parseFloat(askOrBid));
        }
        if (moeda === "usd") {
          const btcConvertido = usd / askOrBid;
          setBtc(btcConvertido);
          setUnityBtc(parseFloat(askOrBid));
        }
        setBlockButton(false);
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

  const buy = async (amount, price, quantityOrders) => {
    const fee = (price * 0.003) + data[4]
    var user_maker = 0
    if (quantityOrders == "one") {
      await api
        .get(
          `/orders/find-one/${data[0]}`
        )
        .then((response) => response.data)
        .then((dataApi) => {
          user_maker = dataApi.order.id_user
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });

      await api
        .patch(
          `/order/execute-order/${data[0]}`,
          {
            active: false,
            id_user: localStorage.getItem("logged_user_id"),
            type_of_transaction: data[1],
            fee: fee
          }
        )
        .then((response) => response.data)
        .then(() => {
          toast.success("Ordem Liquidada com sucesso!");
          setShowConfirmExecutionModal(false);
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });
      const newSaldoUsd = parseFloat(saldoUsd) - parseFloat(price) - fee;
      const newSaldoBtc = parseFloat(saldoBtc) + parseFloat(amount);
      ajustaSaldo(newSaldoUsd, newSaldoBtc, user_maker , "BUY", price, amount);
    } else {
      if (saldoUsd >= price) {
        try {
          await api
            .patch(
              `/order/execute-orders`,
              {
                active: false,
                id_user: localStorage.getItem("logged_user_id"),
                type_of_transaction: data[1],
                fee: fee
              }
            )
            .then((response) => response.data)
            .then(() => {
              toast.success("Ordem Liquidada com sucesso!");
              setShowConfirmAllExecutionsModal(false);
              setShowConfirmExecutionModal(false);
            })
            .catch((e) => {
              setShowConfirmAllExecutionsModal(false);
              toast.error("Houve um erro:" + e);
            });
        } catch (error) {}
        const newSaldoUsd = parseFloat(saldoUsd) - parseFloat(price) - fee;
        const newSaldoBtc = parseFloat(saldoBtc) + parseFloat(amount);
        ajustaSaldo(newSaldoUsd, newSaldoBtc, user_maker , "BUY", price, amount);
      } else {
        toast.error("Saldo USD insuficiente");
      }
    }
  };

  const sell = async (amount, price, quantityOrders) => {
    var user_maker = 0
    const fee = (price * 0.003) + data[4]
    if (quantityOrders == "one") {
      await api
        .get(
          `/orders/find-one/${data[0]}`
        )
        .then((response) => response.data)
        .then((dataApi) => {
          user_maker = dataApi.order.id_user
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });

      await api
      .patch(
        `/order/execute-order/${data[0]}`,
        {
          active: false,
          id_user: localStorage.getItem("logged_user_id"),
          type_of_transaction: data[1],
          fee : fee
        }
      )
        .then((response) => response.data)
        .then(() => {
          toast.success("Ordem Liquidada com sucesso!");
          setShowConfirmExecutionModal(false);
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });
      const newSaldoUsd = parseFloat(saldoUsd) + parseFloat(price) - fee;
      const newSaldoBtc = parseFloat(saldoBtc) - parseFloat(amount);
      ajustaSaldo(newSaldoUsd, newSaldoBtc, user_maker , "SELL", price, amount);
    } else {
      if (saldoBtc >= amount) {
        try {
          await api
            .patch(
              `/order/execute-orders`,
                {
                  active: false,
                  id_user: localStorage.getItem("logged_user_id"),
                  type_of_transaction: data[1],
                  fee: fee
                }
            )
            .then((response) => response.data)
            .then(() => {
              toast.success("Ordem Liquidada com sucesso!");
              setShowConfirmAllExecutionsModal(false);
              setShowConfirmExecutionModal(false);
            })
            .catch((e) => {
              setShowConfirmAllExecutionsModal(false);
              toast.error("Houve um erro:" + e);
            });
        } catch (error) {}
        const newSaldoUsd = parseFloat(saldoUsd) + parseFloat(price) - fee;
        const newSaldoBtc = parseFloat(saldoBtc) - parseFloat(amount);
        ajustaSaldo(newSaldoUsd, newSaldoBtc, user_maker, "SELL", price, amount);
      } else if (saldoBtc < amount && saldoBtc > 0) {
        try {
          var executedPrice = 0
          await api
            .get(`/orders/opened/${localStorage.getItem("logged_user_id")}`)
            .then((response) => response)
            .then((dataApi) => {
              var parcialAmount = saldoBtc / dataApi.data.length;
              var parcialPrice = amount / dataApi.data.length;
              var totalAmountOpenedOrders = 0;
              var partialPercentege;
              
              for (var i = 0; i < dataApi.data.length; i++) {
                totalAmountOpenedOrders += dataApi.data[i].amount;
              }
              for (var i = 0; i <= dataApi.data.length; i++) {
                partialPercentege =
                  dataApi.data[i].amount / totalAmountOpenedOrders;
                parcialAmount = saldoBtc * partialPercentege;
                parcialPrice = parcialAmount * unityBtc;
                executedPrice += parcialPrice

                api
                  .patch(
                    `/orders/execute-parcial-orders/${
                      dataApi.data[i].id}`,
                    {
                      active: false,
                      amount: parcialAmount,
                      id_user: localStorage.getItem("logged_user_id"),
                      price: parcialPrice,
                      type_of_transaction: "SELL",
                      fee: fee
                    }
                  )
                  .then((response) => response)
                  .then(() => {
                    toast.success("Ordem Liquidada com sucesso!");
                    setShowConfirmAllExecutionsModal(false);
                    setShowConfirmExecutionModal(false);
                  })
                  .catch((e) => {
                    console.error(`An error occurred: ${e}`);
                  });
              }
            })
            .catch((e) => {
              console.error(`An error occurred: ${e}`);
            });
        } catch (error) {}
        const newSaldoUsd = parseFloat(saldoUsd) + parseFloat(executedPrice) - fee;
        const newSaldoBtc = 0.0;
        ajustaSaldo(newSaldoUsd, newSaldoBtc, user_maker, "SELL", price, amount);
      } else {
        toast.error("Saldo USD insuficiente");
      }
    }
  };

  const executarOrdens = async (quantityOrders) => {
    setShowConfirmExecutionModal(true);
    if (data[1] == "BUY") sell(data[2], data[3], quantityOrders);
    if (data[1] == "SELL") buy(data[2], data[3], quantityOrders);
    setShowConfirmExecutionModal(false);
  };

  const ajustaSaldo = async (newSaldoUsd, newSaldoBtc, user_maker, type, price, amount) => {
    try {
      // ajusta saldo taker
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

        // ajusta saldo maker
        if (user_maker){
          var saldoBtcMaker = 0
          var saldoUsdMaker = 0
          await api
            .get(`/users/${user_maker}`)
            .then((response) => response.data)
            .then((dataApi) => {
              setName(dataApi.user.firstName);
              saldoBtcMaker = dataApi.user.btc ;
              saldoUsdMaker = dataApi.user.usd ;
            })
            .catch((e) => {
              console.error(`An error occurred: ${e}`);
            });
          if (type == "BUY") {
              saldoBtcMaker -= parseFloat(amount);
              saldoUsdMaker += parseFloat(price);
          } else if (type == "SELL") {
              saldoBtcMaker += parseFloat(amount);
              saldoUsdMaker -= parseFloat(price);
          }

          await api
          .patch(
            `/users/update-values/${user_maker}`,
            {
              btc: saldoBtcMaker,
              usd: saldoUsdMaker,
            }
          )
        .then(() => {
          toast.success("Maker Creditado ou Debitado!");
        })
        .catch((e) => {
          setShowConfirmExecutionModal(false);
          toast.error("Houve um erro:" + e);
        });
      }
    } catch (error) {}
    
  };

  const createOrder = () => {
    const fee = 0.005 * usd
    try {
      api
        .post(`/orders/${localStorage.getItem("logged_user_id")}`, {
          type_of_transaction: typeOfTransaction,
          amount: btc,
          price: usd,
          unity_price: unityBtc,
          fee: fee
        })
        .then((response) => response.data)
        .then((data) => {
          setShowTransactionModal(false);
          setShowConfirmOrderModal(false);
          ajustaSaldo(saldoUsd + fee, saldoBtc, null, null, null, null);
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
                onClick={() => executarOrdens("one")}
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
                onClick={() => setShowConfirmAllExecutionsModal(false)}
                value="Login"
                class="w-25 btn btn-dark m-3"
              >
                Sair
              </button>
              <button
                onClick={() => executarOrdens("many")}
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
                      class="input-group-text w-auto"
                      id="inputGroup-sizing-default"
                    >
                      BTC
                    </span>
                    <span
                      class="input-group-text w-auto"
                      id="inputGroup-sizing-auto"
                    >
                      ₿
                    </span>
                    <input
                      id="btc"
                      name="btc"
                      type="number"
                      placeholder="$ 0.0000"
                      onChange={(e) => conversor(e)}
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
                        onClick={() => {calculoConversao("btc")
                                        setBlockButton(false)}}
                      >
                        Converter
                      </button>
                    )}
                  </div>
                  <div class="row d-flex input-group mb-3">
                    <span
                      class="input-group-text w-auto"
                      id="inputGroup-sizing-default"
                    >
                      USD
                    </span>
                    <span
                      class="input-group-text w-auto"
                      id="inputGroup-sizing-auto"
                    >
                      $
                    </span>
                    <input
                      name="usd"
                      id="usd"
                      type="number"
                      placeholder="$ 0.00"
                      onChange={(e) => conversor(e)}
                        
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
                        onClick={() => {calculoConversao("usd")
                                        setBlockButton(false);
                      }}
                      >
                        Converter
                      </button>
                    )}
                  </div>
                  <div className="row d-flex justify-content-center align-items-center card-style">
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
                        onClick={() => {orderBuy()
                                        setBlockButton(true)}}
                        value="Login"
                        class="w-50 btn btn-primary m-3"
                        disabled={blockButton}
                      >
                        Investir
                      </button>
                    )}
                    {typeOfTransaction == "SELL" && (
                      <button
                        type="button"
                        onClick={() => {orderSell()
                                        setBlockButton(true)}}
                        value="Login"
                        class="w-50 btn btn-primary m-3"
                        disabled={blockButton}
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
      <div className="container border border-primary p-3 rounded-3 mb-3 card-style card-style card-style">
        <h2 class="row">Statistics</h2>
        <div
          class="table-responsive border border-secondary p-3"
          style={{ maxHeight: "200px" }}
        >
          <table class="table table-striped table-hover w-100">
            <tbody>
              <tr scope="row">
                <td>High</td>
                <td>₿ {high}</td>
              </tr>
              <tr scope="row">
                <td>Low</td>
                <td>₿ {low}</td>
              </tr>
              <tr scope="row">
                <td>User BTC Balance</td>
                <td>₿ {saldoBtc}</td>
              </tr>
              <tr scope="row">
                <td>User USD Balance</td>
                <td>₿ {saldoUsd}</td>
              </tr>
              <tr>
                <td>Last Price</td>
                <td>₿ {last.price / last.amount || 0}</td>
              </tr>
              <tr>
                <td>Sum of the last 24 hours/BTC </td>
                <td>₿ {lastDay.sumOfAmount || 0}</td>
              </tr>
              <tr>
                <td>Sum of the last 24 hours/USD </td>
                <td>$ {lastDay.sumOfPrice || 0}</td>
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
            GERAR ORDEM DE COMPRA DE BTC
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
            GERAR ORDEM DE VENDA DE BTC
          </button>
        </div>
      </div>

      <div className="container border border-primary p-3 rounded-3 mb-3 card-style">
        <h2 class="row">Ordens Abertas disponíveis para negociação</h2>
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
                .filter((o) => o.active && o.id_user != localStorage.getItem("logged_user_id"))
                .map((o) => {
                  const openedOrdersFiltered = orders.filter((o) => o.active);
                  if (openedOrdersFiltered.length >= 1) {
                    return (
                      <tr scope="row">
                        <td>{o.id}</td>
                        <td>₿ {o.amount}</td>
                        <td>$ {o.price}</td>
                        <td>{o.type_of_transaction == "BUY" ? "SELL" : "BUY"}</td>
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
                                  o.fee
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
      <div className="container border border-primary p-3 rounded-3 mb-3 card-style">
        <h2 class="row">Meu Histórico de Transações </h2>
        <div
          class="table-responsive border border-secondary p-3"
          style={{ maxHeight: "200px" }}
        >
          <table class="table table-striped table-hover w-100">
            <thead class="thead thead-dark">
              <th scope="col">Código Ordem</th>
              <th scope="col">Amount</th>
              <th scope="col">Price</th>
              <th scope="col">Type</th>
              <th scope="col">----</th>
            </thead>
            <tbody>
              {ordersByUser
                .filter((o) => !o.active)
                .map((o) => {
                  return (
                    <tr scope="row">
                      <td>{o.id}</td>
                      <td>₿ {o.amount}</td>
                      <td>$ {o.price}</td>
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

      <div className="container border border-primary p-3 rounded-3 mb-3 card-style">
        <h2 class="row">Soma das ordens disponíveis</h2>
        <div
          class="table-responsive border border-secondary p-3"
          style={{ maxHeight: "200px" }}
        >
          <table class="table table-striped table-hover w-100">
            <thead class="thead thead-dark">
              <th scope="col">----</th>
              <th scope="col">Price</th>
              <th scope="col">Volume</th>
              {/* <th scope="col">BID/ASK</th> */}
            </thead>
            <tbody>
              <tr scope="row">
                <td>BID</td>
                <td>$ {totalBuyPrice}</td>
                <td>₿ {totalBuyAmount}</td>
                {/* <td>
                  <button
                    class="btn btn-light"
                    onClick={() => {
                      setData([null, "BUY", totalBuyAmount, totalBuyPrice, , (totalBuyPrice * 0.003)]);
                      setShowConfirmAllExecutionsModal(true);
                    }}
                  >
                    Executar BID
                  </button>
                </td> */}
              </tr>
              <tr scope="row">
                <td>ASK</td>
                <td>$ {totalSellPrice}</td>
                <td>₿ {totalSellAmount}</td>
                {/* <td>
                  <button
                    class="btn btn-light"
                    onClick={() => {
                      setData([null, "SELL", totalSellAmount, totalSellPrice, (totalSellPrice * 0.003)]);
                      setShowConfirmAllExecutionsModal(true);
                    }}
                  >
                    Executar ASK
                  </button>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
