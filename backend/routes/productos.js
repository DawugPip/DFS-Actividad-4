const express = require('express');
const router = express.Router();
const { Producto } = require('../shema');
// Importa el middleware de autenticación JWT
const auth = require("../middlewares/auth");
const mongoose = require('mongoose');



//READ
router.get('/productos', auth, async (req, res)=>{
  // Obtiene el ID del usuario autenticado desde el middleware auth
  // El middleware auth decodifica el token y guarda la información en req.usuario
  const idUsuario = req.usuario.userId;
    try{
        const productosEncontrados= await Producto.find({ creadoPor: idUsuario });

        if(productosEncontrados.length === 0){
            return res.status(404).json({message: "No se encontraron productos para este usuario. Por favor agregue alguno"});
        }
        res.status(200).json(productosEncontrados);

    } catch (error){
        res.status(500).json({message: "Error al obtener productos", error});
    }
})

//CREATE
router.post('/productos', auth, async (req, res)=> {
    const idUsuario= req.usuario.userId;
    const {nombre, descripcion, precio, stock} = req.body;

    try{
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock,
            creadoPor: idUsuario
        });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(500).json({message: "Error al crear el producto", error});
    }
})

//UPDATE
router.put('/productos/:id', auth, async (req, res) => {
    const idUsuario = req.usuario.userId;
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){ //Si se envia como id algo que no es un ObjectId de MongoDB, se devuelve un error 400
            return res.status(400).json({message: "ID de producto no válido"});
        }

        const encontrarProducto = await Producto.findOne({ _id: id, creadoPor: idUsuario });
        if(!encontrarProducto){
            return res.status(404).json({message: "Producto no encontrado o no pertenece al usuario"});
        };

        const actualizarProducto= await Producto.findByIdAndUpdate(
            id, 
            { 
                nombre, 
                descripcion, 
                precio, 
                stock, 
                updatedAt: Date.now()
            }, 
            { new: true }
        );

        if(!actualizarProducto){
            return res.status(404).json({message: "Producto no encontrado o no pertenece al usuario"});
        }
        res.json({message: "Producto actualizado correctamente", actualizarProducto});
    } catch (error) {
        console.error("Error en PUT /productos/:id:", error); // Log para ver el error real
        res.status(500).json({message: "Error al actualizar el producto", error: error.message});
    }
})

//DELETE
router.delete('/productos/:id', auth, async (req, res)=>{
    const idUsuario= req.usuario.userId;
    const { id }= req.params;
    
    try{
        const encontrarProducto= await Producto.findOne({ _id: id, creadoPor: idUsuario});

        if(!encontrarProducto){
            return res.status(404).json({message: "Producto no encontrado o no pertenece al usuario"});
        }

        const eliminarProducto= await Producto.findByIdAndDelete(id);
        res.json({message: "Producto eliminado correctamente"});
    } catch (error) {
        res.status(500).json({message: "Error al eliminar el producto", error});
    }
});

// Exporta el enrutador para ser utilizado en index.js
module.exports = router;