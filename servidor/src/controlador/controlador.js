var db = require('../mysql.js');


async function getCompetencias(req, res) {
    const query = `SELECT * FROM competencia`;

    try {
        var rows = await db(query);

        res.send(rows);
    } catch (error) {
        respuestaError(error, res);
        console.log(error)
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
    const idCompetencia = req.params.id
    const idPeliculaVotada = req.body.idPelicula;

    const queryExisteCompetencia = `
        SELECT * FROM competencia
        WHERE id = ${idCompetencia};
    `

    const queryExistePelicula = `
        SELECT * FROM pelicula
        WHERE id = ${idPeliculaVotada};
    `

    const query = `INSERT INTO pelicula_competencia (pelicula_id, competencia_id)
                    VALUES (${idPeliculaVotada}, ${idCompetencia})`;

    try {
        var competencia = await db(queryExisteCompetencia);
        var peliculaVotada = await db(queryExistePelicula);

        var existeCompetencia = (competencia.length === 1);
        var existePelicula = (peliculaVotada.length === 1);

        if (existeCompetencia && existePelicula) {
            
            await db(query);

            res.status(200);
            res.send()
            

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
            })
        }



        


    } catch (error) {
        respuestaError(error,res);
    }
    
}

async function obtenerResultados(req, res) {
    const idCompetencia = req.params.id;

    const query = `SELECT count(*) AS votos, pelicula_id, pelicula.poster, pelicula.titulo  FROM pelicula_competencia
    JOIN pelicula on pelicula_competencia.pelicula_id = pelicula.id
    JOIN competencia on pelicula_competencia.competencia_id = competencia.id
    WHERE competencia_id = ${idCompetencia}
    GROUP BY pelicula_id
    order by votos desc
    LIMIT 3;`;

    const queryNombreCompetencia = `SELECT nombre FROM competencia WHERE id = ${idCompetencia}`

        
    try {
        const nombreCompetencia = await db(queryNombreCompetencia);
        const votos = await db(query);
        
        
        const response = {
            competencia: nombreCompetencia[0].nombre,
            resultados: votos
        }

        res.send(response);


    } catch (error) {
        respuestaError(error, res);
        console.log(error);
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
    votarCompetencia: votarCompetencia,
    obtenerResultados: obtenerResultados
}