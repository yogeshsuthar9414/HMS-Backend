/*
  Warnings:

  - You are about to drop the column `login_id` on the `staff_mst` table. All the data in the column will be lost.
  - You are about to drop the `login_mst` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_nm]` on the table `staff_mst` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email_id` to the `staff_mst` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile_no` to the `staff_mst` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `staff_mst` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `staff_mst` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_nm` to the `staff_mst` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "staff_mst" DROP CONSTRAINT "fk_staff_login";

-- AlterTable
ALTER TABLE "staff_mst" DROP COLUMN "login_id",
ADD COLUMN     "email_id" VARCHAR(100) NOT NULL,
ADD COLUMN     "gauth_key" VARCHAR(80),
ADD COLUMN     "gauth_qr" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_auth_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_lock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_login_access" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_temp_pass" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login_tm" TIMESTAMP(3),
ADD COLUMN     "last_pass_chng" TIMESTAMP(3),
ADD COLUMN     "lock_tm" TIMESTAMP(3),
ADD COLUMN     "login_atmp" INTEGER DEFAULT 0,
ADD COLUMN     "mobile_no" VARCHAR(10) NOT NULL,
ADD COLUMN     "otp_atmp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_cd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_resend_atmp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_tm" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "staff_role" NOT NULL,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "temp_gauth_key" VARCHAR(80),
ADD COLUMN     "temp_pass" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "two_fac_type" "two_fac_type" NOT NULL DEFAULT 'null',
ADD COLUMN     "user_nm" VARCHAR(30) NOT NULL;

-- DropTable
DROP TABLE "login_mst";

-- CreateIndex
CREATE UNIQUE INDEX "staff_mst_user_nm_key" ON "staff_mst"("user_nm");
