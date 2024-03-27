const express = require('express');
const app=express();
const ProductManager=require('./ProductManager');
const nuevoProductManager=new ProductManager('productos.json');
async function getProducts(){
    const products=await nuevoProductManager.getProducts();
    return products
}

app.get('/products',async(req,res)=>{
    try {
        const{limits}=req.query;
        const products=await nuevoProductManager.getProducts();
        if(!limits){res.send(products)}else{
        const limitedProducts=products.slice(0,parseInt(limits))
        res.send(limitedProducts)
    }
    } catch (error) {
        console.log(error);
    }

})
app.get('/products/:pid',async(req,res)=>{
    const pid=req.params.pid
    try {
        const product=await nuevoProductManager.getProductsById(parseInt(pid))
        res.send(product)
    } catch (error) {
        console.log(error);
        res.send("No existe un producto con esa id en nuestra tienda");
    }
});





app.listen(8080,error=>{
    console.log("Escuchando servidor en puerto 8080");
})
