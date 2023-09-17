1. create folders
    app, config, controllers, middleware, routes, utils, server.js

2. insall node.js
    E-commerce-mern-tutorial > npm init --yes
    E-commerce-mern-tutorial > npm i express mongoose
    E-commerce-mern-tutorial > npm i nodemon
    E-commerce-mern-tutorial > npm i dotenv
    //for hash password
    E-commerce-mern-tutorial > npm i bcryptjs
    //Error Handling
    E-commerce-mern-tutorial > npm i express-async-handler
    E-commerce-mern-tutorial > npm install jsonwebtoken
    E-commerce-mern-tutorial > npm install -g yarn
    E-commerce-mern-tutorial > npm install multer cloudinary multer-storage-cloudinary

3. create server

    package.json
        // loaded when run server
        "main": "server.js",
        // for import and export
        "type": "module",
        "scripts": {
            "server": "nodemon server.js",
            "start": "node server.js"
        },

    app > app.js

        import express from 'express';

        const app = express();

        export default app;

    server.js

        import http from "http";
        import app from './app/app.js'

        // create server
        const PORT = process.env.PORT || 2023
        const server = http.createServer(app)
        server.listen(PORT, console.log(`server is running on port ${PORT}`))
    
    E-commerce-mern-tutorial > yarn server

4. สร้าง User data model

    model > User.js

        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const UserShema = new Schema({
            fullname: {
                type: String,
                required: true,
            },
            email: {
                type:String,
                required: true,
            },
            password: {
                type:String,
                required: true,
            },
            orders: [
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Order",
                },
            ],
            wishLists: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "WishList",
                },
            ],
            hasShippingAddress: {
                type: Boolean,
                default: false,
            },
            shippingAddress: {
                firstname: {
                    type: String,
                },
                lastname: {
                    type: String,
                },
                address: {
                    type: String,
                },
                city: {
                    type: String,
                },
                postalCode: {
                    type: String,
                },
                province: {
                    type: String,
                },
                province: {
                    type: String,
                },
                country: {
                    type: String,
                },
                phone: {
                    type: String,
                },
            },
        }, {timestamps: true,})

5. connecting database

    install extension MongoDB for VS Code > logo > Add connenction > connecting > mongodb+srv://psworamet:admin123456@nodejs-ecommerce-api.wcldb5b.mongodb.net/

    connection string and environment variable from mongodb.commerce

        new project > node-ecommerce-api > create project

        free > Name: nodejs-ecommerce-api > create

        username: psworamet
        password: admin123456

        My Local Environment

        Add entries to your IP Access listen
        Ip Address: 0.0.0.0 > Add Entry > Finish

        MongoDB for VS Code > Copy mongodb+srv://psworamet:<password>@nodejs-ecommerce-api.wcldb5b.mongodb.net/ 

    config > dbConnect.js

        import mongoose from "mongoose";

        const dbConnect = async () => {
            try{
                const connected = await mongoose.connect(process.env.MONGO_URL);
                console.log(`Mongodb connected ${(connected).connection.host}`);
            }catch(error){
                console.log(`Error: ${error.message}`);
                process.exit(1);
            }
        };

        export default dbConnect;

    .env

        MONGO_URL = mongodb+srv://psworamet:admin123456@nodejs-ecommerce-api.wcldb5b.mongodb.net/

    app > app.js ทำการ import dotenv, dbConnect

        import dotenv from 'dotenv';
        dotenv.config();
        import express from 'express';
        import dbConnect from '../config/dbConnect.js';
        // dbConnect
        dbConnect();
        const app = express();

        export default app;

6. ทดสอบ create routes and controllers

    controllers > usersCtrl.js ทำการ import model user มาในไฟล์

        import User from '../model/User.js'

        //@desc Register user
        //@route POST /api/v1/users/register
        //@access Private/Admin

        export const registerUserCtrl = async (req, res) => {
            res.json({
                msg: "Uesr register controller",
            })
        }

    usersRoute.js ทำการ import registerUserCtrl มาในไฟล์

        import express from "express";
        import { registerUserCtrl } from "../controllers/usersCtrl.js";

        const userRouter = express.Router()

        userRouter.post('/api/v1/users/register', registerUserCtrl)

        export default userRouter;

    app > app.js

        // routes
        import userRouter from '../routes/usersRoute.js';
        app.use('/', userRouter)

    postman

        create workspace > name: nodejs-ecommerce-api > summary : nodejs-ecommerce-api > public > create workspace

        creaet workspace > collection name: nodejs-ecommerce-api

        nodejs-ecommerce-api collection > add folder name: Users > add request name: Register
        
            POST http://localhost:2023/api/v1/users/register

7. create userCtrl.js > registerUserCtrl

    controllers > userCtrl.js

        import User from '../model/User.js'

        //@desc Register user
        //@route POST /api/v1/users/register
        //@access Private/Admin

        export const registerUserCtrl = async (req, res) => {
            const {fullname, email, password} = req.body;
            //Check user exists
            const userExists = await User.findOne({email});
            if (userExists) {
                res.json({
                    msg: "user already exists"
                })
            }
            //hash password
            //create the user
            const user = await User.create({
                fullname,
                email,
                password,
            });
            res.status(201).json({
                status: "success",
                message: "User Registered Successsfully",
                data: user,
            });
        };

    app > app.js

        //pass incoming data
        app.use(express.json());

    postman

        post http://localhost:2023/api/v1/users/register
        body: raw json
        {
            "fullname" : "woramet",
            "email": "ps.woramet",
            "password": "admin123456"
        }

8. hash password

    npm i bcryptjs

    controllers > usersCtrl.js ทำการ hashpassword ก่อนสร้าง document

        import User from '../model/User.js';
        import bcrypt from 'bcryptjs';
        //@desc Register user
        //@route POST /api/v1/users/register
        //@access Private/Admin

        export const registerUserCtrl = async (req, res) => {
            const {fullname, email, password} = req.body;
            //Check user exists
            const userExists = await User.findOne({email});
            if (userExists) {
                res.json({
                    msg: "user already exists"
                })
            }
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //create the user
            const user = await User.create({
                fullname,
                email,
                password: hashedPassword,
            });
            res.status(201).json({
                status: "success",
                message: "User Registered Successsfully",
                data: user,
            });
        };
    
9. create userCtrl.js > loginUserCtrl

    controllers > usersCtrl.js
    
        //@desc Login user
        //@route POST /api/v1/user/login
        //@access Public
        export const loginUserCtrl = asyncHandler(async (req, res) => {
            const {email, password} = req.body;
            const userFound = await User.findOne({
                email,
            });
            if (userFound && (await bcrypt.compare(password, userFound?.password))){
                res.json({
                    status: 'success',
                    message: 'user logged in successsfully',
                    userFound,
                });  
            }else{
                res.json({msg: 'invalid login credentials'})
            }
        });

10. Error Handling ทำการสร้าง middleware ตรวจจับข้อผิดพลาดระหว่างการทำงานหลัง route handlers

    app.js

        import {globalErrhandler} from '../middlewares/globalErrHandler.js'

        //err middleware
        app.use(globalErrhandler);    

    middlewares > globalErrHandler.js

        export const globalErrhandler = (err, req, res ,next) => {
            //stack
            //message
            const stack = err?.stack;
            const statusCode = err?.statusCode ? err?.statusCode : 500;
            const message = err?.message;
            res.status(statusCode).json({
                stack,
                message,
            });
        };

    controllers > usersCtrl.js

        //@desc Register user
        //@route POST /api/v1/users/register
        //@access Private/Admin
        export const registerUserCtrl = asyncHandler(async (req, res) => {
            const {fullname, email, password} = req.body;
            //Check user exists
            const userExists = await User.findOne({email});
            if (userExists) {
                throw new Error('User already exists');
            }
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //create the user
            console.log(email)
            const user = await User.create({
                fullname,
                email,
                password: hashedPassword,
            });
            res.status(201).json({
                status: "success",
                message: "User Registered Successsfully",
                data: user,
            });
        });

    controllers > usersCtrl.js

        //@desc Login user
        //@route POST /api/v1/user/login
        //@access Public
        export const loginUserCtrl = asyncHandler(async (req, res) => {
            const {email, password} = req.body;
            const userFound = await User.findOne({
                email,
            });
            if (userFound && (await bcrypt.compare(password, userFound?.password))){
                res.json({
                    status: 'success',
                    message: 'user logged in successsfully',
                    userFound,
                });  
            }else{
                throw new Error('invalid login credentials')
            }
        });

