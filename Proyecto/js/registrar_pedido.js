function registrarPedido(evento) {
    evento.preventDefault();  // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores de los campos
    const cliente = document.getElementById("cliente").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const fecha_pedido = document.getElementById("fechaPedido").value;

    // Validar que los campos no estén vacíos o sean inválidos
    if (!cliente || isNaN(cantidad) || !fecha_pedido) {
        alert("Todos los campos son obligatorios y deben ser válidos.");
        return;
    }

    // Crear el objeto con los datos que enviarás al servidor
    const pedidos = {
        cliente: cliente,
        cantidad: cantidad,
        fecha_pedido: fecha_pedido
    };

    // Enviar los datos al servidor utilizando Fetch API
    fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidos)
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud al servidor');
        }
        return respuesta.json();
    })
    .then(data => {
        if (data.success) {
            alert("Pedido registrado correctamente");
        } else {
            alert("Hubo un problema al registrar el pedido: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al registrar el pedido. Intenta nuevamente.');
    });
}
