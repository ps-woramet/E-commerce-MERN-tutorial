import express from "express";
import { createColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/ColorCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggingIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const colorsRouter = express.Router();

colorsRouter.post('/', isLoggedIn, isAdmin, createColorCtrl);
colorsRouter.get('/', getAllColorsCtrl);
colorsRouter.get('/:id', getSingleColorCtrl);
colorsRouter.put('/:id', isLoggedIn, isAdmin, updateColorCtrl);
colorsRouter.delete('/:id', isLoggedIn, isAdmin, deleteColorCtrl);

export default colorsRouter;