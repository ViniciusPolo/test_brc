const Orders = require("../models/OrdersModel");
const { Op, literal, fn, col } = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async indexAll(req, res) {
    try {
      const orders = await Orders.findAll();
      // const orders = "texto teste"
      return res.json(orders);
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
      const { type_of_transaction, amount, price } = req.body;

      const orders = await Orders.create({
        id_user,
        type_of_transaction,
        amount,
        price,
      });
      return res.status(200).send({
        status: 1,
        message: "User sucessefull included",
        orders,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async executeOrders(req, res) {
    try {
      const { id_user } = req.params;
      const { active, type_of_transaction } = req.body;

      const orders = await Orders.update(
        {
          active,
        },
        {
          where: { id_user: id_user, type_of_transaction: type_of_transaction },
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
      const { id_user, id } = req.params;
      const { active, type_of_transaction } = req.body;

      const orders = await Orders.update(
        {
          active,
        },
        {
          where: {
            id: id,
            id_user: id_user,
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
