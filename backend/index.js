require('dotenv').config()

const express = require('express')

const db = require ('./database')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use((req, res, next) => {
  const horario = new Date().toLocaleTimeString('pt-BR')
  req.horario = horario

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${horario}] ${req.method} ${req.path}`)
  }

  next()
})

const produtosRoutes = require('./routes/produtos')
const categoriasRoutes = require('./routes/categorias')
const informacoesRoutes = require('./routes/informacoes')

app.use('/produtos', produtosRoutes)
app.use('/', categoriasRoutes)
app.use('/', informacoesRoutes)

app.get('/', (req, res) => {
  res.json({
    projeto: 'Loja Ecommerce Online',
    status: 'online'
  })
})

app.get('/saude', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada'
  })
})

app.use((err, req, res, next) => {
  console.error(`[ERRO] ${err.message}`)

  const status = err.status || 500
  const mensagem = err.message || 'Erro interno do servidor'

  res.status(status).json({ erro: mensagem })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})