11. Not Found Route handler

    middlewares > globalErrHandler.js

        //404 Handler
        export const notFound = (req, res, next) => {
            const err = new Error(`Route ${req.originalUrl} not found`);
            next(err);
        };

    app > app.js ทำการ use middleware notFound ก่อน globalErrHandler

        import {globalErrhandler, notFound} from '../middlewares/globalErrHandler.js'

        //err middleware
        app.use(notFound);
        app.use(globalErrhandler);

12. Mongoose Warning Fixed เพิ่ม mongoose.set('strictQuery', false);

    config > dbConnect.js

        import mongoose from "mongoose";

        const dbConnect = async () => {
            try{
                mongoose.set('strictQuery', false);
                const connected = await mongoose.connect(process.env.MONGO_URL);
                console.log(`Mongodb connected ${(connected).connection.host}`);
            }catch(error){
                console.log(`Error: ${error.message}`);
                process.exit(1);
            }
        };

        export default dbConnect;

13. Generate Token For Login User

    utils > generateToken.js

        import jwt from 'jsonwebtoken';

        const generateToken = (id) => {
            return jwt.sign({id}, process.env.JWT_KEY, {expiresIn: '3d'})
        }

        export default generateToken;

    controllers > usersCtrl.js ทำการ generate token เมื่อ user ทำการ login

        import generateToken from '../utils/generateToken.js';
        
        //@desc Login user
        //@route POST /api/v1/user/login
        //@access Public
        export const loginUserCtrl = asyncHandler(async (req, res) => {
            const {email, password} = req.body;
            const userFound = await User.findOne({
                email,
            });
            if (userFound && (await bcrypt.compare(password, userFound?.password))){
                res.json({
                    status: 'success',
                    message: 'user logged in successsfully',
                    userFound,
                    token: generateToken(userFound?._id),
                });  
            }else{
                throw new Error('invalid login credentials')
            }
        });

14. แก้ไข route โดยทำการเปลี่ยน path จากไฟล์ usersRoute.js ให้สั้นลงแล้วย้ายไปไฟล์ app แทน

    routes > usersRoute.js

        import express from "express";
        import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl } from "../controllers/usersCtrl.js";

        const userRoutes = express.Router()

        userRouter.post('/register', registerUserCtrl)
        userRouter.post('/login', loginUserCtrl)

        export default userRouter;

    app > app.js

        import userRouter from '../routes/usersRoute.js';
        app.use('/api/v1/users/', userRouter)

15. สร้าง Profile Route

    routes > userRoute.js

        import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl } from "../controllers/usersCtrl.js";
        userRouter.get('/profile', getUserProfileCtrl)

    controllers > userCtrl.js

        //@desc Get user profile
        //@route GET /api/v1/users/profile
        //@access Private
        export const getUserProfileCtrl = asyncHandler(async(req, res) => {
            res.json({
                msg: 'Welcome Profile page',
            });
        });

16. Get token from header
//เมื่อมีการ login จะทำการสร้าง token จากนั้นเมื่อทำการเข้าหน้า 
profile จะทำการนำ req เพื่อตรวจสอบ token ที่ส่งมาจาก header ว่ามีหรือไม่

    utils > getTokenFromHeader.js

        export const getTokenFromHeader = (req) => {
            //get token from header
            const token = req?.headers?.authorization?.split(" ")[1];
            if(token === undefined){
                return 'No token found in the header'
            }else{
                return token;
            }
        }
    
    controllers > usersCtrl.js

        //@desc Get user profile
        //@route GET /api/v1/users/profile
        //@access Private
        export const getUserProfileCtrl = asyncHandler(async(req, res) => {
            const token = getTokenFromHeader(req);
            res.json({
                msg: 'Welcome Profile page',
            });
        });

17. Verify Generated Token

    utils > verifyToken.js

        import jwt from 'jsonwebtoken';

        export const verifyToken = (token) => {
            return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if(err){
                    return 'Token expired/invalid'
                }else{
                    return decoded;
                }
            });
        };

    controllers > usersCtrl.js

        //@desc Get user profile
        //@route GET /api/v1/users/profile
        //@access Private
        export const getUserProfileCtrl = asyncHandler(async(req, res) => {
            const token = getTokenFromHeader(req);
            //verify token
            const verified = verifyToken(token);
            console.log(verified);
            res.json({
                msg: 'Welcome Profile page',
            });
        });

18. สร้าง isLogin middleware

    middlewares > isLoggingIn.js

        import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
        import { verifyToken } from "../utils/verifyToken.js";

        export const isLoggedIn = (req, res, next) => {

            //get token from header
            const token = getTokenFromHeader(req);
            //verify the token
            const decodedUser = verifyToken(token);
            
            if(!decodedUser){
                throw new Error('Invalid/Expired token, please login again')
            }else{
                //save the user into req obj
                req.userAuthId = decodedUser?.id;
                next();
            }
        };

    routes > usersRoute.js ทำการเรียก middleware ที่ path profile

        import { isLoggedIn } from "../middlewares/isLoggingIn.js";
        userRouter.get('/profile', isLoggedIn, getUserProfileCtrl)

    controllers > usersCtrl.js

        //@desc Get user profile
        //@route GET /api/v1/users/profile
        //@access Private
        export const getUserProfileCtrl = asyncHandler(async(req, res) => {
            const token = getTokenFromHeader(req);
            //verify token
            const verified = verifyToken(token);
            console.log(verified);
            res.json({
                msg: 'Welcome Profile page',
            });
        });
            
19. สร้าง product data model

    model > Product.js

        //product schema
        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const ProductSchema = new Schema({
            name: {
                type: String,
                require: true,
            },
            description: {
                type: String,
                require: true,
            },
            brand: {
                type: String,
                require: true,
            },
            catagory: {
                type: String,
                ref: "Catagory",
                requirede: true,
            },
            sizes: {
                type: [String],
                enaum: ["s","M","L","XL","XXL"],
                require: true,
            },
            colors: {
                type: [String],
                require: true,
            },
            images: [
                {
                    type: String,
                    default: 'https://via.placeholder.com/150',
                },
            ],
            reviews: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Review",
                },
            ],
            price: {
                type: Number,
                required: true,
            },
            totalQty: {
                type: Number,
                required: true,
            },
            totalSold: {
                type: Number,
                required: true,
                default: 0,
            },
        },
        {
            timestamps: true,
            toJSON: {virtuals: true},

        });

        const Product = mongoose.model("Product", ProductSchema);
        export default Product;
    
20. สร้าง Product controller, createproductCtrl

    controllers > productsCtrl.js

        import asyncHandler from 'express-async-handler'
        import Product from '../model/Product.js'

        // @desc Create new product
        // @route POST /api/v1/products
        // @access Private/Admin
        export const createProductCtrl = asyncHandler(async (req, res) => {
            const {name, description, brand, category, sizes, colors, user, price, totalQty}= req.body;
            //Priduct exists
            const productExists = await Product.findOne({name});
            if (productExists){
                throw new Error('Product Already Exists');
            }
            //create the product
            const product = await Product.create({
                name,
                description,
                brand,
                category,
                sizes,
                colors,
                user: req.userAuthId,
                price,
                totalQty,
            });
            //push the product into category
            //send response
            res.json({
                status: 'success',
                message: 'Product created successfully',
                product,
            });
        });

21. สร้าง Products Route

    routes > productsRoute.js // ทำการเรียก middleware isLoggedIn สำหรับสร้าง token

        import express from "express";
        import {createProductCtrl} from '../controllers/productsCtrl.js'
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";

        const productsRouter = express.Router()

        productsRouter.post('/', isLoggedIn, createProductCtrl)

        export default productsRouter;

    app > app.js

        import productsRouter from '../routes/productsRoute.js';
        app.use('/api/v1/products/', productsRouter)
    
    postman

        post http://localhost:2023/api/v1/products

        header

        key: Authorization
        value: bearer JWTTOKEN

        body:

            raw > json
                {
                    "name" :"Hats", 
                    "description" :"Best hat", 
                    "brand" :"LV", 
                    "category" :"Men", 
                    "sizes" :"XL", 
                    "colors" :"red", 
                    "price" :"300", 
                    "totalQty" :"200"
                }

22. สร้าง Product controller, getproductCtrl

    controllers > productsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {
            const products = await Product.find();
            res.json({
                status: 'success',
                products,
            });
        });

    routes > productsRoute.js

        import {createProductCtrl, getProductsCtrl} from '../controllers/productsCtrl.js'
        productsRouter.get('/', getProductsCtrl)

