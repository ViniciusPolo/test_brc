const express = require('express')
const router = express.Router()

const ordersController = require ('../controllers/ordersController');

router.get('/orders', ordersController.indexAll);
router.get('/orders/last-order', ordersController.indexLast);
router.get('/orders/last-day/:id_user', ordersController.indexLastDay);
router.get('/orders/count-opened/:id_user', ordersController.countOpenedOrders);
router.get('/orders/opened', ordersController.openedOrders);

router.get('/orders/:id_user', ordersController.indexByIdUser);

router.post('/orders/:id_user', ordersController.store);

router.patch('/order/execute-orders', ordersController.executeOrders)
router.patch('/orders/execute-parcial-orders/:id', ordersController.executeParcialOrders);
router.patch('/order/execute-order/:id', ordersController.executeOneOrder)


module.exports = router