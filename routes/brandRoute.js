import express from "express";
import { createBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl, deleteBrandCtrl } from "../controllers/BrandCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggingIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get('/', getAllBrandsCtrl);
brandsRouter.get('/:id', getSingleBrandCtrl);
brandsRouter.put('/:id', isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete('/:id', isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRouter;