const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use((req, res, next) => {
    const horario = new Date().toLocaleTimeString('pt-BR')

    res.on('finish', () => {
        console.log(
            `[${horario}] loja-ecommerce-online | ${req.method} ${req.path} | Status: ${res.statusCode}`
        )
    })

    req.horario = horario
    next()
})

app.get('/', (req, res) => {
    res.send('<h1>Bem-vindo à Loja Online!</h1>')
})

app.get('/informacoes', (req, res) => {
    res.json({
        projeto: 'Loja Ecommerce Online',
        descricao: 'Aplicação Backend para o meu projeto de ecommerce',
        status: 'online',
        horario: req.horario
    })
})

const produtos = [
        { id: 1, nome: 'Notebook', categoria: 'Periféricos', preco: 3500.00 },
        { id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 150.00 },
        { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 280.00 }
]

app.get('/produtos', (req, res) => {
    const { categoria } = req.query

    if (categoria) {
        const filtrados = produtos.filter(
            p => p.categoria.toLowerCase() === categoria.toLowerCase()
        )

        return res.json(filtrados)
    }
    
    res.json(produtos)
})

app.post('/produtos', (req, res) => {
    const { nome, categoria, preco } = req.body

    if(!nome || !categoria || preco === undefined) {
        return res.status(400).json({
            erro: 'nome, categoria e preco são obrigatórios'
        })
    }
  
    const novoProduto = {
      id: produtos.length + 1,
      nome,
      categoria,
      preco
    }
  
    produtos.push(novoProduto)
    res.status(201).json(novoProduto)
})

app.get('/produtos/:id', (req, res) => {
    const id = Number(req.params.id)

    const produto = produtos.find(p => p.id === id)

    if(!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado'})
    }

    res.json(produto)
})

app.put('/produtos/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if(index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' })
    }

    const { nome, categoria, preco } = req.body
    
    produtos[index] = { id, nome, categoria, preco }

    res.json(produtos[index])
})

app.patch('/produtos/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if(index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' })
    }

    produtos[index] = {
        ...produtos[index],
        ...req.body,
        id
    }

    res.json(produtos[index])
})

app.delete('/produtos/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' })
      }

      produtos.splice(index, 1)
      res.status(204).send()
})

app.get('/categorias', (req, res) => {
    res.json([
        { id: 1, nome: 'Informática' },
        { id: 2, nome: 'Periféricos' },
        { id: 3, nome: 'Acessórios' }
    ])
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})