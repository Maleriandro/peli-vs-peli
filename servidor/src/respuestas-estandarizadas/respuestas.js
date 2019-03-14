function respuestaError(error, res) {
    res.status(500);
	
	res.send(
        error.message
    );
    
    console.log(error);
}

function respuestaSuccess(rows, res, specificResponse) {
    if (rows.length == 0) {
        res.sendStatus(404);

        return false;
    } else {
        if (specificResponse) {
            res.send(specificResponse)
        } else {
            res.send(rows);
        }
    }
}

module.exports = {
    error : respuestaError,
    success : respuestaSuccess
}