23. POSTMAN Environment

    postman

        environment quick look > ตั้งชื่อ NODEJS_API_DEV

            variable: baseURL
            current value: http://localhost:2023/api/v1

            variable: token
            current value: Bearer TOKENJWT

            save > เรียกใช้ NODEJS_API_DEV
            
            ตัวอย่าง
            แก้ไข url จาก http://localhost:2030/api/v1/users/profile > {{baseURL}}/users/profile 
            header 
            Authorization {{token}}

24. Filter Products By name

    controllers > productsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //await the query
            const products = await productQuery;
            console.log(products);

            res.json({
                status: 'success',
                products,
            });
        });

    POSTMAN

        GET {{baseURL}}/products?name=hats

25. Filter Products By colors, brands, catagory and Sizes

    controllers > productsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //search by brand
            if(req.query.brand){
                productQuery = productQuery.find({
                    brand: {$regex: req.query.brand, $options: 'i'},
                });
            }

            //search by category
            if(req.query.category){
                productQuery = productQuery.find({
                    category: {$regex: req.query.category, $options: 'i'},
                });
            }

            //search by color
            if(req.query.color){
                productQuery = productQuery.find({
                    color: {$regex: req.query.color, $options: 'i'},
                });
            }

            //search by size
            if(req.query.size){
                productQuery = productQuery.find({
                    size: {$regex: req.query.size, $options: 'i'},
                });
            }

            //await the query
            const products = await productQuery;
            console.log(products);

            res.json({
                status: 'success',
                products,
            });
        });

26. Filter Products By Price Range

    controllers > productsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //search by brand
            if(req.query.brand){
                productQuery = productQuery.find({
                    brand: {$regex: req.query.brand, $options: 'i'},
                });
            }

            //search by category
            if(req.query.category){
                productQuery = productQuery.find({
                    category: {$regex: req.query.category, $options: 'i'},
                });
            }

            //search by color
            if(req.query.color){
                productQuery = productQuery.find({
                    color: {$regex: req.query.color, $options: 'i'},
                });
            }

            //search by size
            if(req.query.size){
                productQuery = productQuery.find({
                    size: {$regex: req.query.size, $options: 'i'},
                });
            }

            //filter by price range
            if(req.query.price){
                const priceRange = req.query.price.split("-");
                //gte: greater of equal
                //lte: less than or equal to
                productQuery = productQuery.find({
                    price: { $gte: priceRange[0], $lte: priceRange[1]}
                });
            }

            //await the query
            const products = await productQuery;
            console.log(products);

            res.json({
                status: 'success',
                products,
            });
        });

    POSTMAN

        GET {{baseURL}}/products?price=10-400

27. Product Pagination (page = 1 : หน้าที่ 1, limit = 2 : ห้ามเกิน 2)

    controllers > prooductsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //search by brand
            if(req.query.brand){
                productQuery = productQuery.find({
                    brand: {$regex: req.query.brand, $options: 'i'},
                });
            }

            //search by category
            if(req.query.category){
                productQuery = productQuery.find({
                    category: {$regex: req.query.category, $options: 'i'},
                });
            }

            //search by color
            if(req.query.color){
                productQuery = productQuery.find({
                    color: {$regex: req.query.color, $options: 'i'},
                });
            }

            //search by size
            if(req.query.size){
                productQuery = productQuery.find({
                    size: {$regex: req.query.size, $options: 'i'},
                });
            }

            //filter by price range
            if(req.query.price){
                const priceRange = req.query.price.split("-");
                //gte: greater of equal
                //lte: less than or equal to
                productQuery = productQuery.find({
                    price: { $gte: priceRange[0], $lte: priceRange[1]}
                });
            }

            //pagination
            //page
            const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
            //limit
            const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
            //startIdx
            const startIndex = (page - 1) * limit;
            //endIdx
            const endIndex = page * limit;
            //total
            const total = await Product.countDocuments();

            productQuery = productQuery.skip(startIndex).limit(limit);

            //await the query
            const products = await productQuery;

            res.json({
                status: 'success',
                products,
            });
        });

    POSTMAN

        GET {{baseURL}}/products?page=1&limit=10

28. Pagination Results

    controllers > productsCtrl.js

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //search by brand
            if(req.query.brand){
                productQuery = productQuery.find({
                    brand: {$regex: req.query.brand, $options: 'i'},
                });
            }

            //search by category
            if(req.query.category){
                productQuery = productQuery.find({
                    category: {$regex: req.query.category, $options: 'i'},
                });
            }

            //search by color
            if(req.query.color){
                productQuery = productQuery.find({
                    color: {$regex: req.query.color, $options: 'i'},
                });
            }

            //search by size
            if(req.query.size){
                productQuery = productQuery.find({
                    size: {$regex: req.query.size, $options: 'i'},
                });
            }

            //filter by price range
            if(req.query.price){
                const priceRange = req.query.price.split("-");
                //gte: greater of equal
                //lte: less than or equal to
                productQuery = productQuery.find({
                    price: { $gte: priceRange[0], $lte: priceRange[1]}
                });
            }

            //pagination
            //page
            const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
            //limit
            const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
            //startIdx
            const startIndex = (page - 1) * limit;
            //endIdx
            const endIndex = page * limit;
            //total
            const total = await Product.countDocuments();

            productQuery = productQuery.skip(startIndex).limit(limit);

            //pagination results
            const pagination = {};
            if (endIndex < total){
                pagination.next = {
                    page: page + 1,
                    limit,
                };
            }
            if (startIndex > 0){
                pagination.prev = {
                    page: page -  1,
                    limit,
                };
            }

            //await the query
            const products = await productQuery;

            res.json({
                status: 'success',
                total,
                results: products.length,
                pagination,
                message: 'Products fetched successfully',
                products,
            });
        });

29. create getProductCtrl. route getProductCtrl

    controllers > productsRoute.js

        // @desc Get single product
        // @route GET /api/v1/products/:id
        // @access Public
        export const getProductCtrl = asyncHandler(async (req, res) => {
            const product = await Product.findById(req.params.id);
            if(!product){
                throw new Error('Product not found');
            }
            res.json({
                status: 'success',
                message: 'Product fetched successfully',
                product,
            });
        });
    
    routes > usersRoute

        import {createProductCtrl, getProductsCtrl, getProductCtrl} from '../controllers/productsCtrl.js'
        productsRouter.get('/:id', getProductCtrl)

    POSTMAN

        GET {{baseURL}}/products/idของproduct


30. create getProductCtrl. route getProductCtrl

    controllers > productsCtrl.js

        // @desc Update product
        // @route PUT /api/v1/products/:id/update
        // @access Private/Admin
        export const updateProductCtrl = asyncHandler(async (req, res) => {
            const {
                name,
                description,
                brand,
                category,
                sizes,
                colors,
                user,
                price,
                totalQty,
            } = req.body;
            const product = await Product.findByIdAndUpdate(req.params.id, {
                name,
                description,
                brand,
                category,
                sizes,
                colors,
                user,
                price,
                totalQty,
            },{
                new: true,
            })
            res.json({
                status: 'success',
                message: 'Product updated successfully',
                product,
            });
        });

    routes > productsRoute.js

        import {createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl} from '../controllers/productsCtrl.js'
        productsRouter.put('/:id', isLoggedIn, updateProductCtrl)

    POSTMAN

        put {{baseURL}}/products/idของproduct

            header: Authorization {{token}}
            body: raw json
                {
                        "name" :"t-shirt 2"
                }

31. create deleteProductCtrl. route deleteProductCtrl

    controller > productsCtrl.js

        // @desc Delete product
        // @route Delete /api/v1/products/:id/delete
        // @access Private/Admin
        export const deleteProductCtrl = asyncHandler(async (req, res) => {
            await Product.findByIdAndDelete(req.params.id);
            res.json({
                status: 'success',
                message: 'Product deleted successfully',
            });
        });

    routes > productsRoute.js

        import {createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl,deleteProductCtrl} from '../controllers/productsCtrl.js'
        productsRouter.delete('/:id/delete', isLoggedIn, deleteProductCtrl)

    POSTMAN

        DELETE {{baseURL}}/products/idของproduct/delete

