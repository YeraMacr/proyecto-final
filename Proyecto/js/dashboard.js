function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
  const seccion = document.getElementById(id);
  if (seccion) seccion.style.display = 'block';
}

function registrarPedido(e) {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const fecha_pedido = document.getElementById("fechaPedido").value;

  if (!cliente || isNaN(cantidad) || !fecha_pedido) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch("http://localhost:3000/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente, cantidad, fecha_pedido })
  })
  .then(res => res.json())
  .then(data => alert(data.success ? "Pedido ingresado con éxito" : "Error: " + (data.message || '')))
  .catch(() => alert("Error al registrar pedido"));
}

function registrarSalida(e) {
  e.preventDefault();
  const destino = document.getElementById("destino").value.trim();
  const cantidad = parseInt(document.getElementById("cantidadSalida").value);
  const fecha_salida = document.getElementById("fechaSalida").value;

  if (!destino || isNaN(cantidad) || !fecha_salida) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch("http://localhost:3000/api/salidas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destino, cantidad, fecha_salida })
  })
  .then(res => res.json())
  .then(data => alert(data.success ? "Salida registrada correctamente" : "Error: " + (data.message || '')))
  .catch(() => alert("Error al registrar salida"));
}

function generarReporte() {
  const fechaInput = document.getElementById("fechaReporte").value;
  if (!fechaInput) {
    alert("Por favor selecciona una fecha.");
    return;
  }

  fetch(`http://localhost:3000/api/reporte?fecha=${fechaInput}`)
    .then(res => {
      if (!res.ok) throw new Error("Respuesta no válida del servidor");
      return res.json();
    })
    .then(data => {
      if (!data.success) {
        alert("Error en el servidor: " + (data.message || "Desconocido"));
        return;
      }

      const tabla = data.reporte.map(item => `
        <tr>
          <td>${new Date(item.fecha).toLocaleDateString()}</td>
          <td>${item.pedido}</td>
          <td>${item.salida}</td>
        </tr>
      `).join('');

      document.getElementById('contenedorReporte').innerHTML = `
        <h4 class="chart-title">Reporte del Día</h4>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; background: white; border-radius: 10px;">
          <thead><tr><th>Fecha</th><th>Pedido</th><th>Salida</th></tr></thead>
          <tbody>${tabla}</tbody>
        </table>`;
    })
    .catch(error => {
      console.error("❌ Error al generar el reporte:", error);
      alert("Hubo un problema al generar el reporte");
    });
}



function imprimirReporte() {
  const contenido = document.getElementById('contenedorReporte').innerHTML;
  const ventana = window.open('', '', 'height=800,width=800');
  ventana.document.write('<html><head><title>Reporte Diario</title></head><body>');
  ventana.document.write(contenido);
  ventana.document.write('</body></html>');
  ventana.document.close();
  ventana.print();
}

function cerrarSesion() {
  window.location.href = 'login.html';
}

function cambiarContraseña(event) {
  event.preventDefault();
  const datos = {
    nombre: document.getElementById('nombreUsuario').value,
    contraseñaActual: document.getElementById('contraseñaActual').value,
    nuevaContraseña: document.getElementById('nuevaContraseña').value,
  };

  fetch('http://localhost:3000/api/cambiar-contrasena', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    const mensaje = document.getElementById('mensajeContraseña');
    mensaje.textContent = data.success ? 'Contraseña cambiada con éxito' : 'Error: ' + (data.message || '');
    mensaje.style.color = data.success ? 'green' : 'red';
  })
  .catch(() => {
    const mensaje = document.getElementById('mensajeContraseña');
    mensaje.textContent = 'Hubo un problema al cambiar la contraseña';
    mensaje.style.color = 'red';
  });
}
