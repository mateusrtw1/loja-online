const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await prisma.usuarios.findMany()
    res.json(usuarios)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const usuario = await prisma.usuarios.findUnique({
      where: { id }
    })

    if (!usuario)
      return res.status(404).json({ erro: 'Usuário não encontrado' })

    res.json(usuario)

  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {

    const { nome, email, senha } = req.body

    const usuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha
      }
    })

    res.status(201).json(usuario)

  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {

    const id = Number(req.params.id)

    const { nome, email, senha } = req.body

    const usuario = await prisma.usuarios.update({
      where: { id },
      data: {
        nome,
        email,
        senha
      }
    })

    res.json(usuario)

  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {

    const id = Number(req.params.id)

    await prisma.usuarios.delete({
      where: { id }
    })

    res.sendStatus(204)

  } catch (err) {
    next(err)
  }
})

module.exports = router