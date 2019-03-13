var express = require('express');
var controlador = require('./controlador/controlador.js');
const controladorAdministrador = require('./controlador/controlador-administrador.js')
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', function(req, res) {res.send('hello world!')});
app.get('/competencias', controlador.getCompetencias);
app.get('/competencias/:id', controlador.getUnaCompetencia);
app.get('/competencias/:id/peliculas', controlador.getPeliculasCompetencia);
app.post('/competencias/:id/voto', controlador.votarCompetencia);
app.get('/competencias/:id/resultados', controlador.obtenerResultados);

// administrar competencias
app.post('/competencias', controladorAdministrador.agregarCompetencia);
app.get('/generos', controladorAdministrador.cargarGeneros);
app.get('/directores', controladorAdministrador.cargarDirectores);
app.get('/actores', controladorAdministrador.cargarActores);
app.delete('/competencias/:id/votos', controladorAdministrador.eliminarVotos);
app.delete('/competencias/:id', controladorAdministrador.eliminarCompetencia);
app.put('/competencias/:id', controladorAdministrador.cambiarNombreCompetencia);


app.listen(process.env.PORT, function() {
// Poner aca ese '0.0.0.0' le indica a express que tiene que correr el
// servidor en la IP de la computadora en la red local.
    console.log('Servidor escuchando en el puerto', process.env.PORT); 
    // El puerto del servidor termina siendo el 8080
  });