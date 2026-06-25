const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { probarConexion } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ mensaje: "API de DesarrolloAPP funcionando correctamente" });
});

// Iniciamos el servidor y probamos la base de datos
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  probarConexion(); // Ejecutamos la prueba de Google Cloud SQL
});