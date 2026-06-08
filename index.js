const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('<h1>Bem-vindo à Loja Online!</h1>')
})

app.get('/informacoes', (req, res) => {
    res.json({
        projeto: 'Loja Ecommerce Online',
        descricao: 'Aplicação Backend para o meu projeto de ecommerce',
        status: 'online'
    })
})

app.get('/produtos', (req, res) => {
    res.json([
        { id: 1, nome: 'Notebook', categoria: 'Periféricos', preco: 3500.00 },
        { id: 2, nome: 'Mouse Gamer', categoria: 'Periféricos', preco: 150.00 },
        { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos', preco: 280.00 }
    ])
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