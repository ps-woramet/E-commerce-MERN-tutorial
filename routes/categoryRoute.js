import express from "express";
import { createCategoryCtrl, getAllCategoryCtrl, getSingleCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoryCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggingIn.js";
import categoryFileUpload from '../config/categoryUpload.js'

const categoriesRouter = express.Router();

categoriesRouter.post('/', isLoggedIn, categoryFileUpload.single('file'), createCategoryCtrl);
categoriesRouter.get('/', getAllCategoryCtrl);
categoriesRouter.get('/:id', getSingleCategoryCtrl);
categoriesRouter.put('/:id', updateCategoryCtrl);
categoriesRouter.delete('/:id', deleteCategoryCtrl);

export default categoriesRouter;