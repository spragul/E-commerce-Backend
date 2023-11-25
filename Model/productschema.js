const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  releaseDate:{
    type:Date,
    required:true
  },
  popularity:{
    type: Number,
    required: false,
  },
  specifications: {
    type: String,
    required: true,
  },
  reviews: [
      {
          userName: String,
          message: String,
      }
  ],
  status:{
    type: Boolean,
    required:true
  },

});

let productModel = mongoose.model("product", productSchema);
module.exports = { productModel };
