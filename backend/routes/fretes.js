const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const fretes = await prisma.fretes.findMany()
    res.json(fretes)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const frete = await prisma.fretes.findUnique({
      where: { id }
    })

    if (!frete)
      return res.status(404).json({ erro: 'Frete não encontrado' })

    res.json(frete)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      nome,
      valor,
      prazoDias
    } = req.body

    const frete = await prisma.fretes.create({
      data: {
        nome,
        valor,
        prazoDias
      }
    })

    res.status(201).json(frete)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const frete = await prisma.fretes.update({
      where: { id },
      data: req.body
    })

    res.json(frete)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    await prisma.fretes.delete({
      where: { id }
    })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router