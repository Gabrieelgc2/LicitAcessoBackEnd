-- AlterTable: add cnpj and senhaHash to User (nullable — Google users won't have them)
ALTER TABLE "User" ADD COLUMN "cnpj" TEXT;
ALTER TABLE "User" ADD COLUMN "senhaHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");
