const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

const produtos = [
  { id: 1, nome: 'Camisa Santos FC', categoria: 'Roupa', preco: 500.00 },
  { id: 2, nome: 'Camisa Santos FC II', categoria: 'Roupa', preco: 250.00 },
  { id: 3, nome: 'Camisa Santos FC III', categoria: 'Roupa', preco: 190.00 }
]

router.get('/', async (req, res, next) => {
  try {
    const { categoria } = req.query

    if (categoria) {
      const filtrados = produtos.filter(
        p => p.categoria.toLowerCase() === categoria.toLowerCase()
      )

      return res.json(filtrados)
    }

    const produtos = await prisma.produtos.findMany();
    res.json(produtos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produtos = await prisma.produtos.findUnique({
      where: { id }
    })

    if (!produtos) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    res.json(produtos)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { nome, preco, categoriasIds } = req.body

    if (!nome || preco === undefined) {
      const err = new Error('nome, categoria e preco são obrigatórios')
      err.status = 400
      throw err
    }

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        preco
      }
    });

    await prisma.produtosCategorias.createMany({
      data: categoriasIds.map(categoriaId => ({
        produtosId: novoProduto.id,
        categoriaId: categoriaId
      }))
    })

    res.status(201).json(novoProduto)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  console.log("bateu aq")

  try {
    const id = Number(req.params.id)
    const produtos = await prisma.produtos.findUnique({
      where: { id }
    })

    if (!produtos) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    const { nome, preco } = req.body

    const produtoAtualizado = await prisma.produtos.update({
      where: {id},
      data: { 
        nome, 
        preco 
      }
    })

    res.json(produtoAtualizado)
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

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const produtoEncontrado = await prisma.produtos.findUnique({
      where: { id }
    })

    if (!produtoEncontrado) {
      const err = new Error('Produto não encontrado')
      err.status = 404
      throw err
    }

    //produtos.splice(index, 1)
    await prisma.produtos.delete({
      where: { id }
    })

    res.status(204).send("Produto encontrado!!")
  } catch (err) {
    next(err)
  }
})

module.exports = router