32. model, CRUD categoryCtrl, route categories

    model > category.js

        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const CategorySchema = new Schema(
            {
                name: {
                    type: String,
                    require: true,
                },
                user:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                    required: true,
                },
                image:{
                    type: String,
                    default: 'https://picsum.photos/200/300',
                    require: true,
                },
                products: [
                    {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                }
            ],
            },{
                timestamps: true
            }
        );

        const Category = mongoose.model('Category', CategorySchema);

        export default Category;

    controllers > categoryCtrl.js

        import asyncHandler from "express-async-handler";
        import Category from "../model/Category.js";

        //@desc Create new category
        //@route POST /api/v1/categories
        //@access Private/Admin
        export const createCategoryCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //category exists
            const categoryFound = await Category.findOne({name})
            if(categoryFound){
                throw new Error('Category already exists')
            }
            //create
            const category = await Category.create({
                name,
                user: req.userAuthId,
            });

            res.json({
                status: 'success',
                message: 'Category created successfully',
                category,
            });
        });

        //@desc Get all category
        //@route GET /api/v1/categories
        //@access Public
        export const getAllCategoryCtrl = asyncHandler(async (req, res) => {
            const categories = await Category.find()

            res.json({
                status: 'success',
                message: 'Category fetched successfully',
                categories,
            });
        });

        //@desc Get single category
        //@route GET /api/v1/categories/:id
        //@access Public
        export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
            const category = await Category.findById(req.params.id)

            res.json({
                status: 'success',
                message: 'Category fetched successfully',
                category,
            });
        });

        //@desc Update category
        //@route PUT /api/v1/categories/:id
        //@access Private/Admin
        export const updateCategoryCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //update
            const category = await Category.findByIdAndUpdate(
                req.params.id,{name,},{new:true,}
            );
            console.log(category)

            res.json({
                status: 'success',
                message: 'Category updated successfully',
                category,
            });
        });

        //@desc delete category
        //@route DELETE /api/categories/:id
        //@access Private/Admin
        export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
            await Category.findByIdAndDelete(req.params.id)
            res.json({
                status: 'success',
                message: 'Category deleted successfully',
            });
        });

    routes > categoryRoute.js

        import express from "express";
        import { createCategoryCtrl, getAllCategoryCtrl, getSingleCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoryCtrl.js";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";

        const categoriesRouter = express.Router();

        categoriesRouter.post('/', isLoggedIn, createCategoryCtrl);
        categoriesRouter.get('/', getAllCategoryCtrl);
        categoriesRouter.get('/:id', getSingleCategoryCtrl);
        categoriesRouter.put('/:id', updateCategoryCtrl);
        categoriesRouter.delete('/:id', deleteCategoryCtrl);

        export default categoriesRouter;

    app > app.js

        import categoriesRouter from '../routes/categoryRoute.js';
        app.use('/api/v1/categories/', categoriesRouter)

33. เรามี model 
    ชื่อ const Product = mongoose.model("Product", ProductSchema);
    ชื่อ const Category = mongoose.model('Category', CategorySchema);

    เนื่องจาก model Product.js มีค่า     
        catagory: {
            type: String,
            ref: "Catagory",
            requirede: true,
        },
    และ model Category.js มีค่า
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ]
    จะเห็นได้ว่า model ทั้งสองมีความสัมพันธ์กัน
    ซึ่งเมื่อเราต้องการสร้างสินค้า เราต้องทำการเพิ่มหมวดหมู่
    โดย productsCtrl จะทำการค้นหาหมวดหมู่จากตารางของหมวดหมู่ ว่ามีชื่อนี้หรือไม่
    จากนั้นนำ idของproduct ไปเก็บในตารางของ category ที่ array products
    จากนั้นทำการ save

        controllers > productsCtrl.js

            import asyncHandler from 'express-async-handler'
            import Product from '../model/Product.js'
            import Category from '../model/Category.js';

            // @desc Create new product
            // @route POST /api/v1/products
            // @access Private/Admin
            export const createProductCtrl = asyncHandler(async (req, res) => {
                const {name, description, brand, category, sizes, colors, user, price, totalQty}= req.body;
                //Priduct exists
                const productExists = await Product.findOne({name});
                if (productExists){
                    throw new Error('Product Already Exists');
                }
                //find the category
                const categoryFound = await Category.findOne({
                    name: category,
                });
                if(!categoryFound){
                    throw new Error('Category not found, please create category first or check category name')
                }
                //create the product
                const product = await Product.create({
                    name,
                    description,
                    brand,
                    category,
                    sizes,
                    colors,
                    user: req.userAuthId,
                    price,
                    totalQty,
                });
                //push the product into category
                categoryFound.products.push(product._id);
                //resave
                await categoryFound.save();
                //send response
                res.json({
                    status: 'success',
                    message: 'Product created successfully',
                    product,
                });
            });

        controllers > categoryCtrl.js ทำให้ชื่อ catagory เป็นตัวพิมพ์เล็กเมื่อสร้าง catagory ด้วย .toLowerCase()

            //@desc Create new category
            //@route POST /api/v1/categories
            //@access Private/Admin
            export const createCategoryCtrl = asyncHandler(async (req, res) => {
                const {name} = req.body;
                //category exists
                const categoryFound = await Category.findOne({name})
                if(categoryFound){
                    throw new Error('Category already exists')
                }
                //create
                const category = await Category.create({
                    name: name.toLowerCase(),
                    user: req.userAuthId,
                });

                res.json({
                    status: 'success',
                    message: 'Category created successfully',
                    category,
                });
            });
        
34. model, CRUD categoryCtrl, route categories

    model > Brand.js

        //Brand Schema
        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const BrandSchema = new Schema({
            name: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true,
            },
            products: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
            ],
        },{timestamps: true});

        const Brand = mongoose.model("Brand", BrandSchema);

        export default Brand;

    controllers > BrandCtrl.js

        import asyncHandler from 'express-async-handler';
        import Brand from '../model/Brand.js';

        //@desc Create new brand
        //@route POST /api/v1/brands
        //@access Private/Admin
        export const createBrandCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //brand exists
            const brandFound = await Brand.findOne({name})
            if(brandFound){
                throw new Error('Brand already exists')
            }
            //create
            const brand = await Brand.create({
                name: name.toLowerCase(),
                user: req.userAuthId,
            });

            res.json({
                status: 'success',
                message: 'Brand created successfully',
                brand,
            });
        });

        //@desc Get all brands
        //@route GET /api/v1/brands
        //@access Public
        export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
            const brands = await Brand.find()

            res.json({
                status: 'success',
                message: 'Brands fetched successfully',
                brands,
            });
        });

        //@desc Get single brand
        //@route GET /api/v1/brands/:id
        //@access Public
        export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
            const brand = await Brand.findById(req.params.id)

            res.json({
                status: 'success',
                message: 'Brand fetched successfully',
                brand,
            });
        });

        //@desc Update brand
        //@route PUT /api/v1/brands/:id
        //@access Private/Admin
        export const updateBrandCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //update
            const brand = await Brand.findByIdAndUpdate(
                req.params.id,{name,},{new:true,}
            );

            res.json({
                status: 'success',
                message: 'Brand updated successfully',
                brand,
            });
        });

        //@desc delete brand
        //@route DELETE /api/brands/:id
        //@access Private/Admin
        export const deleteBrandCtrl = asyncHandler(async (req, res) => {
            await Brand.findByIdAndDelete(req.params.id)
            res.json({
                status: 'success',
                message: 'Brand deleted successfully',
            });
        });

    routes > brandRoute.js

        import express from "express";
        import { createBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl, deleteBrandCtrl } from "../controllers/BrandCtrl.js";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";

        const brandsRouter = express.Router();

        brandsRouter.post('/', isLoggedIn, createBrandCtrl);
        brandsRouter.get('/', getAllBrandsCtrl);
        brandsRouter.get('/:id', getSingleBrandCtrl);
        brandsRouter.put('/:id', updateBrandCtrl);
        brandsRouter.delete('/:id', deleteBrandCtrl);

        export default brandsRouter;

    app > app.js

        import brandsRouter from '../routes/brandRoute.js';
        app.use('/api/v1/brands/', brandsRouter)

35. เรามี model 
    ชื่อ const Product = mongoose.model("Product", ProductSchema);
    ชื่อ const Brand = mongoose.model("Brand", BrandSchema);

    เนื่องจาก model Product.js มีค่า     
        brand: {
            type: String,
            require: true,
        },
    และ model Brand.js มีค่า
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],

    ซึ่งเมื่อเราต้องการสร้างสินค้า เราต้องทำการเพิ่มหมวดหมู่
    โดย productsCtrl จะทำการค้นหา brand จากตารางของ bran ว่ามีชื่อนี้หรือไม่
    จากนั้นนำ idของproduct ไปเก็บในตารางของ brand ที่ array products
    จากนั้นทำการ save

