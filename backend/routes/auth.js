const express = require('express')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const router = express.Router()
const prisma = require('../lib/prisma')

router.post('/register', async (req, res, next) => {
    try {
        const { nome, senha, email, telefone } = req.body

        const senhaHash = await argon2.hash(senha, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });

        const usuarioCriado = await prisma.usuarios.create({
            data: {
                nome,
                senha: senhaHash,
                email,
                telefone
            }
        })

        res.status(201).json({
            id: usuarioCriado.id,
            nome: usuarioCriado.nome,
            email: usuarioCriado.email,
            telefone: usuarioCriado.telefone
        })
    } catch (err) {
        next (err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, senha } = req.body

        const usuarios = await prisma.usuarios.findUnique({
            where: { email }
        });

        if(!usuarios) {
            return res.status(401).json({ erro: 'Credenciais inválidas '});
        }

        const senhaValida = await argon2.verify(usuarios.senha, senha);

        if(!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: usuarios.id, email: usuarios.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (err) {
        next (err)
    }
});

module.exports = router