const { productModel } = require("../Model/productschema");
var { URL } = require("../Dbconfig/Dbconfig");
var mongoose = require("mongoose");
const { UserModel } = require("../Model/userSchemas");
mongoose.connect(URL);

/* Get All data */
exports.getallproductdata = async (req, res) => {
  try {
    let product = await productModel.find({});
    res.status(200).send({
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
};
//get one product data
exports.getoneproductdata = async (req, res) => {
  try {
    let product = await productModel.find({_id:req.params.id});
    res.status(200).send({
      message:"data fetching sucessfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
};

//Add Product
exports.addProduct = async (req, res) => {
  try {
    let product = await productModel.findOne({ id: req.body.id });
    if (!product) {
      let product = await productModel.create(req.body);
      res.status(200).send({ message: "product Added", product });
    } else {
      res.status(400).send({ message: "product Alreay existed" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Error",
      error,
    });
  }
};
//update product details
exports.updateproduct = async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  try {
    let product = await productModel.findOne({ _id: req.params.id });
    if (product) {
      product.productName = req.body.productName;
      product.description = req.body.description;
      product.categories = req.body.categories;
      product.image = req.body.image;
      product.releaseDate = req.body.releaseDate;
      product.price = req.body.price;
      product.specifications = req.body.specifications;
      product.status = req.body.status;
      await product.save();
      res.status(200).send({
        product,
        message: "product update successfully",
      });
    } else {
      res.status(400).send({ message: "product not exit" });
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};

//delete product
exports.deleteproduct = async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id });
    if (product) {
      let product = await productModel.deleteOne({ _id: req.params.id });
      res.status(200).send({
        message: "product Deleted Successfull!",
      });
    } else {
      res.status(400).send({ message: "product  Does Not Exists!" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
};


exports.AddReview=async(req,res)=>{
  console.log(req.params.id,req.body)
  try {
        let product=await productModel.findOneAndUpdate(
          {
              _id: req.params.id
            },
            {
              $push: { reviews:{userName:req.body.userName,message:req.body.message}}
            }
          );   
          console.log(product); 
          res.status(200).send({message:"Add Review Product",product});   
  } catch (error) {
      console.log(error);
      res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });

  }
}
