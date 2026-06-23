const express = require('express')
const router = express.Router()

const categorias = [
  { id: 1, nome: 'Informática' },
  { id: 2, nome: 'Periféricos' },
  { id: 3, nome: 'Acessórios' }
]

router.get('/categorias', (req, res) => {
  res.json(categorias)
})

router.get('/categorias/:id', (req, res) => {
  const id = Number(req.params.id)

  const categoria = categorias.find(c => c.id === id)

  if (!categoria) {
    return res.status(404).json({
      erro: 'Categoria não encontrada'
    })
  }

  res.json(categoria)
})

router.post('/categorias', (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({
      erro: 'Nome é obrigatório'
    })
  }

  const novaCategoria = {
    id: categorias.length + 1,
    nome
  }

  categorias.push(novaCategoria)

  res.status(201).json(novaCategoria)
})

router.put('/categorias/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = categorias.findIndex(c => c.id === id)

  if (index === -1) {
    return res.status(404).json({
      erro: 'Categoria não encontrada'
    })
  }

  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({
      erro: 'Nome é obrigatório'
    })
  }

  categorias[index] = {
    id,
    nome
  }

  res.json(categorias[index])
})

router.patch('/categorias/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = categorias.findIndex(c => c.id === id)

  if (index === -1) {
    return res.status(404).json({
      erro: 'Categoria não encontrada'
    })
  }

  categorias[index] = {
    ...categorias[index],
    ...req.body,
    id
  }

  res.json(categorias[index])
})

router.delete('/categorias/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = categorias.findIndex(c => c.id === id)

  if (index === -1) {
    return res.status(404).json({
      erro: 'Categoria não encontrada'
    })
  }

  categorias.splice(index, 1)

  res.status(204).send()
})

module.exports = router