36. model, CRUD colorCtrl, route colors

    model > Color.js

        //Color Schema
        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const ColorSchema = new Schema({
            name: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            products: [
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
            ],
        }, {timestamps: true});

        const Color = mongoose.model('Color', ColorSchema);
        export default Color;

    controllers > colorCtrl.js

        import asyncHandler from 'express-async-handler';
        import Color from '../model/Color.js';

        //@desc Create new color
        //@route POST /api/v1/colors
        //@access Private/Admin
        export const createColorCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //color exists
            const colorFound = await Color.findOne({name})
            if(colorFound){
                throw new Error('Color already exists')
            }
            //create
            const color = await Color.create({
                name: name.toLowerCase(),
                user: req.userAuthId,
            });

            res.json({
                status: 'success',
                message: 'Color created successfully',
                color,
            });
        });

        //@desc Get all colors
        //@route GET /api/v1/colors
        //@access Public
        export const getAllColorsCtrl = asyncHandler(async (req, res) => {
            const colors = await Color.find()

            res.json({
                status: 'success',
                message: 'Colors fetched successfully',
                colors,
            });
        });

        //@desc Get single color
        //@route GET /api/v1/colors/:id
        //@access Public
        export const getSingleColorCtrl = asyncHandler(async (req, res) => {
            const color = await Color.findById(req.params.id)

            res.json({
                status: 'success',
                message: 'Color fetched successfully',
                color,
            });
        });

        //@desc Update color
        //@route PUT /api/v1/colors/:id
        //@access Private/Admin
        export const updateColorCtrl = asyncHandler(async (req, res) => {
            const {name} = req.body;
            //update
            const color = await Color.findByIdAndUpdate(
                req.params.id,{name,},{new:true,}
            );

            res.json({
                status: 'success',
                message: 'Color updated successfully',
                color,
            });
        });

        //@desc delete color
        //@route DELETE /api/colors/:id
        //@access Private/Admin
        export const deleteColorCtrl = asyncHandler(async (req, res) => {
            await Color.findByIdAndDelete(req.params.id)
            res.json({
                status: 'success',
                message: 'Color deleted successfully',
            });
        });
    
    routes > colorRoute.js

        import express from "express";
        import { createColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/ColorCtrl.js";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";

        const colorsRouter = express.Router();

        colorsRouter.post('/', isLoggedIn, createColorCtrl);
        colorsRouter.get('/', getAllColorsCtrl);
        colorsRouter.get('/:id', getSingleColorCtrl);
        colorsRouter.put('/:id', updateColorCtrl);
        colorsRouter.delete('/:id', deleteColorCtrl);

        export default colorsRouter;

    app > app.js

        import colorsRouter from '../routes/colorRoute.js';
        app.use('/api/v1/colors/', colorsRouter)

37. model, Create review ctrl, route review

    model > Review.js

        //Review Schema
        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const ReviewSchema = new Schema({
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: [true, 'Review must belong to a user'],
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Review must belong to a product'],
            },
            message: {
                type: String,
                required: [true, 'Please add a message'],
            },
            rating: {
                type: Number,
                required: [true, 'Please add a rating between 1 and 5'],
                min: 1,
                max: 5,
            },
        },{
            timestamps: true,
        }
        );

        const Review = mongoose.model('Review', ReviewSchema);
        export default Review;

    controllers > ReviewCtrl.js 
    ทำการ .populate('reviews') ที่ product เพื่อให้เข้าถึง reviews โดยไม่ต้อง query อีกครั้ง และ ตรวจสอบว่าผู้ใช้ review หรือยัง
    const hasReviewed = productFound?.reviews?.find((review)=>{
            console.log(review)
            return review?.user?.toString() === req?.userAuthId?.toString();
        });
        if(hasReviewed){
            throw new Error('You have already reviewed this product');
    }


        import asyncHandler from 'express-async-handler';
        import Review from '../model/Review.js';
        import Product from '../model/Product.js';

        //@desc Create new review
        //@route POST /api/v1/reviews
        //@access Private/Admin
        export const createReviewCtrl = asyncHandler(async (req, res) => {
            const {product,message, rating} = req.body
            // 1. find the product
            const {productID} = req.params;
            const productFound = await Product.findById(productID).populate('reviews');
            if(!productFound){
                throw new Error('Product Not Found');
            }
            //check if user already reviewed this product
            const hasReviewed = productFound?.reviews?.find((review)=>{
                console.log(review)
                return review?.user?.toString() === req?.userAuthId?.toString();
            });
            if(hasReviewed){
                throw new Error('You have already reviewed this product');
            }
            //create review
            const review = await Review.create({
                message,
                rating,
                product: productFound?._id,
                user: req.userAuthId,
            });
            //Push review into product Found
            productFound.reviews.push(review?._id);
            //resave
            await productFound.save();
            res.status(201).json({
                success: true,
                message: 'Review create successfully'
            });
        });
    
    routes > reviewRoute.js

        import express from "express";
        import { createReviewCtrl } from "../controllers/ReviewCtrl.js";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";

        const reviewRouter = express.Router();

        reviewRouter.post('/:productID', isLoggedIn, createReviewCtrl);

        export default reviewRouter;

    app > app.js

        import reviewRouter from '../routes/reviewRoute.js';
        app.use('/api/v1/reviews/', reviewRouter)

    controllers > productCtrl.js
    แก้ไข productCtrl.js 
    เพิ่ม const products = await productQuery.populate('reviews'); ที่ getProductsCtrl
    เพิ่ม const product = await Product.findById(req.params.id).populate('reviews'); ที่ getProductCtrl

        // @desc Get all products
        // @route GET /api/v1/products
        // @access Public
        export const getProductsCtrl = asyncHandler(async(req, res) => {

            //query
            let productQuery = Product.find()
            console.log(productQuery);

            //search by name
            if(req.query.name){
                productQuery = productQuery.find({
                    name: {$regex: req.query.name, $options: 'i'},
                });
            }

            //search by brand
            if(req.query.brand){
                productQuery = productQuery.find({
                    brand: {$regex: req.query.brand, $options: 'i'},
                });
            }

            //search by category
            if(req.query.category){
                productQuery = productQuery.find({
                    category: {$regex: req.query.category, $options: 'i'},
                });
            }

            //search by color
            if(req.query.color){
                productQuery = productQuery.find({
                    color: {$regex: req.query.color, $options: 'i'},
                });
            }

            //search by size
            if(req.query.size){
                productQuery = productQuery.find({
                    size: {$regex: req.query.size, $options: 'i'},
                });
            }

            //filter by price range
            if(req.query.price){
                const priceRange = req.query.price.split("-");
                //gte: greater of equal
                //lte: less than or equal to
                productQuery = productQuery.find({
                    price: { $gte: priceRange[0], $lte: priceRange[1]}
                });
            }

            //pagination
            //page
            const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
            //limit
            const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
            //startIdx
            const startIndex = (page - 1) * limit;
            //endIdx
            const endIndex = page * limit;
            //total
            const total = await Product.countDocuments();

            productQuery = productQuery.skip(startIndex).limit(limit);

            //pagination results
            const pagination = {};
            if (endIndex < total){
                pagination.next = {
                    page: page + 1,
                    limit,
                };
            }
            if (startIndex > 0){
                pagination.prev = {
                    page: page -  1,
                    limit,
                };
            }

            //await the query
            const products = await productQuery.populate('reviews');

            res.json({
                status: 'success',
                total,
                results: products.length,
                pagination,
                message: 'Products fetched successfully',
                products,
            });
        });

        // @desc Get single product
        // @route GET /api/v1/products/:id
        // @access Public
        export const getProductCtrl = asyncHandler(async (req, res) => {
            const product = await Product.findById(req.params.id).populate('reviews');
            if(!product){
                throw new Error('Product not found');
            }
            res.json({
                status: 'success',
                message: 'Product fetched successfully',
                product,
            });
        });

    model > Product.js เพิ่ม virtual เพื่อคำนวณผลการ review

        //Virtuals
        //Total rating
        ProductSchema.virtual('totalReviews').get(function(){
            const product = this;
            return product?.reviews?.length;
        });
        //average Rating
        ProductSchema.virtual('averageRating').get(function(){
            let ratingsTotal = 0;
            const product = this;
            product?.reviews?.forEach((review)=>{
                ratingsTotal += review?.rating;
            })
            //calc average rating
            const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(1);
            return averageRating;
        });

