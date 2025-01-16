const express = require('express');
const session = require('express-session');
const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'mi-clave-secreta', // Secreto para firmar la cookie de la sesión
    resave: false, // No guardar la sesión si no ha sido modificada
    saveUninitialized: true, // Guarda la sesión aunque no haya sido inicializada
    cookie: { secure: false } // usar secure: true solo si usas https
}));

// Middleware para mostrar detalles de sesión
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = new Date(); // Asignamos la fecha de creación de la sesión
        }
        req.session.lastAccess = new Date(); // Asignamos la última vez que se accedió a la sesión
    }
    next();
});

// Ruta para asignar información de usuario a la sesión
app.get('/set-user', (req, res) => {
    const user = {
        id: 1,
        name: 'Yáred Amaury Romero',
        email: '230190@utxicotepec.edu.mx'
    };

    // Guardar el usuario en la sesión
    req.session.user = user;

    res.send(`<h1>Usuario asignado a la sesión.</h1>
        <p><strong>Nombre:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
    `);
});

// Ruta para mostrar la información de la sesión y el usuario
app.get('/session', (req, res) => {
    if (req.session) {
        const sessionId = req.session.id;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = (new Date() - createdAt) / 1000; // Duración de la sesión en segundos

        const user = req.session.user || {}; // Datos del usuario en la sesión

        res.send(`
            <center><h1>Detalles de la sesión</h1>
            <p><strong>Id de sesión:</strong> ${sessionId}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso:</strong> ${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
            <h2>Detalles del usuario</h2>
            <p><strong>ID:</strong> ${user.id || 'No asignado'}</p>
            <p><strong>Nombre:</strong> ${user.name || 'No asignado'}</p>
            <p><strong>Email:</strong> ${user.email || 'No asignado'}</p></center>
        `);
    } else {
        res.send(`<h1>No hay una sesión activa.</h1>`);
    }
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión.');
        }
        res.send(`<h1>Sesión cerrada exitosamente.</h1>`);
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
