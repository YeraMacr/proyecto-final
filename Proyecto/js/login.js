const API_URL = 'https://proyecto-final-production-9ab6.up.railway.app';
function iniciarSesion(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    const datosLogin = { nombre, contraseña };

    fetch(`${API_URL}`/api/login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosLogin)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("¡Inicio de sesión exitoso!");
            // Redirigir al dashboard o página principal
            window.location.href = "dashboard.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        alert("Ocurrió un error. Intenta de nuevo.");
    });
}