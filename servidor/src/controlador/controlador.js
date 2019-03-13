const db = require('../mysql.js');
const respuesta = require('../respuestas-estandarizadas/respuestas.js')


async function getCompetencias(req, res) {
    const query = `SELECT * FROM competencia`;

    try {
        var rows = await db(query);

        respuesta.success(rows, res);
    } catch (error) {
        respuesta.error(error, res);
    }
    
}


async function getUnaCompetencia(req, res) {
    const query = `
                    SELECT c.nombre, g.nombre AS genero_nombre, d.nombre AS director_nombre, a.nombre AS actor_nombre 
                    FROM competencia c
                    LEFT JOIN genero g ON genero_id = g.id
                    LEFT JOIN director d on director_id = d.id
                    LEFT JOIN actor a on actor_id = a.id
                    WHERE c.id = ${req.params.id};
    `;

    try {
        const rows = await db(query);

        const response = rows[0];

        respuesta.success(rows, res, response);
    } catch (error) {
        respuesta.error(error, res);
    }    
}


async function getPeliculasCompetencia(req, res) {
    const queryCompetencia = `
    SELECT * FROM competencia
    WHERE id = ${req.params.id};
    `;
    
    
    
    try {
        var competencia = await db(queryCompetencia);
        
        if (competencia.length === 0) {
            res.status(404);
            res.send({
                message: 'No se encontró ningun resultado'
            });

            return;
        }

        var datosCompetencia = competencia[0];

        const generoId = datosCompetencia.genero_id;
        const directorId = datosCompetencia.director_id;
        const actorId = datosCompetencia.actor_id;
        
        let queryPeliculas = `SELECT p.id, p.poster, p.titulo FROM pelicula p
                            JOIN director_pelicula d_p ON d_p.pelicula_id = p.id
                            JOIN actor_pelicula a_p ON a_p.pelicula_id = p.id
                            WHERE 1 = 1`;
        
        
        if (generoId) {
            queryPeliculas += ` AND genero_id = ${generoId}`;
        }

        if (directorId) {
            queryPeliculas += ` AND d_p.director_id = ${directorId}`;
        }

        if (actorId) {
            queryPeliculas += ` AND a_p.actor_id = ${actorId}`;
        }
        
        queryPeliculas += ` ORDER BY RAND()
                            LIMIT 2;`;
        
        var peliculas = await db(queryPeliculas);
        
        const response = {
            competencia: competencia[0].nombre,
            peliculas: peliculas
        }
        
        respuesta.success(peliculas, res, response);
    } catch (error) {
        respuesta.error(error, res);
    }
}


async function votarCompetencia(req, res) {
    const idCompetencia = req.params.id
    const idPeliculaVotada = req.body.idPelicula;

    const queryExisteCompetencia = `
        SELECT * FROM competencia
        WHERE id = ${idCompetencia};
    `;

    const queryExistePelicula = `
        SELECT * FROM pelicula
        WHERE id = ${idPeliculaVotada};
    `;

    const query = `INSERT INTO pelicula_competencia (pelicula_id, competencia_id)
                    VALUES (${idPeliculaVotada}, ${idCompetencia})`;

    try {
        var competencia = await db(queryExisteCompetencia);
        var peliculaVotada = await db(queryExistePelicula);

        var existeCompetencia = (competencia.length === 1);
        var existePelicula = (peliculaVotada.length === 1);

        if (existeCompetencia && existePelicula) {
            
            await db(query);

            res.status(204);
            res.send('Se registró el voto')
            

        } else {
            let message;
            
            if (!existeCompetencia) {
                message = 'No se encontró la competencia';
            } else {
                message = 'No se encontró la pelicula votada';
            }
                        
            res.status(404);
            res.send({
                message: message
            });
        }

    } catch (error) {
        respuesta.error(error,res);
    }
    
}

async function obtenerResultados(req, res) {
    const idCompetencia = req.params.id;

    const query = `SELECT count(*) AS votos, pelicula_id, pelicula.poster, pelicula.titulo
                    FROM pelicula_competencia
                    JOIN pelicula ON pelicula_competencia.pelicula_id = pelicula.id
                    JOIN competencia ON pelicula_competencia.competencia_id = competencia.id
                    WHERE competencia_id = ${idCompetencia}
                    GROUP BY pelicula_id
                    ORDER BY votos DESC
                    LIMIT 3;`;

    const queryNombreCompetencia = `SELECT nombre FROM competencia WHERE id = ${idCompetencia}`;

        
    try {
        const nombreCompetencia = await db(queryNombreCompetencia);

        if (nombreCompetencia.length === 0) {
            res.status(404);
            res.send({
                message: 'No se encontró ningun resultado'
            });

            return;
        }

        const votos = await db(query);
        
        
        const response = {
            competencia: nombreCompetencia[0].nombre,
            resultados: votos
        }

        respuesta.success(votos, res, response);


    } catch (error) {
        respuesta.error(error, res);
    }

}

module.exports = {
    getCompetencias : getCompetencias,
    getUnaCompetencia : getUnaCompetencia,
    getPeliculasCompetencia : getPeliculasCompetencia,
    votarCompetencia: votarCompetencia,
    obtenerResultados: obtenerResultados
}