$( document ).ready(function() {
 
    alert("Bienvenido");

    $("#agregar").submit(function(event){
        event.preventDefault();
        alert("usuario agregado correctamente");
    });
 
});