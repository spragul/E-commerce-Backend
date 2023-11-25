const express = require('express');
const router = express.Router();
const usercontroller = require('../Controllers/UserControll');
const { Adminvalidate, validate } = require('../Authentication/auth');

router.get('/',Adminvalidate,usercontroller.alluser)
router.post('/signup',usercontroller.signup);
router.post('/login',usercontroller.login);
router.post('/forgotpassword',usercontroller.forgotpassword);
router.post('/resetpassword/:id/:token',usercontroller.resetpassword);
router.patch('/addfavoriteProduct/:id',validate,usercontroller.addfavoriteProduct);
router.get('/getfavoriteProduct/:id',validate,usercontroller.getfavoriteProduct);
router.patch('/addorder/:id',validate,usercontroller.addorderlist);
router.get('/getorder/:id',validate,usercontroller.getorderlist);
module.exports= router