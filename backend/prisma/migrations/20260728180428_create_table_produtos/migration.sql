-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Informacoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "horario" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    CONSTRAINT "Pedidos_usuarioId_fkey"
        FOREIGN KEY ("usuarioId") REFERENCES "Usuarios" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pedidos_produtoId_fkey"
        FOREIGN KEY ("produtoId") REFERENCES "Produtos" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);
