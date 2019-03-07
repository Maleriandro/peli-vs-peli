var db = require('../mysql.js');


async function getCompetencias(req, res) {
    const query = `SELECT * FROM competencia`;

    try {
        var rows = await db(query);

        res.send(rows);
    } catch (error) {
        respuestaError(error, res);
    }
    
    // db.query(query, function(error, rows) {
    //     res.send(rows);
    // });
}


async function getUnaCompetencia(req, res) {
    const query = `
                    SELECT * FROM competencia
                    WHERE id = ${req.params.id};
    `

    try {
        var rows = await db(query);

        res.send(rows);
    } catch (error) {
        respuestaError(error, res);
    }    
}


async function getPeliculasCompetencia(req, res) {
    const queryCompetencia = `
    SELECT * FROM competencia
    WHERE id = ${req.params.id};
    `
    
    const queryPeliculas = `SELECT * FROM pelicula
    ORDER BY RAND()
    LIMIT 2; `;
    
    try {
        var competencia = await db(queryCompetencia);
        
        if (competencia.length === 0) {
            res.status(404);
            res.send({
                message: 'No se encontró ningun resultado'
            });

            return;
        }
        
        var peliculas = await db(queryPeliculas);
        
        const response = {
            competencia: competencia[0].nombre,
            peliculas: peliculas
        }
        
        res.send(response)
    } catch (error) {
        respuestaError(error, res);
    }
}


async function votarCompetencia(req, res) {
    const competencia = req.params.id
    const idPeliculaVotada = req.body.idPelicula;

    const queryExisteCompetencia = `
        SELECT * FROM competencia
        WHERE id = ${competencia};
    `

    const queryExistePelicula = `
        SELECT * FROM pelicula
        WHERE id = ${idPeliculaVotada};
    `

    const query = `INSERT INTO pelicula_competencia (pelicula_id, competencia_id)
                    VALUES (${idPeliculaVotada}, ${competencia})`;

    try {
        


    } catch (error) {
        
    }
    
}


function respuestaError(error, res) {
    res.status(500);
	
	res.send({
        message: error.message
	});
}







module.exports = {
    getCompetencias : getCompetencias,
    getUnaCompetencia : getUnaCompetencia,
    getPeliculasCompetencia : getPeliculasCompetencia,
    votarCompetencia: votarCompetencia
}