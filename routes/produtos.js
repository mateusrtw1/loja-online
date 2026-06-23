const express = require('express')
const router = express.Router()

const produtos = [
  { id: 1, nome: 'Notebook', categoria: 'Periféricos', preco: 3500.00 },
  { id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 150.00 },
  { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 280.00 }
]

router.get('/', (req, res, next) => {
  try {
    const { categoria } = req.query

    if (categoria) {
      const filtrados = produtos.filter(
        p => p.categoria.toLowerCase() === categoria.toLowerCase()
      )

      return res.json(filtrados)
    }

    res.json(produtos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = produtos.find(p => p.id === id)

    if (!produto) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    res.json(produto)
  } catch (err) {
    next(err)
  }
})

router.post('/', (req, res, next) => {
  try {
    const { nome, categoria, preco } = req.body

    if (!nome || !categoria || preco === undefined) {
      const err = new Error('nome, categoria e preco são obrigatórios')
      err.status = 400
      throw err
    }

    const novoProduto = {
      id: produtos.length + 1,
      nome,
      categoria,
      preco
    }

    produtos.push(novoProduto)

    res.status(201).json(novoProduto)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    const { nome, categoria, preco } = req.body

    if (!nome || !categoria || preco === undefined) {
      const err = new Error('nome, categoria e preco são obrigatórios')
      err.status = 400
      throw err
    }

    produtos[index] = {
      id,
      nome,
      categoria,
      preco
    }

    res.json(produtos[index])
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    produtos[index] = {
      ...produtos[index],
      ...req.body,
      id
    }

    res.json(produtos[index])
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    produtos.splice(index, 1)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router