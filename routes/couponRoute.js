import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggingIn.js';
import { createCouponCtrl, getAllCouponsCtrl, getCoupontCtrl, updateCouponCtrl, deleteCouponCtrl } from '../controllers/couponsCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';

const couponRouter = express.Router();

couponRouter.post('/', isLoggedIn, isAdmin, createCouponCtrl);
couponRouter.get('/', getAllCouponsCtrl);
couponRouter.get('/:id', getCoupontCtrl);
couponRouter.put('/update/:id', isLoggedIn, isAdmin, updateCouponCtrl);
couponRouter.delete('/delete/:id', isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponRouter;