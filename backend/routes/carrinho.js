const express = require("express")
const router = express.Router()
const prisma = require("../lib/prisma")

router.get("/", async (req, res, next) => {
    try {
        const usuariosId = Number(req.usuarios.id)

        const itens = await prisma.carrinho.findMany({
            where: {
                usuariosId
            },
            include: {
                produtos: true
            },
            orderBy: {
                id: "asc"
            }
        })

        const total = itens.reduce((soma, item) => {
            return soma + Number(item.produtos.preco) * item.quantidade
        }, 0)

        const quantidadeItens = itens.reduce((soma, item) => {
            return soma + item.quantidade
        }, 0)

        res.json({
            itens,
            total,
            quantidadeItens
        })
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const usuariosId = Number(req.usuarios.id)
        const produtoId = Number(req.body.produtoId)
        const quantidade = Number(req.body.quantidade || 1)

        if (!produtoId) {
            return res.status(400).json({
                erro: "produtoId é obrigatório"
            })
        }

        if (quantidade <= 0) {
            return res.status(400).json({
                erro: "Quantidade inválida"
            })
        }

        const produto = await prisma.produtos.findUnique({
            where: {
                id: produtoId
            }
        })

        if (!produto) {
            return res.status(404).json({
                erro: "Produto não encontrado"
            })
        }

        if (produto.estoque <= 0) {
            return res.status(400).json({
                erro: "Produto sem estoque"
            })
        }

        const itemExistente = await prisma.carrinho.findUnique({
            where: {
                usuariosId_produtosId: {
                    usuariosId,
                    produtosId: produtoId
                }
            }
        })

        let item

        if (itemExistente) {
            const novaQuantidade =
                itemExistente.quantidade + quantidade

            if (novaQuantidade > produto.estoque) {
                return res.status(400).json({
                    erro: `Quantidade indisponível. Estoque disponível: ${produto.estoque}`
                })
            }

            item = await prisma.carrinho.update({
                where: {
                    id: itemExistente.id
                },
                data: {
                    quantidade: novaQuantidade
                },
                include: {
                    produtos: true
                }
            })
        } else {
            if (quantidade > produto.estoque) {
                return res.status(400).json({
                    erro: `Quantidade indisponível. Estoque disponível: ${produto.estoque}`
                })
            }

            item = await prisma.carrinho.create({
                data: {
                    usuariosId,
                    produtosId: produtoId,
                    quantidade
                },
                include: {
                    produtos: true
                }
            })
        }

        res.status(201).json(item)
    } catch (err) {
        next(err)
    }
})

router.patch("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const usuariosId = Number(req.usuarios.id)
        const quantidade = Number(req.body.quantidade)

        if (!quantidade || quantidade <= 0) {
            return res.status(400).json({
                erro: "Quantidade inválida"
            })
        }

        const item = await prisma.carrinho.findFirst({
            where: {
                id,
                usuariosId
            },
            include: {
                produtos: true
            }
        })

        if (!item) {
            return res.status(404).json({
                erro: "Item não encontrado no carrinho"
            })
        }

        if (quantidade > item.produtos.estoque) {
            return res.status(400).json({
                erro: `Quantidade indisponível. Estoque disponível: ${item.produtos.estoque}`
            })
        }

        const itemAtualizado = await prisma.carrinho.update({
            where: {
                id
            },
            data: {
                quantidade
            },
            include: {
                produtos: true
            }
        })

        res.json(itemAtualizado)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const usuariosId = Number(req.usuarios.id)

        const item = await prisma.carrinho.findFirst({
            where: {
                id,
                usuariosId
            }
        })

        if (!item) {
            return res.status(404).json({
                erro: "Item não encontrado no carrinho"
            })
        }

        await prisma.carrinho.delete({
            where: {
                id
            }
        })

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

router.delete("/", async (req, res, next) => {
    try {
        const usuariosId = Number(req.usuarios.id)

        await prisma.carrinho.deleteMany({
            where: {
                usuariosId
            }
        })

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

module.exports = router