38. model, Create order ctrl, route order, product order processing

    model > Order.js

        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;
        //Generate random numbers for order
        const randomTxt = Math.random().toString(36).substring(7).toLocaleLowerCase();
        const randomNumbers = Math.floor(1000+Math.random()*90000)

        const OrderSchema = new Schema({
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true,
            },
            orderItems: [
                {
                    type: Object,
                    requiredPaths: true,
                },
            ],
            shippingAddress: {
                type: Object,
                required: true,
            },
            orderNumber: {
                type: String,
                default: randomTxt + randomNumbers,
            },
            // For stripe payment
            paymentStatus:{
                type: String,
                default: 'Not paid',
            },
            paymentMethod: {
                type: String,
                default: 'Not specified'
            },
            totalPrice: {
                type: Number,
                default: 0.0,
            },
            currency: {
                type: String,
                default: 'Not specified',
            },
            // For admin
            status: {
                type: String,
                default: 'pending',
                enum: ['pending', 'processing', 'shipped', 'delivered']
            },
            deliveredAt: {
                type: Date,
            },
        }, {
            timestamps: true,
        });

        //compile to form model
        const Order = mongoose.model('Order', OrderSchema);

        export default Order;

    controllers > orderCtrl.js

        import Order from '../model/Order.js'
        import User from '../model/User.js'
        import Product from '../model/Product.js'
        import asyncHandler from 'express-async-handler'

        //@desc create orders
        //@route POST /api/v1/orders
        //@access private

        export const createOrderCtrl = asyncHandler(async (req, res) => {
            //Get the payload(customer, orderItems, shippingAddress, totalPrice);
            const {orderItems, shippingAddress, totalPrice} = req.body;
            console.log({
                orderItems,
                shippingAddress,
                totalPrice,
            });
            //Find the User
            const user = await User.findById(req.userAuthId);
            //Check if user has shipping address
            if(!user?.hasShippingAddress){
                throw new Error('Please provide shipping address');
            }

            //Check if order is not empty
            if(orderItems?.length <= 0){
                throw new Error('No Order Items');
            }
            //Place/create order --save into DB
            const order = await Order.create({
                user: user?._id,
                orderItems,
                shippingAddress,
                totalPrice,
            });
            console.log('this is order ctrl')
            console.log(user)

            //Update the product qty
            const products = await Product.find({_id: {$in: orderItems }})
            
            orderItems?.map(async (order) => {
                const product = products?.find((product) => {
                    return product?._id.toString() === order?._id?.toString()
                });
                if(product){
                    product.totalSold += order.qty;
                }
                await product.save()
            });

            //push order into user
            user.orders.push(order?._id);
            await user.save();

            //make payment (stripe)
            //Payment webhook
            //Update the user order
            res.json({
                success: true,
                message: 'Order created',
                order,
                user,
            })
        });

    routes > orderRoute.js

        import express  from "express";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";
        import { createOrderCtrl } from "../controllers/orderCtrl.js";

        const orderRouter = express.Router();

        orderRouter.post('/', isLoggedIn, createOrderCtrl)

        export default orderRouter;

    app > app.js

        import orderRouter from '../routes/orderRoute.js';
        app.use('/api/v1/orders/', orderRouter)

    model > product.js

        //Virtuals
        //qty left
        ProductSchema.virtual('qtyLeft').get(function(){
            const product = this;
            return product.totalQty - product.totalSold;
        })

    controllers > productCtrl.js

        // @desc Create new product
        // @route POST /api/v1/products
        // @access Private/Admin
        export const createProductCtrl = asyncHandler(async (req, res) => {
            const {name, description, brand, category, sizes, colors, price, totalQty}= req.body;
            //Priduct exists
            const productExists = await Product.findOne({name});
            if (productExists){
                throw new Error('Product Already Exists');
            }
            //find the brand
            const brandFound = await Brand.findOne({
                name: brand?.toLowerCase(),
            });
            if(!brandFound){
                throw new Error('Brand not found, please create brand first or check brand name')
            }
            //find the category
            const categoryFound = await Category.findOne({
                name: category,
            });
            if(!categoryFound){
                throw new Error('Category not found, please create category first or check category name')
            }

            //create the product
            const product = await Product.create({
                name,
                description,
                brand,
                category,
                sizes,
                colors,
                user: req.userAuthId,
                price,
                totalQty,
            });
            //push the product into category
            categoryFound.products.push(product._id);
            //resave
            await categoryFound.save();
            //push the product into brand
            brandFound.products.push(product._id);
            //resave
            await brandFound.save();
            //send response
            res.json({
                status: 'success',
                message: 'Product created successfully',
                product,
            });
        });

    controllers > usersCtrl.js

        //@desc Update user shipping address
        //@route PUT /api/v1/users/update/shippng
        //@access Private
        export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
            const {firstName, lastName, address, city, postalCode, province, phone} = req.body;
            const user = await User.findByIdAndUpdate(req.userAuthId, {
                shippingAddress: {
                    firstName,
                    lastName,
                    address,
                    city,
                    postalCode,
                    province,
                    phone,
                },
                hasShippingAddress: true,
            },{
                new: true,
            });
            //send response
            res.json({
                status: 'success',
                message: 'User shipping address update successfully',
                user,
            });
        });

    routes > usersRoute.js

        import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl, updateShippingAddressCtrl } from "../controllers/usersCtrl.js";
        userRouter.put('/update/shipping', isLoggedIn, updateShippingAddressCtrl)

39. PAYMENT INTEGRATION (STRIPE)

    login stripe
    https://stripe.com/docs/checkout/quickstart?lang=node
    npm install --save stripe

    check result payment: https://dashboard.stripe.com/test/payments
    ตัวอย่าง รหัสบัตร 4242 4242 4242 4242

    .env เอามาจาก https://dashboard.stripe.com/test/apikeys (API Keys > Secret key)
    STRIPE_KEY = ?

    controllers > orderCtrl.js 
    เมื่อ สำเร็จ ไปหน้า http://localhost:3000/success
    เมื่อ cancel ไปหน้า http://localhost:3000/cancel

        //@desc create orders
        //@route POST /api/v1/orders
        //@access private
        export const createOrderCtrl = asyncHandler(async (req, res) => {
            //Get the payload(customer, orderItems, shippingAddress, totalPrice);
            const {orderItems, shippingAddress, totalPrice} = req.body;
            console.log({
                orderItems,
                shippingAddress,
                totalPrice,
            });
            //Find the User
            const user = await User.findById(req.userAuthId);
            //Check if user has shipping address
            if(!user?.hasShippingAddress){
                throw new Error('Please provide shipping address');
            }

            //Check if order is not empty
            if(orderItems?.length <= 0){
                throw new Error('No Order Items');
            }
            //Place/create order --save into DB
            const order = await Order.create({
                user: user?._id,
                orderItems,
                shippingAddress,
                totalPrice,
            });
            console.log('this is order ctrl')
            console.log(user)

            //Update the product qty
            const products = await Product.find({_id: {$in: orderItems }})
            
            orderItems?.map(async (order) => {
                const product = products?.find((product) => {
                    return product?._id.toString() === order?._id?.toString()
                });
                if(product){
                    product.totalSold += order.qty;
                }
                await product.save()
            });

            //push order into user
            user.orders.push(order?._id);
            await user.save();

            //make payment (stripe)
            //convert order items to have same structure that stripe need
            const convertedOrders = orderItems.map((item) => {
                return {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: item?.name,
                            description: item?.description,
                        },
                        unit_amount: item?.price * 100,
                    },
                    quantity: item?.qty,
                };
            });
            const session = await stripe.checkout.sessions.create({
                line_items: convertedOrders,
                mode: 'payment',
                success_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel'
            });
            res.send({url: session.url});
            //Payment webhook
            //Update the user order
        });

