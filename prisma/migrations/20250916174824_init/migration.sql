/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `app_module_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `branch_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `company_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile_no]` on the table `company_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_id]` on the table `company_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `department_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `plan_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `staff_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_id]` on the table `staff_mst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile_no]` on the table `staff_mst` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "app_module_mst_id_key" ON "public"."app_module_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_mst_id_key" ON "public"."branch_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "company_mst_id_key" ON "public"."company_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "company_mst_mobile_no_key" ON "public"."company_mst"("mobile_no");

-- CreateIndex
CREATE UNIQUE INDEX "company_mst_email_id_key" ON "public"."company_mst"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_mst_id_key" ON "public"."department_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_mst_id_key" ON "public"."plan_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_mst_id_key" ON "public"."staff_mst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_mst_email_id_key" ON "public"."staff_mst"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_mst_mobile_no_key" ON "public"."staff_mst"("mobile_no");
