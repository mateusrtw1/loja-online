const express = require('express')
const router = express.Router()

router.get('/categorias', (req, res) => {
    res.json([
        { id: 1, nome: 'Informática' },
        { id: 2, nome: 'Periféricos' },
        { id: 3, nome: 'Acessórios' }
    ])
})

module.exports = router