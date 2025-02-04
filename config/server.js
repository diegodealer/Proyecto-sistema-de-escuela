require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware para parsear JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static(path.resolve("../")));

// Configurar el pool de conexiones a MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "gestion_maestros",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Verificar la conexión a la base de datos
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
    connection.release(); // Liberar la conexión
});

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.resolve("../pages/index.html"));
});

// Agregar un maestro (POST)
app.post("/maestros", async (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fechaIngreso } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const sql =
        "INSERT INTO maestros (nombre, apellido_paterno, apellido_materno, correo, telefono, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)";
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
    const { apellido } = req.query;  // Capturar el parámetro desde la URL

    try {
        let sql = "SELECT * FROM maestros";
        let valores = [];

        if (apellido) {
            sql += " WHERE apellido_paterno = ?";
            valores.push(apellido);
        }

        const [result] = await pool.promise().query(sql, valores);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron resultados" });
        }

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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



