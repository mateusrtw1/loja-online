const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const router = express.Router();
const prisma = require("../lib/prisma");

router.post("/register", async (req, res, next) => {
  try {
    console.log("=== REGISTER ===");
    console.log("BODY RECEBIDO:", req.body);

    const {
      nome,
      senha,
      email,
      telefone,
      cpf
    } = req.body;

    console.log("nome:", nome);
    console.log("email:", email);
    console.log("cpf:", cpf);
    console.log("telefone:", telefone);
    console.log("senha existe:", !!senha);

    if (!nome || !senha || !email || !cpf) {
      return res.status(400).json({
        erro: "Nome, e-mail, CPF e senha são obrigatórios"
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
        telefone: telefone || null,
        cpf: cpf || null
      }
    });

    console.log("USUÁRIO CRIADO:", usuarioCriado.id);

    return res.status(201).json({
      id: usuarioCriado.id,
      nome: usuarioCriado.nome,
      email: usuarioCriado.email,
      telefone: usuarioCriado.telefone,
      cpf: usuarioCriado.cpf
    });

  } catch (err) {
    console.error("=== ERRO NO CADASTRO ===");
    console.error(err);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log("=== LOGIN ===");
    console.log("BODY RECEBIDO:", req.body);

    const {
      email,
      senha
    } = req.body;

    console.log("email:", email);
    console.log("senha existe:", !!senha);

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios"
      });
    }

    const usuario = await prisma.usuarios.findFirst({
      where: {
        email
      }
    });

    console.log(usuario)

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

    console.log("LOGIN REALIZADO:", usuario.email);

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
    console.error("=== ERRO NO LOGIN ===");
    console.error(err);
    next(err);
  }
});

module.exports = router;