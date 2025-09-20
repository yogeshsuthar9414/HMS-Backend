/*
  Warnings:

  - A unique constraint covering the columns `[mobile_no]` on the table `branch_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_id]` on the table `branch_mst` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "branch_mst_mobile_no_key" ON "public"."branch_mst"("mobile_no");

-- CreateIndex
CREATE UNIQUE INDEX "branch_mst_email_id_key" ON "public"."branch_mst"("email_id");
