const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

const categorias = [
  { id: 1, nome: 'Informática' },
  { id: 2, nome: 'Periféricos' },
  { id: 3, nome: 'Acessórios' }
]

router.get('/categorias', (req, res, next) => {
  try {
    res.json(categorias)
  } catch (err) {
    next(err)
  }
})

router.get('/categorias/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const categoria = categorias.find(c => c.id === id)

    if (!categoria) {
      const err = new Error('Categoria não encontrada')
      err.status = 404
      throw err
    }

    res.json(categoria)
  } catch (err) {
    next(err)
  }
})

router.post('/categorias', (req, res, next) => {
  try {
    const { nome } = req.body

    if (!nome) {
      const err = new Error('Nome é obrigatório')
      err.status = 400
      throw err
    }

    const novaCategoria = {
      id: categorias.length + 1,
      nome
    }

    categorias.push(novaCategoria)

    res.status(201).json(novaCategoria)
  } catch (err) {
    next(err)
  }
})

router.put('/categorias/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = categorias.findIndex(c => c.id === id)

    if (index === -1) {
      const err = new Error('Categoria não encontrada')
      err.status = 404
      throw err
    }

    const { nome } = req.body

    if (!nome) {
      const err = new Error('Nome é obrigatório')
      err.status = 400
      throw err
    }

    categorias[index] = {
      id,
      nome
    }

    res.json(categorias[index])
  } catch (err) {
    next(err)
  }
})

router.patch('/categorias/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = categorias.findIndex(c => c.id === id)

    if (index === -1) {
      const err = new Error('Categoria não encontrada')
      err.status = 404
      throw err
    }

    categorias[index] = {
      ...categorias[index],
      ...req.body,
      id
    }

    res.json(categorias[index])
  } catch (err) {
    next(err)
  }
})

router.delete('/categorias/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const index = categorias.findIndex(c => c.id === id)

    if (index === -1) {
      const err = new Error('Categoria não encontrada')
      err.status = 404
      throw err
    }

    categorias.splice(index, 1)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router