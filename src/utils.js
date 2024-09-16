export const procesaErrores = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde nuevamente`,
            detalle: `${error.message}`
        }
    )
}