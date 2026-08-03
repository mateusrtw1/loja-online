const express = require('express')
const router = express.router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res, next) => {
    try {
        const carrinhos = await prisma.carrinhos.findMany({
            include: {
                usuario: true,
                itens: {
                    include: {
                        produtos: true
                    }
                }
            }
        })

        res.json(carrinhos)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        const carrinho = await prisma.carrinho.findUnique({
            where: { id },
            include: {
                usuario: true,
                itens: {
                    include: {
                        produtos: true
                    }
                }
            }
        })

        if(!carrinho)
            return res.status(404).json({ erro: 'Carrinho não encontrado.'})

        res.json(carrinho)
    } catch (err) {
        next (err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { usuarioId } = req.body

        const carrinho = await prisma.carrinho.create({
            data: {
                usuarioId
            }
        })

        res.status(201).json(carrinho)
    } catch (err) {
        next (err)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id = number(req.params.id)

        const { usuarioId } = req.body

        const carrinho = await prisma.carrinho.update({
            where: { id },
            data: {
                usuarioId
            }
        })

        res.json(carrinho)
    } catch (err) {
        next (err)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        await prisma.carrinho.delete({
            where: { id }
        })

        res.sendStatus(204)
    } catch (err) {
        next (err)
    }
})

module.exports = router