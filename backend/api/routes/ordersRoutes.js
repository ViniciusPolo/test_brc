const express = require('express')
const router = express.Router()

const ordersController = require ('../controllers/ordersController');

router.get('/orders', ordersController.indexAll);
router.get('/orders/last-order', ordersController.indexLast);
router.get('/orders/last-day/:id_user', ordersController.indexLastDay);
router.get('/orders/:id_user', ordersController.indexByIdUser);

router.post('/orders/:id_user', ordersController.store);

router.patch('/order/execute-orders/:id_user', ordersController.executeOrders)
router.patch('/order/execute-order/:id/user/:id_user', ordersController.executeOneOrder)


module.exports = router