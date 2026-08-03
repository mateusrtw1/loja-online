const express = require('express')
const router = express.Router()

router.get('/informacoes', (req, res) => {
    res.json({
        projeto: 'Loja Ecommerce Online',
        descricao: 'Aplicação Backend para o meu projeto de ecommerce',
        status: 'online',
        horario: req.horario
    })
})

module.exports = router