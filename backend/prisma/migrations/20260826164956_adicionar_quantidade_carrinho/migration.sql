-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carrinho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuariosId" INTEGER NOT NULL,
    "produtosId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Carrinho_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carrinho_produtosId_fkey" FOREIGN KEY ("produtosId") REFERENCES "Produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Carrinho" ("id", "produtosId", "usuariosId") SELECT "id", "produtosId", "usuariosId" FROM "Carrinho";
DROP TABLE "Carrinho";
ALTER TABLE "new_Carrinho" RENAME TO "Carrinho";
CREATE UNIQUE INDEX "Carrinho_usuariosId_produtosId_key" ON "Carrinho"("usuariosId", "produtosId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
