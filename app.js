const express=require('express');
const session=require('express-session');

const app=express();

app.use(session({
    secret:'mi-clave-secreta',//secreto para afirmar que la cookie de sesión
    reave:false,// No guardar la sesión si no ha sido modificado 
    saveUninitialized:true, //guarda la sesión aunque no haya sido inicializada
    cookie:{secure:false} //usar secure: true solo si usas http
}));

//middelware para mostrar detalles de sesión
app.use((req,res,next)=>{
    if(req.session){
        if(!req.session.createdAt){
            req.session.createdAt=new Date(); // Asignamos la  fecha de creación de la sesión
        }
        req.session.lastAcces=new Date();// Asignamos la última vez que se accedió a la sesión
    }
    next();
})

//ruta para mostrar la información de la sesión
app.get('/session',(req, res)=>{
    if(req.session){
        const sessionId=req.session.id;
        const createdAt=req.session.createdAt;
        const lastAcces=req.session.lastAcces;
        const sessionDuration= (new Date()-createdAt)/1000;
        res.send(`
        <h1>Detalles de la sesión</h1>
        <p><strong>Id de sesión:</strong> ${sessionId}</p>
        <p><strong>Fecha de creación de la sesión:</strong>${createdAt}</p>
        <p><strong>Último acceso:</strong>${lastAcces}</p>
        <p><strong>Duración de la sesión (en segundos):</strong>${sessionDuration}</p>
        `);
    }else{
        res.send(`<h1>Sesión cerrada exitosamente.</h1>`)
    }
});

//Ruta para cerrar la sesión
app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send('Error al cerrar sesión.');
        }
        res.send(`<h1>Sesión cerrada exitosamente</h1>`);
    });
});

//Iniciar el servidor en el puerto 3000
app.listen(3000,()=>{
    console.log('Servidor corriendo en el puero 3000');
});