var socket = io();

var params = new URLSearchParams( window.location.search);
console.log(params.name);

if(!params.has('name') || !params.has('room')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son ncesarios')
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}


socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('chatIn', {user}, function(resp){
        console.log( 'Usuarios conectados', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Matías',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// socket.emit('createMsg', {
//     usuario: 'Matías',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMsg', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cuando un usuario entre o sale del chat

socket.on('personList', function(users) {

    console.log(users);

});

// Mensajes privados

socket.on('privateMsg', function(msg) {

    console.log('Mensaje Privado:', msg);


})