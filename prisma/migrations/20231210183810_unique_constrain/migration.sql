/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ConfirmationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationToken_token_key" ON "ConfirmationToken"("token");
