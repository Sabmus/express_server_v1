/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetToken]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_passwordResetToken_key" ON "PasswordReset"("passwordResetToken");
