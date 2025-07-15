function registrarSalida(evento) {
    evento.preventDefault();  // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores de los campos
    const destino = document.getElementById("destino").value.trim();
    const cantidad = parseInt(document.getElementById("cantidadSalida").value);
    const fecha_salida = document.getElementById("fechaSalida").value;

    // Validar que los campos no estén vacíos o sean inválidos
    if (!destino || isNaN(cantidad) || !fecha_salida) {
        alert("Todos los campos son obligatorios y deben ser válidos.");
        return;
    }

    // Crear el objeto con los datos que enviarás al servidor
    const salidas = {
        destino: destino,
        cantidad: cantidad,
        fecha_salida: fecha_salida
    };

    // Enviar los datos al servidor utilizando Fetch API
    fetch("http://localhost:3000/api/salidas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(salidas)
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud al servidor');
        }
        return respuesta.json();
    })
    .then(data => {
        if (data.success) {
            alert("Salida registrada correctamente");
        } else {
            alert("Hubo un problema al registrar la salida: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al registrar la salida. Intenta nuevamente.');
    });
}
