const Orders = require("../models/OrdersModel");
const { Op, literal, fn, col } = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async indexAll(req, res) {
    try {
      const orders = await Orders.findAll();
      return res.json(orders);
    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async indexOne(req, res) {
    const { id } = req.params;
    try {
      const order = await Orders.findOne({
        where : {id : id}
    })
    return res.status(200).send({
        status: 1,
        message: `Order found`,
        order
    });
    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async indexLast(req, res) {
    try {
      const orders = await Orders.findOne({
        order: [["id", "DESC"]],
      });
      return res.json(orders);
    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async indexLastDay(req, res) {
    try {
        const { id_user } = req.params;

        const sumOfAmount = await Orders.sum('amount', {
          where: {
            id_user: id_user,
            createdAt: {
              [Op.gte]: literal("NOW() - INTERVAL '1 day'")
            }
          }
        });

        const sumOfPrice = await Orders.sum('price', {
            where: {
              id_user: id_user,
              createdAt: {
                [Op.gte]: literal("NOW() - INTERVAL '1 day'")
              }
            }
          });
    
        return res.json({ sumOfAmount, sumOfPrice });
    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async countOpenedOrders(req, res) {
    try {
        const { id_user } = req.params;

        const countOfOpenedOrders = await Orders.count({
          where: {
            id_user: id_user,
            active: true
          }
        });
    
        return res.status(200).send({
          status: 1,
          message: "Counted",
          countOfOpenedOrders
        })
    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async openedOrders(req, res) {
    try {
        //const { id_user } = req.params;

        const openedOrders = await Orders.findAll({
          where: {
            //id_user: id_user,
            active: true
          }
        });
    
        res.json(openedOrders);

    } catch (err) {
      return res.status(400).send("Broked ->" + err);
    }
  },

  async indexByIdUser(req, res) {
    const { id_user } = req.params;
    try {
      const orders = await Orders.findAll({
        where: { id_user: id_user },
      });
      return res.json(orders);
    } catch (err) {
      return res.status(400).send("Order Not Found" + err);
    }
  },

  async store(req, res) {
    try {
      const { id_user } = req.params;
      const { type_of_transaction, amount, price, unity_price, fee } = req.body;
      const orders = await Orders.create({
        id_user,
        type_of_transaction,
        amount,
        price,
        unity_price,
        fee
      });
      return res.status(200).send({
        status: 1,
        message: "Order sucessefull included",
        orders,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async executeOrders(req, res) {
    try {
      const { active, id_user ,type_of_transaction, fee } = req.body;

      const orders = await Orders.update(
        {
          active,
          id_user,
          fee
        },
        {
          where: {active: true, type_of_transaction: type_of_transaction },
        }
      );
      return res.status(200).send({
        status: 1,
        message: "Mountant sucessefull updated",
        orders,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async executeParcialOrders(req, res) {
    try {
      const { id } = req.params;
      const { active, id_user, amount, type_of_transaction, price, fee } = req.body;

      const orders = await Orders.update(
        {
          active,
          id_user,
          amount, 
          price,
          fee   
        },
        {
          where: { id: id, type_of_transaction: type_of_transaction },
        }
      );
      return res.status(200).send({
        status: 1,
        message: "Mountant sucessefull updated",
        orders,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async executeOneOrder(req, res) {
    try {
      const { id } = req.params;
      const { active, id_user, type_of_transaction, fee } = req.body;

      const orders = await Orders.update(
        {
          active,
          id_user,
          fee
        },
        {
          where: {
            id: id,
            type_of_transaction: type_of_transaction,
          },
        }
      );
      return res.status(200).send({
        status: 1,
        message: "Mountant sucessefull updated",
        orders,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
