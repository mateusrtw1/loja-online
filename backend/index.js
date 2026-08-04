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
const usuariosRoutes = require('./routes/usuarios')
const pedidosRoutes = require('./routes/pedidos')
const cuponsRoutes = require('./routes/cupons')
const enderecosRoutes = require('./routes/enderecos')
const favoritosRoutes = require('./routes/favoritos')
const carrinhoRoutes = require("./routes/carrinho")
const pagamentosRoutes = require('./routes/pagamentos')
const fretesRoutes = require('./routes/fretes')
const authRoutes = require('./routes/auth')


app.use('/produtos', produtosRoutes)
app.use('/categorias', categoriasRoutes)
app.use('/informacoes', informacoesRoutes)
app.use('./usuarios', usuariosRoutes)
app.use('./pedidos', pedidosRoutes)
app.use('/cupons', cuponsRoutes)
app.use('./enderecos', enderecosRoutes)
app.use('/favoritos', favoritosRoutes)
app.use('/carrinho', carrinhoRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/fretes', fretesRoutes)
app.use('/auth', authRoutes)

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