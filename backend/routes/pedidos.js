const express = require('express')
const router = express.Router()
const prisma = require('../../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const pedidos = await prisma.pedidos.findMany()
    res.json(pedidos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {

    const id = Number(req.params.id)

    const pedido = await prisma.pedidos.findUnique({
      where: { id }
    })

    if (!pedido)
      return res.status(404).json({ erro: 'Pedido não encontrado' })

    res.json(pedido)

  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {

    const { usuarioId, produtoId, quantidade, total } = req.body

    const pedido = await prisma.pedidos.create({
      data: {
        usuarioId,
        produtoId,
        quantidade,
        total
      }
    })

    res.status(201).json(pedido)

  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {

    const id = Number(req.params.id)

    const { usuarioId, produtoId, quantidade, total } = req.body

    const pedido = await prisma.pedidos.update({
      where: { id },
      data: {
        usuarioId,
        produtoId,
        quantidade,
        total
      }
    })

    res.json(pedido)

  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {

    const id = Number(req.params.id)

    await prisma.pedidos.delete({
      where: { id }
    })

    res.sendStatus(204)

  } catch (err) {
    next(err)
  }
})

module.exports = router