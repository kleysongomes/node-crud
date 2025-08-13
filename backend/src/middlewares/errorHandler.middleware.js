const errorHandler = (error, req, res, next) => {

    console.error(error.stack);

    // '23505' é o código de erro para 'unique_violation'
    if (error.code === '23505') {

        let field = 'campo desconhecido';
        
        if (error.constraint) {
            
            field = error.constraint.split('_')[1];
            
            if (field === 'pkey') {
                field = 'RA';
            }
        }
        
        return res.status(409).json({
            status: "fail",
            message: `Já existe um registro com este valor para o campo '${field}'.`
        });
    }

    res.status(500).json({
        status: "error",
        message: "Ocorreu um erro inesperado no servidor."
    });
};

module.exports = errorHandler;