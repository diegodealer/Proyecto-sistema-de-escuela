const express = require("express");
const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

app.get("/", (req,res) => {
    res.send("API funcionando <]Bv");
});

app.listen(PORT, () => {
    console.log('servidor corriendo en el http://localhost:${port}');
});

const maestros = [];

// Agregar un maestro (POST)
app.post("/maestros", (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fechaIngreso } = req.body;
    
    if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const nuevoMaestro = { id: maestros.length + 1, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fechaIngreso };
    maestros.push(nuevoMaestro);

    res.status(201).json(nuevoMaestro);
});

// Obtener todos los maestros (GET)
app.get("/maestros", (req, res) => {
    res.json(maestros);
});

// Eliminar un maestro (DELETE)
app.delete("/maestros/:id", (req, res) => {
    const { id } = req.params;
    const index = maestros.findIndex(m => m.id == id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Maestro no encontrado" });
    }

    maestros.splice(index, 1);
    res.json({ mensaje: "Maestro eliminado" });
});