40. STRIPE PAYMENT WEBHOOk
    Webhook คือ ระบบการแจ้งเตือนแบบอัตโนมัติที่ใช้ในการสื่อสารข้อมูลระหว่างแอปพลิเคชันหรือบริการต่าง ๆ ผ่านทางโปรโตคอล HTTP/HTTPS ในรูปแบบของ HTTP POST requests. Webhook ถูกใช้เพื่อให้แอปพลิเคชันสามารถแจ้งเตือนหรือส่งข้อมูลอัปเดตไปยังแอปพลิเคชันหรือบริการอื่น ๆ โดยอัตโนมัติเมื่อเกิดเหตุการณ์หรือเหตุการณ์ที่เราสนใจเกิดขึ้น โดยไม่ต้องรอให้แอปพลิเคชันอื่นเรียกข้อมูลเอง.

    app > app.js

        import Order from '../model/Order.js';

        const app = express();

        //Stripe webhook
        //stripe instance
        const stripe = new Stripe(process.env.STRIPE_KEY);

        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        const endpointSecret =
            "whsec_abd60219ca4189a016eff62085b9e9603dca9655bc0711103ed9d8e7433b56ee";

        app.post(
        "/webhook",
        express.raw({ type: "application/json" }),
        async (request, response) => {
            const sig = request.headers["stripe-signature"];

            let event;

            try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
            console.log("event");
            } catch (err) {
            console.log("err", err.message);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
            }
            if (event.type === "checkout.session.completed") {
            //update the order
            const session = event.data.object;
            const { orderId } = session.metadata;
            const paymentStatus = session.payment_status;
            const paymentMethod = session.payment_method_types[0];
            const totalAmount = session.amount_total;
            const currency = session.currency;
            //find the order
            const order = await Order.findByIdAndUpdate(
                JSON.parse(orderId),
                {
                totalPrice: totalAmount / 100,
                currency,
                paymentMethod,
                paymentStatus,
                },
                {
                new: true,
                }
            );
            } else {
            return;
            }
            // // Handle the event
            // switch (event.type) {
            //   case "payment_intent.succeeded":
            //     const paymentIntent = event.data.object;
            //     // Then define and call a function to handle the event payment_intent.succeeded
            //     break;
            //   // ... handle other event types
            //   default:
            //     console.log(`Unhandled event type ${event.type}`);
            // }
            // Return a 200 response to acknowledge receipt of the event
            response.send();
        }
        );

    controllers > orderCtrl.js

        import Order from '../model/Order.js'
        import User from '../model/User.js'
        import Product from '../model/Product.js'
        import asyncHandler from 'express-async-handler'
        import dotenv from 'dotenv'
        dotenv.config();
        import Stripe from 'stripe'

        //stripe instance
        const stripe = new Stripe(process.env.STRIPE_KEY);

        //@desc create orders
        //@route POST /api/v1/orders
        //@access private/admin
        export const createOrderCtrl = asyncHandler(async (req, res) => {
            //Get the payload(customer, orderItems, shippingAddress, totalPrice);
            const {orderItems, shippingAddress, totalPrice} = req.body;
            console.log({
                orderItems,
                shippingAddress,
                totalPrice,
            });
            //Find the User
            const user = await User.findById(req.userAuthId);
            //Check if user has shipping address
            if(!user?.hasShippingAddress){
                throw new Error('Please provide shipping address');
            }

            //Check if order is not empty
            if(orderItems?.length <= 0){
                throw new Error('No Order Items');
            }
            //Place/create order --save into DB
            const order = await Order.create({
                user: user?._id,
                orderItems,
                shippingAddress,
                totalPrice,
            });
            // console.log('this is order ctrl')
            // console.log(user)

            //Update the product qty
            const products = await Product.find({_id: {$in: orderItems }})
            
            orderItems?.map(async (order) => {
                const product = products?.find((product) => {
                    return product?._id.toString() === order?._id?.toString()
                });
                if(product){
                    product.totalSold += order.qty;
                }
                await product.save()
            });

            //push order into user
            user.orders.push(order?._id);
            await user.save();

            //make payment (stripe)
            //convert order items to have same structure that stripe need
            const convertedOrders = orderItems.map((item) => {
                return {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: item?.name,
                            description: item?.description,
                        },
                        unit_amount: item?.price * 100,
                    },
                    quantity: item?.qty,
                };
            });
            const session = await stripe.checkout.sessions.create({
                line_items: convertedOrders,
                metadata: {
                orderId: JSON.stringify(order?._id),
                },
                mode: "payment",
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
            });
            res.send({ url: session.url });
        });

        //@desc get all orders
        //@route GET /api/v1/orders
        //@access private/admin
        export const getAllordersCtrl = asyncHandler(async(req, res)=>{
            //find all orders
            const orders = await Order.find();
            res.json({
                success: true,
                message: 'All orders',
                orders,
            });
        });

        //@desc get single orders
        //@route GET /api/v1/orders/:id
        //@access private/admin
        export const getSingleOrderCtrl = asyncHandler(async(req, res) => {
            //get the id from params
            const id = req.params.id;
            const order = await Order.findById(id);
            //send response
            res.status(200).json({
                success: true,
                message: 'Single order',
                order,
            });
        });

        //@desc update order to delivered
        //@route GET /api/v1/orders/update/:id
        //@access private/admin
        export const updateOrderCtrl = asyncHandler(async(req, res) => {
            //get the id from params
            const id = req.params.id;
            //update
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                {
                    status: req.body.status,
                },
                {
                    new: true,
                }
            );
            res.status(200).json({
                success: true,
                message: 'Order updated',
                updatedOrder,
            });
        });

    routes > orderRoute.js

        import express  from "express";
        import { isLoggedIn } from "../middlewares/isLoggingIn.js";
        import { createOrderCtrl, getAllordersCtrl, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/orderCtrl.js";

        const orderRouter = express.Router();

        orderRouter.post('/', isLoggedIn, createOrderCtrl)
        orderRouter.get('/', isLoggedIn, getAllordersCtrl)
        orderRouter.get('/:id', isLoggedIn, getSingleOrderCtrl)
        orderRouter.put('/update/:id', isLoggedIn, updateOrderCtrl)


        export default orderRouter;

    controllers > usersCtrl.js

        //@desc Get user profile
        //@route GET /api/v1/users/profile
        //@access Private
        export const getUserProfileCtrl = asyncHandler(async(req, res) => {
            //find the user
            const user = await User.findById(req.userAuthId).populate('orders');
            res.json({
                status: 'success',
                message: 'User profile fetched successfully',
                user,
            });
        });

41. model, Create coupon ctrl, route coupon

    model > Coupon.js

        //coupon model
        import mongoose from 'mongoose';
        const Schema = mongoose.Schema;

        const CouponSchema = new Schema({
            code:{
                type: String,
                required: true,
            },
            startDate:{
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
            discount: {
                type: Number,
                required: true,
                default: 0,
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        },{
            timestamps: true,
            toJSON: {virtuals: true},
        }
        );

        //coupon is expired
        CouponSchema.virtual("isExpired").get(function () {
            return this.endDate < Date.now();
        });

        CouponSchema.virtual("daysLeft").get(function () {
        const daysLeft =
            Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + " " + "Days left";
        return daysLeft;
        });

        //validation
        CouponSchema.pre("validate", function (next) {
        if (this.endDate < this.startDate) {
            next(new Error("End date cannot be less than the start date"));
        }
        next();
        });

        CouponSchema.pre("validate", function (next) {
        if (this.startDate < Date.now()) {
            next(new Error("Start date cannot be less than today"));
        }
        next();
        });

        CouponSchema.pre("validate", function (next) {
        if (this.endDate < Date.now()) {
            next(new Error("End date cannot be less than today"));
        }
        next();
        });

        CouponSchema.pre("validate", function (next) {
        if (this.discount <= 0 || this.discount > 100) {
            next(new Error("Discount cannot be less than 0 or greater than 100"));
        }
        next();
        });

        const Coupon = mongoose.model("Coupon", CouponSchema);

        export default Coupon;

    controllers > couponsCtrl.js

        import asyncHandler from 'express-async-handler';
        import Coupon from '../model/Coupon.js';

        // @desc Create new Coupon
        // @route POST /api/v1/coupons
        // @access Private/Admin
        export const createCouponCtrl = asyncHandler(async(req, res) => {
            const {code, startDate, endDate, discount} = req.body;
            //check if admin
            //check if coupon already exists

            const couponsExists = await Coupon.findOne({
                code,
            });
            if (couponsExists){
                throw new Error('Coupon already exists');
            }

            //check if discount is a number
            if(isNaN(discount)){
                throw new Error('Discount value must be a number');
            }
            const coupon = await Coupon.create({
                code: code?.toUpperCase(),
                code,
                startDate,
                endDate,
                discount,
                user: req.userAuthId,
            });

            //send the response
            res.status(201).json({
                status: 'success',
                message: 'Coupon created successfully',
                coupon,
            })

        });

        // @desc Get all Coupon
        // @route GET /api/coupons
        // @access Private/Admin
        export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
            const coupons = await Coupon.find();
            res.status(200).json({
                status: 'success',
                message: 'All coupons',
                coupons,
            });
        });

        // @desc Get single Coupon
        // @route GET /api/v1/coupons/:id
        // @access Public
        export const getCoupontCtrl = asyncHandler(async(req, res) => {
            const coupon = await Coupon.findById(req.params.id);
            res.json({
                status: 'success',
                message: 'Coupon fetched',
                coupon,
            });
        });

        //@desc update Coupon
        //@route PUT /api/v1/coupons/update/:id
        //@access Public
        export const updateCouponCtrl = asyncHandler(async(req, res) => {
            const {code, startDate, endDate, discount} = req.body;
            const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
                code: code?.toUpperCase(),
                discount,
                startDate,
                endDate,
            },{
                new: true,
            });
            res.json({
                status: 'success',
                message: 'coupon updated',
                coupon,
            })
        });

        //@desc delete Coupon
        //@route DELETE /api/v1/coupons/delete/:id
        //@access Public
        export const deleteCouponCtrl = asyncHandler(async(req, res) => {
            const coupon = await Coupon.findByIdAndDelete(req.params.id);
            res.json({
                status: 'success',
                message: 'Coupon deleted successfully',
                coupon,
            })
        })

    routes > couponRoute.js

        import express from 'express'
        import { isLoggedIn } from '../middlewares/isLoggingIn.js';
        import { createCouponCtrl, getAllCouponsCtrl, getCoupontCtrl, updateCouponCtrl, deleteCouponCtrl } from '../controllers/couponsCtrl.js';

        const couponRouter = express.Router();

        couponRouter.post('/', isLoggedIn, createCouponCtrl);
        couponRouter.get('/', getAllCouponsCtrl);
        couponRouter.get('/:id', getCoupontCtrl);
        couponRouter.put('/update/:id', updateCouponCtrl);
        couponRouter.delete('/delete/:id', deleteCouponCtrl);

        export default couponRouter;

    controllers > orderCtrl.js

        //@desc create orders
        //@route POST /api/v1/orders
        //@access private/admin
        export const createOrderCtrl = asyncHandler(async (req, res) => {
            //Get the coupon
            const {coupon} = req?.query;
            
            const couponFound = await Coupon.findOne({
                code: coupon?.toUpperCase(),
            });

            if (couponFound?.isExpired){
                throw new Error('Coupon has expired');
            }
            if (!couponFound){
                throw new Error('Coupon does exists');
            }

            //Get discount
            const discount = couponFound?.discount / 100;

            //Get the payload(customer, orderItems, shippingAddress, totalPrice);
            const {orderItems, shippingAddress, totalPrice} = req.body;

            //Find the User
            const user = await User.findById(req.userAuthId);
            //Check if user has shipping address
            if(!user?.hasShippingAddress){
                throw new Error('Please provide shipping address');
            }

            //Check if order is not empty
            if(orderItems?.length <= 0){
                throw new Error('No Order Items');
            }
            //Place/create order --save into DB
            const order = await Order.create({
                user: user?._id,
                orderItems,
                shippingAddress,
                totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
            });
            console.log(order);

            //Update the product qty
            const products = await Product.find({_id: {$in: orderItems }})
            
            orderItems?.map(async (order) => {
                const product = products?.find((product) => {
                    return product?._id.toString() === order?._id?.toString()
                });
                if(product){
                    product.totalSold += order.qty;
                }
                await product.save()
            });

            //push order into user
            user.orders.push(order?._id);
            await user.save();

            //make payment (stripe)
            //convert order items to have same structure that stripe need
            const convertedOrders = orderItems.map((item) => {
                return {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: item?.name,
                            description: item?.description,
                        },
                        unit_amount: item?.price * 100,
                    },
                    quantity: item?.qty,
                };
            });
            const session = await stripe.checkout.sessions.create({
                line_items: convertedOrders,
                metadata: {
                orderId: JSON.stringify(order?._id),
                },
                mode: "payment",
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
            });
            res.send({ url: session.url });
        });

