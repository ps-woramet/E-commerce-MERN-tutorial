import express from "express";
import { createReviewCtrl } from "../controllers/ReviewCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggingIn.js";

const reviewRouter = express.Router();

reviewRouter.post('/:productID', isLoggedIn, createReviewCtrl);

export default reviewRouter;


