const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const cupons = await prisma.cupons.findMany()
    res.json(cupons)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const cupom = await prisma.cupons.findUnique({
      where: { id }
    })

    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado' })
    }

    res.json(cupom)

  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      codigo,
      desconto,
      ativo
    } = req.body

    const cupom = await prisma.cupons.create({
      data: {
        codigo,
        desconto,
        ativo
      }
    })

    res.status(201).json(cupom)

  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const {
      codigo,
      desconto,
      ativo
    } = req.body

    const cupom = await prisma.cupons.update({
      where: { id },
      data: {
        codigo,
        desconto,
        ativo
      }
    })

    res.json(cupom)

  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    await prisma.cupons.delete({
      where: { id }
    })

    res.sendStatus(204)

  } catch (err) {
    next(err)
  }
})

module.exports = router