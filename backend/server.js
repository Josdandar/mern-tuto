// We can call it like append.js as well
//const express = require("express"); old syntax
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
dotenv.config();

const app = express();

app.use(express.json()); //Permite aceptar json en req.body
//Middleware is a funciont that runs before you sent the response back to the client

app.get("api/products", async(req,res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success: true, data: products});
    }catch(error){
        console.log("Error in fetching products:", error.message);
        res.status(500).json({success: false, message: "Server error"})
    }
})

app.post("/api/products", async(req,res) => {
    const product = req.body;

    if(!product.name || !product.price || !product.image){ //Ningun campo vacio
        return res.status(400).json({success:false, message: "Please provide all fields"});
    }
    const newProduct = new Product(product)

    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch(error){
        console.error("Error in Create Product:", error.message);
        res.status(500).json({success: false, message: "Server Errror"});
    }
})

app.delete("/api/products/:id", async (req,res) => {
    const {id} = req.params
    
    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Product Deleted"});

    }catch (error){
        console.log("Error in deleting product:", error.message);
        res.status(404).json({success: false, message: "Product not found"});
    }
})

app.listen(8080, () => {
    connectDB();
    console.log("Server started at http://localhost:8080");
});

