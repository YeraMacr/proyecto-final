const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');

// Cargar variables del archivo .env
dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conectar a MySQL
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log('¡Conectado a MySQL!');
});

// Registro de usuario
app.post('/api/registro', (req, res) => {
  const { nombre, telefono, contraseña } = req.body;
  if (!nombre || !telefono || !contraseña) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
  }

  const query = 'INSERT INTO usuarios (nombre, telefono, contraseña) VALUES (?, ?, ?)';
  conexion.query(query, [nombre, telefono, contraseña], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }

    res.json({ success: true, message: 'Usuario registrado con éxito' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ success: false, message: 'Nombre y contraseña son obligatorios' });
  }

  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
  conexion.query(query, [nombre, contraseña], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (results.length > 0) {
      res.json({ success: true, usuario: results[0] });
    } else {
      res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Ingresar pedido
app.post('/api/pedidos', (req, res) => {
  const { cliente, cantidad, fecha_pedido } = req.body;

  if (!cliente || cantidad === undefined || !fecha_pedido) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO pedidos (cliente, cantidad, fecha_pedido) VALUES (?, ?, ?)';
  conexion.query(query, [cliente, cantidad, fecha_pedido], (err, result) => {
    if (err) {
      console.error('Error al ingresar pedido:', err);
      return res.status(500).json({ success: false, message: 'Error al ingresar pedido' });
    }

    res.json({ success: true, message: 'Pedido ingresado correctamente' });
  });
});

// Registrar salida
app.post('/api/salidas', (req, res) => {
  const { destino, cantidad, fecha_salida } = req.body;

  if (!destino || cantidad === undefined || !fecha_salida) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO salidas (destino, cantidad, fecha_salida) VALUES (?, ?, ?)';
  conexion.query(query, [destino, cantidad, fecha_salida], (err, result) => {
    if (err) {
      console.error('Error al registrar salida:', err);
      return res.status(500).json({ success: false, message: 'Error al registrar salida' });
    }

    res.json({ success: true, message: 'Salida registrada correctamente' });
  });
});

// Ruta para generar el reporte diario
app.get('/api/reporte', (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const queryPedidos = `
    SELECT cliente AS nombre, cantidad, fecha_pedido AS fecha 
    FROM pedidos 
    WHERE fecha_pedido BETWEEN ? AND ?`;

  const querySalidas = `
    SELECT destino AS nombre, cantidad AS cantidad, fecha_salida AS fecha 
    FROM salidas 
    WHERE fecha_salida BETWEEN ? AND ?`;

  conexion.query(queryPedidos, [startOfDay, endOfDay], (err, pedidos) => {
    if (err) {
      console.error('Error al consultar pedidos:', err);
      return res.status(500).json({ success: false, message: 'Error al generar el reporte' });
    }

    conexion.query(querySalidas, [startOfDay, endOfDay], (err, salidas) => {
      if (err) {
        console.error('Error al consultar salidas:', err);
        return res.status(500).json({ success: false, message: 'Error al generar el reporte' });
      }

      const reporte = [];

      pedidos.forEach(pedido => {
        reporte.push({
          fecha: pedido.fecha,
          pedido: `${pedido.nombre} - ${pedido.cantidad} KG`,
          salida: '-'
        });
      });

      salidas.forEach(salida => {
        reporte.push({
          fecha: salida.fecha,
          pedido: '-',
          salida: `${salida.nombre} - ${salida.cantidad} KG`
        });
      });

      reporte.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      res.json({ success: true, reporte });
    });
  });
});



// Cambiar contraseña
app.post('/api/cambiar-contrasena', (req, res) => {
  const { nombre, contraseñaActual, nuevaContraseña } = req.body;

  if (!nombre || !contraseñaActual || !nuevaContraseña) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  const queryVerificarUsuario = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
  conexion.query(queryVerificarUsuario, [nombre, contraseñaActual], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al verificar usuario' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    const queryActualizarContraseña = 'UPDATE usuarios SET contraseña = ? WHERE nombre = ?';
    conexion.query(queryActualizarContraseña, [nuevaContraseña, nombre], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
      }

      res.json({ success: true, message: 'Contraseña cambiada con éxito' });
    });
  });
});

// Servir archivos estáticos desde la carpeta Proyecto
app.use(express.static(path.join(__dirname, 'Proyecto')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Proyecto', 'login.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
