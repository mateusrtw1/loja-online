const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const enderecos = await prisma.enderecos.findMany()
    res.json(enderecos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const endereco = await prisma.enderecos.findUnique({
      where: { id }
    })

    if (!endereco)
      return res.status(404).json({ erro: 'Endereço não encontrado' })

    res.json(endereco)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {
      usuarioId,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      complemento
    } = req.body

    const endereco = await prisma.enderecos.create({
      data: {
        usuarioId,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        complemento
      }
    })

    res.status(201).json(endereco)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const endereco = await prisma.enderecos.update({
      where: { id },
      data: req.body
    })

    res.json(endereco)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    await prisma.enderecos.delete({
      where: { id }
    })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router