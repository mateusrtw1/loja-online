const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const pagamentos = await prisma.pagamentos.findMany({
      include: {
        pedido: true
      }
    })

    res.json(pagamentos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const pagamento = await prisma.pagamentos.findUnique({
      where: { id },
      include: {
        pedido: true
      }
    })

    if (!pagamento)
      return res.status(404).json({ erro: 'Pagamento não encontrado' })

    res.json(pagamento)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      pedidoId,
      metodo,
      valor,
      status
    } = req.body

    const pagamento = await prisma.pagamentos.create({
      data: {
        pedidoId,
        metodo,
        valor,
        status
      }
    })

    res.status(201).json(pagamento)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const pagamento = await prisma.pagamentos.update({
      where: { id },
      data: req.body
    })

    res.json(pagamento)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    await prisma.pagamentos.delete({
      where: { id }
    })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router