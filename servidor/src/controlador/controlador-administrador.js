var db = require('../mysql.js');
const respuesta = require('../respuestas-estandarizadas/respuestas.js')


async function agregarCompetencia(req, res) {
    const nombre = req.body.nombre;
    const genero = isZero(req.body.genero);
    const director = isZero(req.body.director);
    const actor = isZero(req.body.actor);

    const queryBuscarCompetencia = `SELECT id, nombre FROM competencia WHERE nombre = '${nombre}'`;

    const query = `INSERT INTO competencia (nombre, genero_id, director_id, actor_id)
                    VALUES ('${nombre}', ${genero}, ${director}, ${actor})`;



    try {
        var buscarCompetencia = await db(queryBuscarCompetencia);

        if (buscarCompetencia.length == 1) {
            res.status(422);
            res.send('Ya existe una competencia con ese nombre.')

            return;
        }

        await db(query);

        res.status(204);
        res.send({message: 'Se creó la competencia'});

    } catch (error) {
        respuesta.error(error, res)
    }

    
}

async function cargarGeneros(req, res) {
    const query = `SELECT id, nombre FROM genero`;

    try {
        const generos = await db(query);

        respuesta.success(generos, res);
        
    } catch (error) {
        respuesta.error(error, res);
    }
}

async function cargarDirectores(req, res) {
    const query = `SELECT id, nombre FROM director`;

    try {
        const directores = await db(query);

        respuesta.success(directores, res);
        
    } catch (error) {
        respuesta.error(error, res);
    }
}

async function cargarActores(req, res) {
    const query = `SELECT id, nombre FROM actor`;

    try {
        const actores = await db(query);

        respuesta.success(actores, res)
        
    } catch (error) {
        respuesta.error(error, res);
    }
}

async function eliminarVotos(req, res) {
    const queryBuscarCompetencia = `SELECT id, nombre FROM competencia WHERE id = '${req.params.id}'`;

    const queryEliminarVotos = `DELETE FROM pelicula_competencia WHERE competencia_id = ${req.params.id} `;
    
    try {
        var buscarCompetencia = await db(queryBuscarCompetencia);
        
        if (buscarCompetencia.length == 0) {
            res.status(404);
            res.send('No existe la competencia')

            return;
        }

        await db(queryEliminarVotos);

        res.status(204);
        res.send({message: 'Se eliminaron los votos'})

    } catch (error) {
        respuesta.error(error, res);
    }
}

async function eliminarCompetencia(req, res) {
    try {

    const compId = req.params.id;
    console.log('antesVosos')
    await eliminarVotos(req, res);

    const queryEliminarComp = `DELETE FROM competencia WHERE id = ${compId}`;

        // ! REVISAR ERROR AL ELIMINAR
        await db(queryEliminarComp);


        res.status(204);
        res.send({message: 'Se eliminó la competencia'})
    } catch (error) {
        respuesta.error(error, res);
    }
}

async function cambiarNombreCompetencia(req, res) {
    const queryExisteNombre = `SELECT nombre FROM competencia WHERE nombre = '${req.body.nombre}'`;
    
    const query = `UPDATE competencia 
                    SET nombre = '${req.body.nombre}'
                    WHERE id = ${req.params.id}`;

    try {
        const existeNombre = await db(queryExisteNombre);

        if (existeNombre.length == 1) {
            res.status(422)
            res.send('Ya existe una competencia con ese nombre');

            return;
        }


        await db(query);

        res.status(204);
        res.send({message: 'Se cambió el nombre a la competencia'});

    } catch (error) {
        respuesta.error(error, res);
    }

        
}

function isZero (variable) {
    if (variable == 0) {
        return null;
    } else {
        return variable;
    }
} 



module.exports = {
    agregarCompetencia : agregarCompetencia,
    cargarGeneros : cargarGeneros,
    cargarDirectores : cargarDirectores,
    cargarActores : cargarActores,
    eliminarVotos : eliminarVotos,
    eliminarCompetencia : eliminarCompetencia,
    cambiarNombreCompetencia : cambiarNombreCompetencia
}