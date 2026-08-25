require("dotenv").config()

const prisma = require("../lib/prisma")

async function main() {

  console.log("Iniciando cadastro...")


  // ==========================================
  // CATEGORIAS
  // ==========================================

  console.log("Cadastrando categorias...")


  const categoriaRoupas =
    await prisma.categorias.create({
      data: {
        nome: "Roupas"
      }
    })


  const categoriaCamisas =
    await prisma.categorias.create({
      data: {
        nome: "Camisas"
      }
    })


  const categoriaFutebol =
    await prisma.categorias.create({
      data: {
        nome: "Futebol"
      }
    })


  console.log("Categorias cadastradas!")


  // ==========================================
  // PRODUTOS
  // ==========================================

  console.log("Cadastrando produtos...")


  await prisma.produtos.create({
    data: {

      nome: "Camisa Santos FC",

      clube: "Santos FC",

      pais: "Brasil",

      liga: "Brasileirão",

      continente: "América do Sul",

      temporada: "2024/25",

      tipo: "Camisa",

      marca: "Umbro",

      cor: "Branco",

      descricao:
        "Camisa oficial do Santos FC.",

      preco: 299.90,

      precoOriginal: 349.90,

      imagem:
        "https://via.placeholder.com/500x500?text=Santos+FC",

      estoque: 20,

      destaque: true,

      novo: true,

      categoriasId:
        categoriaCamisas.id

    }
  })


  await prisma.produtos.create({
    data: {

      nome: "Camisa Flamengo",

      clube: "Flamengo",

      pais: "Brasil",

      liga: "Brasileirão",

      continente: "América do Sul",

      temporada: "2024/25",

      tipo: "Camisa",

      marca: "Adidas",

      cor: "Vermelho e Preto",

      descricao:
        "Camisa oficial do Flamengo.",

      preco: 299.90,

      precoOriginal: 349.90,

      imagem:
        "https://via.placeholder.com/500x500?text=Flamengo",

      estoque: 15,

      destaque: true,

      novo: true,

      categoriasId:
        categoriaCamisas.id

    }
  })


  await prisma.produtos.create({
    data: {

      nome: "Camisa Palmeiras",

      clube: "Palmeiras",

      pais: "Brasil",

      liga: "Brasileirão",

      continente: "América do Sul",

      temporada: "2024/25",

      tipo: "Camisa",

      marca: "Puma",

      cor: "Verde",

      descricao:
        "Camisa oficial do Palmeiras.",

      preco: 289.90,

      precoOriginal: 329.90,

      imagem:
        "https://via.placeholder.com/500x500?text=Palmeiras",

      estoque: 18,

      destaque: true,

      novo: false,

      categoriasId:
        categoriaCamisas.id

    }
  })


  await prisma.produtos.create({
    data: {

      nome: "Camisa Corinthians",

      clube: "Corinthians",

      pais: "Brasil",

      liga: "Brasileirão",

      continente: "América do Sul",

      temporada: "2024/25",

      tipo: "Camisa",

      marca: "Nike",

      cor: "Preto e Branco",

      descricao:
        "Camisa oficial do Corinthians.",

      preco: 289.90,

      precoOriginal: 329.90,

      imagem:
        "https://via.placeholder.com/500x500?text=Corinthians",

      estoque: 12,

      destaque: true,

      novo: false,

      categoriasId:
        categoriaCamisas.id

    }
  })


  await prisma.produtos.create({
    data: {

      nome: "Camisa Seleção Brasileira",

      clube: "Seleção Brasileira",

      pais: "Brasil",

      liga: "Seleções",

      continente: "América do Sul",

      temporada: "2024/25",

      tipo: "Camisa",

      marca: "Nike",

      cor: "Amarelo",

      descricao:
        "Camisa oficial da Seleção Brasileira.",

      preco: 349.90,

      precoOriginal: 399.90,

      imagem:
        "https://via.placeholder.com/500x500?text=Brasil",

      estoque: 25,

      destaque: true,

      novo: true,

      categoriasId:
        categoriaCamisas.id

    }
  })


  console.log("Produtos cadastrados!")

  console.log("")
  console.log("================================")
  console.log("SEED EXECUTADO COM SUCESSO!")
  console.log("================================")

}


main()

  .catch((error) => {

    console.error(
      "Erro ao cadastrar:"
    )

    console.error(error)

    process.exit(1)

  })

  .finally(async () => {

    await prisma.$disconnect()

  })