42. Cloudinary Keys and Multer Installation

    npm install multer cloudinary multer-storage-cloudinary

    https://console.cloudinary.com/console/c-49e4a6668538893d7a091bd10ee200

    .env

        CLOUDINARY_CLOUD_NAME = ?
        CLOUDINARY_API_KEY = ?
        CLOUDINARY_API_SECRET_KEY = ?

    config > fileUpload.js

        import cloudinaryPackage from "cloudinary";
        import multer from 'multer';
        import { CloudinaryStorage } from "multer-storage-cloudinary";
        import dotenv from 'dotenv';
        dotenv.config();

        const cloudinary = cloudinaryPackage.v2;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
            secure: true,
        });

        // Create storage engine for Multer
        const storage = new CloudinaryStorage({
            cloudinary,
            allowedFormats: ["jpg", "png", "jpeg"],
            params: {
                folder: "Ecommerce-api",
            },
        });

        // Init Multer with the storage engine
        const upload = multer({
            storage,
        });

        export default upload;

    routes > productsRoute.js

        import upload from "../config/fileUpload.js";
        productsRouter.post('/', isLoggedIn, upload.any('files'), createProductCtrl)

    routes > categoryRoute.js

        import categoryFileUpload from '../config/categoryUpload.js'
        categoriesRouter.post('/', isLoggedIn, categoryFileUpload.single('file'), createCategoryCtrl);

43. order summary statistics

    controllers > orderCtrl.js

        //@desc get sales sum of orders
        //@route GET /api/v1/orders/sales/sum
        //@access private/admin
        export const getOrderStatsCtrl = asyncHandler(async(req, res) => {
            //get minimum order
            const orders = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        minimumSale: {
                            $min: "$totalPrice",
                        },
                        totalSales: {
                            $sum: "$totalPrice",
                        },
                        maxSale: {
                            $max: "$totalPrice",
                        },
                        avgSale: {
                            $avg: "$totalPrice",
                        },
                    },
                },
            ]);
            //get the date
            const date = new Date();
            const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            console.log(today)
            const saleToday = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: today,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: "$totalPrice",
                        },
                    },
                },
            ]);
            //send response
            res.status(200).json({
                success: true,
                message: 'Sum of orders',
                orders,
                saleToday,
            });
        });
    
44. IsAdmin middleware

    middlewares > isAdmin.js

        import User from '../model/User.js'
        const isAdmin = async (req, res, next) => {
            //find the login user
            const user = await User.findById(req.userAuthId);
            //check if admin
            if (user.isAdmin){
                next();
            } else{
                next(new Error('Access denied, admin only'));
            }
        };
        export default isAdmin;

    routes > brandRoute.js

        brandsRouter.post('/', isLoggedIn, isAdmin, createBrandCtrl);
        brandsRouter.get('/', getAllBrandsCtrl);
        brandsRouter.get('/:id', getSingleBrandCtrl);
        brandsRouter.put('/:id', isLoggedIn, isAdmin, updateBrandCtrl);
        brandsRouter.delete('/:id', isLoggedIn, isAdmin, deleteBrandCtrl);

    routes > categoryRoute.js

        categoriesRouter.post('/', isLoggedIn, categoryFileUpload.single('file'), createCategoryCtrl);
        categoriesRouter.get('/', getAllCategoryCtrl);
        categoriesRouter.get('/:id', getSingleCategoryCtrl);
        categoriesRouter.put('/:id', updateCategoryCtrl);
        categoriesRouter.delete('/:id', deleteCategoryCtrl);

    routes > colorsRoute.js

        colorsRouter.post('/', isLoggedIn, isAdmin, createColorCtrl);
        colorsRouter.get('/', getAllColorsCtrl);
        colorsRouter.get('/:id', getSingleColorCtrl);
        colorsRouter.put('/:id', isLoggedIn, isAdmin, updateColorCtrl);
        colorsRouter.delete('/:id', isLoggedIn, isAdmin, deleteColorCtrl);

    routes > couponRoute.js

        couponRouter.post('/', isLoggedIn, isAdmin, createCouponCtrl);
        couponRouter.get('/', getAllCouponsCtrl);
        couponRouter.get('/:id', getCoupontCtrl);
        couponRouter.put('/update/:id', isLoggedIn, isAdmin, updateCouponCtrl);
        couponRouter.delete('/delete/:id', isLoggedIn, isAdmin, deleteCouponCtrl);

    routes > orderRoute.js
        
        orderRouter.post('/', isLoggedIn, createOrderCtrl)
        orderRouter.get('/', isLoggedIn, getAllordersCtrl)
        orderRouter.get('/:id', isLoggedIn, getSingleOrderCtrl)
        orderRouter.put('/update/:id', isLoggedIn, updateOrderCtrl)
        orderRouter.get('/sales/stats', isLoggedIn, getOrderStatsCtrl)
    
    routes > productRoute.js

        productsRouter.post('/', isLoggedIn, isAdmin, upload.any('files'), createProductCtrl)
        productsRouter.get('/', getProductsCtrl)
        productsRouter.get('/:id', getProductCtrl)
        productsRouter.put('/:id', isLoggedIn, isAdmin, updateProductCtrl)
        productsRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteProductCtrl)
    
    routes > reviewRoute.js

        reviewRouter.post('/:productID', isLoggedIn, createReviewCtrl);
    
    routes > usersRoute.js

        userRouter.post('/register', registerUserCtrl)
        userRouter.post('/login', loginUserCtrl)
        userRouter.get('/profile', isLoggedIn, getUserProfileCtrl)
        userRouter.put('/update/shipping', isLoggedIn, updateShippingAddressCtrl)