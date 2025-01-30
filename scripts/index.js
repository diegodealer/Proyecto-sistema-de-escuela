$(document).ready(function () {
    alert("Bienvenido");

    var MiApp = function () {
        this.data = [];
    };

    var miApp = new MiApp();

    // Evento para agregar maestro
    $("#agregar").submit(function (event) {
        event.preventDefault();

        // Simulando agregar maestro al array local
        const nombre = $("#nombre").val();
        const apellidoPaterno = $("#apellido_paterno").val();
        const apellidoMaterno = $("#apellido_materno").val();
        const correo = $("#correo").val();
        const telefono = $("#telefono").val();
        const fechaIngreso = $("#fecha_ingreso").val();

        // Validar campos simples
        if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
            alert("Todos los campos obligatorios deben ser completados.");
            return;
        }

        // Agregar maestro a la lista
        miApp.data.push({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            correo,
            telefono,
            fechaIngreso,
        });

        alert("Maestro agregado correctamente");
        $("#agregar")[0].reset(); // Limpiar el formulario
    });

    // Evento para consultar maestros
    $("#consult").submit(function (event) {
        event.preventDefault();

        $("#listaMaestro").empty(); // Limpiar resultados previos

        $.ajax({
            url: '/maestros',
            method: 'GET',
            dataType: "json",
            success: function (response) {  // Corrige "succes" a "success"
                console.log("Datos recibidos:", response);

                if (response.length === 0) {
                    $("#listaMaestro").append("<li>No hay maestros registrados.</li>");
                } else {
                    response.forEach(maestro => {
                        $("#listaMaestro").append(
                            `<li>${maestro.nombre} ${maestro.apellidoPaterno} - ${maestro.correo}</li>`
                        );
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener maestros:", error);
                $("#listaMaestro").append("<li>Error al cargar maestros.</li>");
            }
        });
    });
});
