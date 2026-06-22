const express = require('express')
const router = express.Router()

const produtos = [
    { id: 1, nome: 'Notebook', categoria: 'Periféricos', preco: 3500.00 },
    { id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 150.00 },
    { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 280.00 }
]

router.get('/', (req, res) => {
    const { categoria } = req.query

    if (categoria) {
        const filtrados = produtos.filter(
            p => p.categoria.toLowerCase() === categoria.toLowerCase()
        )

        return res.json(filtrados)
    }

    res.json(produtos)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)

    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        return res.status(404).json({
            erro: 'Produto não encontrado'
        })
    }

    res.json(produto)
})

router.post('/', (req, res) => {
    const { nome, categoria, preco } = req.body

    if (!nome || !categoria || preco === undefined) {
        return res.status(400).json({
            erro: 'nome, categoria e preco são obrigatórios'
        })
    }

    const novoProduto = {
        id: produtos.length + 1,
        nome,
        categoria,
        preco
    }

    produtos.push(novoProduto)

    res.status(201).json(novoProduto)
})

router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({
            erro: 'Produto não encontrado'
        })
    }

    const { nome, categoria, preco } = req.body

    produtos[index] = {
        id,
        nome,
        categoria,
        preco
    }

    res.json(produtos[index])
})

router.patch('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({
            erro: 'Produto não encontrado'
        })
    }

    produtos[index] = {
        ...produtos[index],
        ...req.body,
        id
    }

    res.json(produtos[index])
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({
            erro: 'Produto não encontrado'
        })
    }

    produtos.splice(index, 1)

    res.status(204).send()
})

module.exports = router