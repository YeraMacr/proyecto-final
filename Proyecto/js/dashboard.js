// Mostrar sección en función de la opción seleccionada
function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(s => s.style.display = 'none');

  // Mostrar la sección correspondiente
  const seccionSeleccionada = document.getElementById(seccion);
  if (seccionSeleccionada) {
    seccionSeleccionada.style.display = 'block';
  }
}

// Enviar pedido al backend
function enviarPedido(event) {
  event.preventDefault();

  const cliente = document.getElementById('cliente').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const fechaPedido = document.getElementById('fechaPedido').value;
  



  const datosPedido = {
    cliente: cliente,
    cantidad: cantidad,
    fecha_pedido: fechaPedido,
    
  };

  fetch('http://localhost:3000/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosPedido)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Pedido ingresado con éxito');
    } else {
      alert('Error al ingresar el pedido: ' + (data.message || ''));
    }
  })
  .catch(error => {
    console.error('Error al registrar pedido:', error);
    alert('Hubo un problema al procesar el pedido');
  });
}

// Registrar salida de aguacates
function registrarSalida(event) {
  event.preventDefault();

  const destino = document.getElementById('destino').value.trim();
  const cantidadSalida = parseInt(document.getElementById('cantidadSalida').value);
  const fechaSalida = document.getElementById('fechaSalida').value;




  const datosSalida = {
    destino: destino,
    cantidad: cantidadSalida,
    fecha_salida: fechaSalida,
    
  };

  fetch('http://localhost:3000/api/salidas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosSalida)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Salida registrada con éxito');
    } else {
      alert('Error al registrar salida: ' + (data.message || ''));
    }
  })
  .catch(error => {
    console.error('Error al registrar salida:', error);
    alert('Hubo un problema al registrar la salida');
  });
}

// Generar reporte
function generarReporte() {
  fetch('http://localhost:3000/api/reporte')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const reporte = data.reporte;
        const contenedor = document.getElementById('contenedorReporte');
        contenedor.innerHTML = `
          <h3>Reporte Diario</h3>
          <ul>
            ${reporte.map(item => `
              <li>${item.fecha} - Pedido: ${item.pedido} - Salida: ${item.salida}</li>
            `).join('')}
          </ul>
        `;
      } else {
        alert('Error al generar el reporte');
      }
    })
    .catch(error => {
      console.error('Error al generar reporte:', error);
      alert('Hubo un problema al generar el reporte');
    });
}

// Cerrar sesión
function cerrarSesion() {
  window.location.href = 'login.html';
}
