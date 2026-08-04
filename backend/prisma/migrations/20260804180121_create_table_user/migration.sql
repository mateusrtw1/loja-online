/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `produtoId` on the `Pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Pedidos` table. All the data in the column will be lost.
  - Added the required column `status` to the `Pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuariosId` to the `Pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriasId` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clube` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `continente` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cor` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estoque` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagem` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liga` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marca` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precoOriginal` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temporada` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Categoria";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Categorias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cupons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "desconto" REAL NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Enderecos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuariosId" INTEGER NOT NULL,
    "cep" INTEGER NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    CONSTRAINT "Enderecos_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favoritos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuariosId" INTEGER NOT NULL,
    "produtosId" INTEGER NOT NULL,
    CONSTRAINT "Favoritos_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favoritos_produtosId_fkey" FOREIGN KEY ("produtosId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carrinho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuariosId" INTEGER NOT NULL,
    "produtosId" INTEGER NOT NULL,
    CONSTRAINT "Carrinho_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carrinho_produtosId_fkey" FOREIGN KEY ("produtosId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itensPedidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidosId" INTEGER NOT NULL,
    "produtosId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" REAL NOT NULL,
    CONSTRAINT "itensPedidos_pedidosId_fkey" FOREIGN KEY ("pedidosId") REFERENCES "Pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itensPedidos_produtosId_fkey" FOREIGN KEY ("produtosId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pagamentos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "pedidosId" INTEGER NOT NULL,
    "metodo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "datasPagamentos" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pagamentos_pedidosId_fkey" FOREIGN KEY ("pedidosId") REFERENCES "Pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fretes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidosId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "prazoDias" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Fretes_pedidosId_fkey" FOREIGN KEY ("pedidosId") REFERENCES "Pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pedidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuariosId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pedidos_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pedidos" ("id", "total") SELECT "id", "total" FROM "Pedidos";
DROP TABLE "Pedidos";
ALTER TABLE "new_Pedidos" RENAME TO "Pedidos";
CREATE TABLE "new_Produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "clube" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "liga" TEXT NOT NULL,
    "continente" TEXT NOT NULL,
    "temporada" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "precoOriginal" REAL NOT NULL,
    "imagem" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "novo" BOOLEAN NOT NULL DEFAULT false,
    "categoriasId" INTEGER NOT NULL,
    CONSTRAINT "Produtos_categoriasId_fkey" FOREIGN KEY ("categoriasId") REFERENCES "Categorias" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Produtos" ("id", "nome", "preco") SELECT "id", "nome", "preco" FROM "Produtos";
DROP TABLE "Produtos";
ALTER TABLE "new_Produtos" RENAME TO "Produtos";
CREATE TABLE "new_Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL
);
INSERT INTO "new_Usuarios" ("email", "id", "nome", "senha") SELECT "email", "id", "nome", "senha" FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Cupons_codigo_key" ON "Cupons"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamentos_pedidosId_key" ON "Pagamentos"("pedidosId");

-- CreateIndex
CREATE UNIQUE INDEX "Fretes_pedidosId_key" ON "Fretes"("pedidosId");
