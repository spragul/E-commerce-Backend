const express = require('express');
const router = express.Router();
const {validate, Adminvalidate}=require('../Authentication/auth')
const productController =require('../Controllers/ProductControll')

//router
router.get('/',productController.getallproductdata);
router.get('/:id',productController.getoneproductdata);
router.post('/adddata',Adminvalidate,productController.addProduct);
router.put('/update/:id',Adminvalidate,productController.updateproduct);  
router.delete('/delete/:id',Adminvalidate,productController.deleteproduct);
router.patch('/addreview',validate,productController.AddReview);

module.exports= router;