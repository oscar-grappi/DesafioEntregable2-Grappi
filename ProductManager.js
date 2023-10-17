const fs = require("fs");

class ProductManager {

    constructor() {
        this.products = [];
        this.filename = "Productos.json";
    }


    addProduct(title, description, price, thumbnail, code, stock) {

        const id = this.products.length + 1;
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("ingrese todos los parametros del producto (titulo, descripción, precio, link a imagen, codigo unico y stock")
        } else if (this.products.some(e => e.code === code)) {
            throw new Error(`el codigo ingresado: ${code}  ya existe, por favor cambielo`)
        } else {

            this.products.push(product);
            this.writeToFile(this.products)
            return product;
        }
    }


    getProducts() {
        try {
            const products = fs.readFileSync(this.filename, "utf-8");
            return JSON.parse(products);
        } catch (error) {
            return []
        }
    }


    getProductByID(id) {
        const products = this.getProducts()
        const product = products.find((product) => product.id == id)
        if (!product) {
            return "no existe un producto con este codigo"
        } else {
            return product
        }
    }

    updateProduct(id, title, description, price, thumbnail, code, stock) {
        try {
            const productToUpdate = this.getProductByID(id)


            productToUpdate.title = title;
            productToUpdate.description = description;
            productToUpdate.price = price;
            productToUpdate.thumbnail = thumbnail;
            productToUpdate.code = code;
            productToUpdate.stock = stock;

            this.products.splice(id - 1, 1, productToUpdate)
            this.writeToFile(this.products);
            return productToUpdate;
        } catch (error) {
            throw new Error("no exite un producto con esta id para actualizar, pruebe creandolo.")
        }

    }

    deleteProduct(id) {
        if (id > this.products.length || id < 1) {
            throw new Error("no exite un producto con esta id para borrar.")
        } else{
            let productToDelete = this.getProductByID(id)
            productToDelete = this.products.splice(id - 1, 1)
            this.writeToFile(this.products)
        }
    }

    writeToFile(products) {
        fs.writeFileSync(this.filename, JSON.stringify(products))
    }
}



const pm = new ProductManager();

pm.addProduct("manzana", "roja", 500, "link1", 100, 100);
pm.addProduct("banana", "amarilla", 200, "link2", 102, 200);
pm.addProduct("ajo", "italiano", 100, "link3", 101, 300);
pm.addProduct("papa", "lavada", 90, "link4", 104, 200);
pm.updateProduct(4, "papa", "negra", "80", "link4", 105, 200);
pm.deleteProduct(4)


console.log(pm.getProducts())
console.log(pm.getProductByID(4));