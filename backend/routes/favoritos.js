const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const favoritos = await prisma.favoritos.findMany({
      include: {
        usuario: true,
        produto: true
      }
    })

    res.json(favoritos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const favorito = await prisma.favoritos.findUnique({
      where: { id },
      include: {
        usuario: true,
        produto: true
      }
    })

    if (!favorito)
      return res.status(404).json({ erro: 'Favorito não encontrado' })

    res.json(favorito)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { usuarioId, produtoId } = req.body

    const favorito = await prisma.favoritos.create({
      data: {
        usuarioId,
        produtoId
      }
    })

    res.status(201).json(favorito)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    await prisma.favoritos.delete({
      where: { id }
    })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router