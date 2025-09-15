/*
  Warnings:

  - You are about to drop the column `is_allow_patient_app` on the `company_mst` table. All the data in the column will be lost.
  - You are about to drop the column `is_mutli_branch` on the `company_mst` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `company_mst` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_end` on the `company_mst` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_start` on the `company_mst` table. All the data in the column will be lost.
  - You are about to drop the column `entry_by` on the `plan_module_dtl` table. All the data in the column will be lost.
  - You are about to drop the column `entry_dt` on the `plan_module_dtl` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `plan_module_dtl` table. All the data in the column will be lost.
  - You are about to drop the column `update_dt` on the `plan_module_dtl` table. All the data in the column will be lost.
  - Added the required column `description` to the `plan_mst` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."app_module_mst" ADD COLUMN     "description" VARCHAR(150),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "entry_dt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."branch_mst" ALTER COLUMN "entry_dt" DROP DEFAULT,
ALTER COLUMN "update_dt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."company_mst" DROP COLUMN "is_allow_patient_app",
DROP COLUMN "is_mutli_branch",
DROP COLUMN "plan_id",
DROP COLUMN "subscription_end",
DROP COLUMN "subscription_start",
ALTER COLUMN "entry_dt" DROP DEFAULT,
ALTER COLUMN "update_dt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."department_mst" ALTER COLUMN "entry_dt" DROP DEFAULT,
ALTER COLUMN "update_dt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."plan_module_dtl" DROP COLUMN "entry_by",
DROP COLUMN "entry_dt",
DROP COLUMN "update_by",
DROP COLUMN "update_dt";

-- AlterTable
ALTER TABLE "public"."plan_mst" ADD COLUMN     "description" VARCHAR(300) NOT NULL,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "entry_dt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."staff_mst" ALTER COLUMN "entry_dt" DROP DEFAULT,
ALTER COLUMN "update_dt" DROP DEFAULT;
