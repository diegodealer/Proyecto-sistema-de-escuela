require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.static(path.resolve('../')));

// Configurar conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "gestion_maestros"
});

db.connect(err => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.resolve('..\\pages\\index.html') )
});

// Agregar un maestro (POST)
app.post("/maestros", async (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fechaIngreso } = req.body;

    if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO maestros (nombre, apellido_paterno, apellido_materno, correo, telefono, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)";
    const valores = [nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fechaIngreso];

    try {
        const [result] = await pool.promise().query(sql, valores);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error("Error al agregar maestro:", err);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});


// Obtener todos los maestros (GET)
app.get("/maestros", async (req, res) => {
    try {
        const [result] = await pool.promise().query("SELECT * FROM maestros");
        res.json(result);
    } catch (err) {
        console.error("Error al obtener los maestros:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


// Eliminar un maestro (DELETE)
app.delete("/maestros/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.promise().query("DELETE FROM maestros WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Maestro no encontrado" });
        }

        res.json({ mensaje: "Maestro eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar maestro:", err);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



