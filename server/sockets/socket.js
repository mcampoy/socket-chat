const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMsg } = require('../utilidades/utilidades');

const users = new Users();



io.on('connection', (client) => {

    client.on('chatIn', (data, cb) => {

        console.log(data);
        
        if(!data.user.name || !data.user.room) {
            return cb({
                error: true,
                msg: 'El nombre/sala es necesario'
            })
        }

        client.join(data.user.room)

        users.addUser(client.id, data.user.name, data.user.room)

        client.broadcast.to(data.user.room).emit('personList', users.getUsersInRoom(data.user.room))

        cb( users.getUsersInRoom( data.user.room) );
        
    });

    client.on('createMsg', (data) => {

        let person = users.getUser(client.id)

        let msg = createMsg( person.name, data.msg )

        client.broadcast.to(person.room).emit('createMsg', msg);
    } )

    client.on('disconnect', ()=> {

        let personDeleted = users.deleteUser(client.id)

        client.broadcast.to(personDeleted.room).emit('createMsg', createMsg('Admin', `${personDeleted.name} salió`))
        client.broadcast.to(personDeleted.room).emit('personList', users.getUsersInRoom(personDeleted.room))
    })

    // Mensajes Privados
    client.on('privateMsg', (data) => {
        
        let person = users.getUser(client.id)
        console.log(person);

        client.broadcast.to(data.para).emit('privateMsg', createMsg(person.name, data.msg))
        console.log(person.name);
        console.log(data.msg);
    })
})

