const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/informacoes', (req, res) => {
    res.json({
        projeto: 'Loja Ecommerce Online',
        descricao: 'Aplicação Backend para a loja Manto - 017',
        status: 'online',
        horario: req.horario
    })
})

module.exports = router