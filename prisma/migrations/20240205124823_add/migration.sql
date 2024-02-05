/*
  Warnings:

  - Added the required column `widget_configuration` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "widget_configuration" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Layout_user_id_idx" ON "Layout"("user_id");

-- CreateIndex
CREATE INDEX "User_email_address_idx" ON "User"("email", "address");

-- CreateIndex
CREATE INDEX "Widget_widget_id_idx" ON "Widget"("widget_id");
