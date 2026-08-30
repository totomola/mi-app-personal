-- CreateTable
CREATE TABLE "RegistroPersonal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "emotions" TEXT,
    "description" TEXT,
    "note" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "RegistroPersonal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Herramienta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "steps" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UsoHerramienta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "herramientaId" INTEGER NOT NULL,
    "usedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "imageUrl" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "UsoHerramienta_herramientaId_fkey" FOREIGN KEY ("herramientaId") REFERENCES "Herramienta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsoHerramienta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
