const {promises:fs}=require("fs");
const fsSync=require('fs');

class ProductManager{
    constructor(ruta){
        this.path=ruta;
    }
    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {number} code 
     * @param {number} strock 
     */
    verificarCadena(parametro){
        if(typeof parametro !== "string"){
            throw new Error(`"${parametro}" no es una cadena de texto,se espera una cadena de texto`);
        }
    }
    verificarNumero(parametro){
        if(isNaN(parametro)){
            throw new Error(`"${parametro}" no es un numero,se espera un numero`)
        }
    }
    async readFile(){
        try {
            let products=await fs.readFile(this.path,"utf-8")
            products=JSON.parse(products);
            return products
        }catch(error){
            if(error.code==="ENOENT"){
                let products="ENOENT";
                return products
            }
            else{
                console.log(error);
            }
        }
    }

    async addProduct(title,description,price,thumbnail,code,stock){
        try {
            let products=await this.readFile();
            if(!title||!description||!price||!thumbnail||!code||!stock){
                throw new Error("Todos los campos son Obligatorios")
            }
            else{
                this.verificarCadena(title)
                this.verificarCadena(description)
                this.verificarCadena(thumbnail)
                this.verificarNumero(price)
                this.verificarNumero(code)
                this.verificarNumero(stock)

                let newProduct={
                    id:await this.getNextId(),
                    title:title,
                    description:description,
                    price:price,
                    thumbnail:thumbnail,
                    code:code,
                    stock:stock
                    }
                    console.log(newProduct)
                    let products=await this.readFile();
                    if(products==="ENOENT"){
                        console.log("EL ARCHIVO QUE INTENTAS LEER NO EXISTE,LO CREAREMOS JUNTO CON EL NUEVO PRODUCTO")
                        products=[];
                        products.push(newProduct);
                        products=JSON.stringify(products)
                        try{
                            await fs.writeFile(this.path,products,"utf-8")
                            console.log('archivo creado y guardado con el nuevo producto')
                        }catch(error){
                            console.log(error.message)
                        }
                    }else{
                        if(products.some(product=>product.code===code)){
                            throw new Error("YA EDXISTE UN PRODUCTO REGISTRADO CON ESE CODE")
                        }else{
                            products.push(newProduct);
                            console.log(products);
                            products=JSON.stringify(products);
                            try{fsSync.unlinkSync(this.path);
                            await fs.writeFile(this.path,products,"utf-8").then(console.log("producto carago con exito"))
                            }catch(error){
                                console.log(error.message);
                            }
                        }
                    }
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    async getProducts(){
        let products=await this.readFile();
        if(products==="ENOENT"){
            console.log("NO EXISTE UNA LISTA DE PRODUCTOS,DEBES CREARLA AGREGANDO NUEVOS PRODUCTOS");
            return null
        }else{
            if(products.length===0){
                console.log("AUN NO SE HAN CARGADO PRODUCTOS")
            }else{
                //console.log(products);
                return products
            }
        }
    }
    async getProductsById(id){
        let products=await this.readFile();
        let productByID=products.find((item) =>item.id===id );
        //let showProduct={id:productByID.id,nombre}
        if(productByID!==undefined){
            console.log(`Objeto encontrado su id es :${productByID.id},su titulo:${productByID.title},su descripcion: ${productByID.description},su img: ${productByID.thumbnail},su code es ${productByID.code} y su stock es de : ${productByID.stock}`);
            return productByID
        }else{
            console.log('no existe un producto con esa id en nuestra tienda');
        }
        
    }
    async updateProduct(id,objeto){
        let products=await this.readFile();
        let productToUpdate=products.find((item)=>item.id===id);
        if(productToUpdate !==undefined){
            Object.keys(productToUpdate).forEach(key=>{
                if(objeto.hasOwnProperty(key)){
                    productToUpdate[key]=objeto[key]
                }
            });

            console.log(productToUpdate);
            console.log(products);
            console.log("PRODUCTO ACTUALIZADO CON EXITO")
            //fsSync.unlinkSync(this.path);
            products=JSON.stringify(products);
            await fs.writeFile(this.path,products,"utf-8",(error)=>{
                console.log(error);
            })
        }else{
            console.log("NO EXISTE UN PRODUCTO CON LA ID PROPORCIONADA")
        }
    }
async deleteProduct(id){
            let products=await this.readFile()
            const productExists=products.find(product=>product.id===id)
            if(productExists!==undefined){
            products=products.filter(product=>product.id!==id);
            fsSync.unlinkSync(this.path);
            products=JSON.stringify(products)
            fs.writeFile(this.path,products,"utf-8")
            console.log('PRODUCTO ELMINADO CON EXITO')
        }else{
            console.log("NO EXISTE PRODUCTO CON ESE ID");
        } 
    }
async getNextId(){
        let products=await this.readFile();
        if(products==="ENOENT"||products.length===0){
            return 1
        }else{ 
                return products.at(-1).id +1
        }
    }
}

//addMultipleProducts();

module.exports =ProductManager;