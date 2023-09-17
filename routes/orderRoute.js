import express  from "express";
import { isLoggedIn } from "../middlewares/isLoggingIn.js";
import { createOrderCtrl, getAllordersCtrl, getSingleOrderCtrl, updateOrderCtrl, getOrderStatsCtrl } from "../controllers/orderCtrl.js";

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn, createOrderCtrl)
orderRouter.get('/', isLoggedIn, getAllordersCtrl)
orderRouter.get('/:id', isLoggedIn, getSingleOrderCtrl)
orderRouter.put('/update/:id', isLoggedIn, updateOrderCtrl)
orderRouter.get('/sales/stats', isLoggedIn, getOrderStatsCtrl)

export default orderRouter;