const express = require("express")
const router = express.Router()
const prisma = require("../lib/prisma")

router.get("/", async (req, res, next) => {
  try {
    console.log("=================================")
    console.log("GET /produtos")
    console.log("Buscando produtos no banco...")

    const produtos = await prisma.produtos.findMany({
      orderBy: {
        id: "desc"
      }
    })

    console.log("Produtos encontrados:")
    console.log(produtos)

    console.log("Quantidade:", produtos.length)
    console.log("=================================")

    res.json(produtos)

  } catch (err) {
    console.error("ERRO AO BUSCAR PRODUTOS:")
    console.error(err)

    next(err)
  }
})

router.get("/destaques", async (req, res, next) => {
  try {
    const produtos = await prisma.produtos.findMany({
      where: {
        destaque: true
      },
      take: 4,
      orderBy: {
        id: "desc"
      }
    })

    res.json(produtos)

  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = await prisma.produtos.findUnique({
      where: {
        id
      }
    })

    if (!produto) {
      const err = new Error("Produto não encontrado")
      err.status = 404
      throw err
    }

    res.json(produto)

  } catch (err) {
    next(err)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const {
      nome,
      clube,
      pais,
      liga,
      continente,
      temporada,
      tipo,
      marca,
      cor,
      descricao,
      preco,
      precoOriginal,
      imagem,
      estoque,
      destaque,
      novo,
      categoriasId
    } = req.body

    if (
      !nome ||
      !clube ||
      !pais ||
      !liga ||
      !continente ||
      !temporada ||
      !tipo ||
      !marca ||
      !cor ||
      !descricao ||
      preco === undefined ||
      precoOriginal === undefined ||
      estoque === undefined ||
      !categoriasId
    ) {
      const err = new Error(
        "Todos os campos obrigatórios devem ser preenchidos"
      )

      err.status = 400
      throw err
    }

    const categoria = await prisma.categorias.findUnique({
      where: {
        id: Number(categoriasId)
      }
    })

    if (!categoria) {
      const err = new Error("Categoria não encontrada")
      err.status = 404
      throw err
    }

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        clube,
        pais,
        liga,
        continente,
        temporada,
        tipo,
        marca,
        cor,
        descricao,
        preco: Number(preco),
        precoOriginal: Number(precoOriginal),
        imagem: imagem || "",
        estoque: Number(estoque),
        destaque: destaque ?? false,
        novo: novo ?? false,
        categoriasId: Number(categoriasId)
      }
    })

    console.log("Produto criado:")
    console.log(novoProduto)

    res.status(201).json(novoProduto)

  } catch (err) {
    next(err)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = await prisma.produtos.findUnique({
      where: {
        id
      }
    })

    if (!produto) {
      const err = new Error("Produto não encontrado")
      err.status = 404
      throw err
    }

    const {
      nome,
      clube,
      pais,
      liga,
      continente,
      temporada,
      tipo,
      marca,
      cor,
      descricao,
      preco,
      precoOriginal,
      imagem,
      estoque,
      destaque,
      novo,
      categoriasId
    } = req.body

    const produtoAtualizado = await prisma.produtos.update({
      where: {
        id
      },
      data: {
        ...(nome !== undefined && { nome }),
        ...(clube !== undefined && { clube }),
        ...(pais !== undefined && { pais }),
        ...(liga !== undefined && { liga }),
        ...(continente !== undefined && { continente }),
        ...(temporada !== undefined && { temporada }),
        ...(tipo !== undefined && { tipo }),
        ...(marca !== undefined && { marca }),
        ...(cor !== undefined && { cor }),
        ...(descricao !== undefined && { descricao }),
        ...(preco !== undefined && {
          preco: Number(preco)
        }),
        ...(precoOriginal !== undefined && {
          precoOriginal: Number(precoOriginal)
        }),
        ...(imagem !== undefined && { imagem }),
        ...(estoque !== undefined && {
          estoque: Number(estoque)
        }),
        ...(destaque !== undefined && {
          destaque
        }),
        ...(novo !== undefined && {
          novo
        }),
        ...(categoriasId !== undefined && {
          categoriasId: Number(categoriasId)
        })
      }
    })

    res.json(produtoAtualizado)

  } catch (err) {
    next(err)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = await prisma.produtos.findUnique({
      where: {
        id
      }
    })

    if (!produto) {
      const err = new Error("Produto não encontrado")
      err.status = 404
      throw err
    }

    await prisma.produtos.delete({
      where: {
        id
      }
    })

    res.status(204).send()

  } catch (err) {
    next(err)
  }
})

module.exports = router