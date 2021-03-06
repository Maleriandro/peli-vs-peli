var express = require('express');
var controlador = require('./controlador/controlador.js');
const controladorAdministrador = require('./controlador/controlador-administrador.js')
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', controlador.get);
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


app.listen(8080, function() {
    console.log('Servidor escuchando en el puerto 8080');
  });