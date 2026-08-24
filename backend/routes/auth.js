const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const router = express.Router();

const prisma = require("../lib/prisma");

router.post("/register", async (req, res, next) => {
  try {
    const {
      nome,
      senha,
      email,
      telefone,
      cpf
    } = req.body;

    if (!nome || !senha || !email) {
      return res.status(400).json({
        erro: "Nome, e-mail e senha são obrigatórios"
      });
    }

    const usuarioExistente = await prisma.usuarios.findUnique({
      where: {
        email
      }
    });

    if (usuarioExistente) {
      return res.status(409).json({
        erro: "E-mail já cadastrado"
      });
    }

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
        telefone,
        cpf
      }
    });

    return res.status(201).json({
      id: usuarioCriado.id,
      nome: usuarioCriado.nome,
      email: usuarioCriado.email,
      telefone: usuarioCriado.telefone,
      cpf: usuarioCriado.cpf
    });

  } catch (err) {
    console.error("Erro no cadastro:", err);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const {
      email,
      senha
    } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios"
      });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: {
        email
      }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    const senhaValida = await argon2.verify(
      usuario.senha,
      senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        erro: "JWT_SECRET não configurado no arquivo .env"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        cpf: usuario.cpf
      }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    next(err);
  }
});

module.exports = router;