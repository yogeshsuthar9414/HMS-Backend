-- CreateEnum
CREATE TYPE "comp_type" AS ENUM ('P', 'G', 'T');

-- CreateEnum
CREATE TYPE "sms_method" AS ENUM ('POST', 'GET');

-- CreateEnum
CREATE TYPE "staff_role" AS ENUM ('SUP', 'ADM', 'MNG', 'RECP', 'DOC', 'NRS', 'LAB', 'PHR', 'ACC');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "two_fac_type" AS ENUM ('GAUTH', 'OTP', 'null');

-- CreateEnum
CREATE TYPE "plan_validate_type" AS ENUM ('D', 'M', 'Y');

-- CreateTable
CREATE TABLE "company_mst" (
    "id" SERIAL NOT NULL,
    "comp_cd" VARCHAR(6) NOT NULL,
    "comp_nm" VARCHAR(100) NOT NULL,
    "comp_type" "comp_type" NOT NULL,
    "domain" VARCHAR(100) NOT NULL,
    "govt_id" VARCHAR(20) NOT NULL,
    "mobile_no" VARCHAR(10) NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "address_1" VARCHAR(100) NOT NULL,
    "address_2" VARCHAR(100),
    "city" VARCHAR(30) NOT NULL,
    "state" VARCHAR(30) NOT NULL,
    "country" VARCHAR(30) NOT NULL,
    "pin_cd" VARCHAR(6) NOT NULL,
    "is_mutli_branch" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "two_fa" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "fav_icon" TEXT,
    "logo_width" INTEGER,
    "logo_height" INTEGER,
    "plan_id" INTEGER,
    "subscription_start" TIMESTAMP(3),
    "subscription_end" TIMESTAMP(3),
    "is_sms" BOOLEAN NOT NULL DEFAULT false,
    "sms_method" "sms_method",
    "sms_url" TEXT,
    "is_email" BOOLEAN NOT NULL DEFAULT false,
    "smtp_host" VARCHAR(100),
    "smtp_port" VARCHAR(4),
    "smtp_tls" VARCHAR(1),
    "smtp_usernm" VARCHAR(30),
    "smtp_password" TEXT,
    "smtp_from_email" VARCHAR(100),
    "is_allow_patient_app" BOOLEAN NOT NULL DEFAULT false,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_mst" (
    "id" SERIAL NOT NULL,
    "comp_id" INTEGER NOT NULL,
    "branch_cd" VARCHAR(20) NOT NULL,
    "branch_nm" VARCHAR(100) NOT NULL,
    "address" VARCHAR(100),
    "city" VARCHAR(30),
    "state" VARCHAR(30),
    "country" VARCHAR(30),
    "pin_cd" VARCHAR(6),
    "mobile_no" VARCHAR(10) NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "lat" DECIMAL(10,6),
    "long" DECIMAL(10,6),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branch_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_mst" (
    "id" SERIAL NOT NULL,
    "comp_id" INTEGER NOT NULL,
    "branch_id" INTEGER,
    "user_nm" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "staff_role" NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "mobile_no" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "login_atmp" INTEGER DEFAULT 0,
    "is_lock" BOOLEAN NOT NULL DEFAULT false,
    "lock_tm" TIMESTAMP(3),
    "two_fac_type" "two_fac_type" NOT NULL DEFAULT 'null',
    "is_auth_status" BOOLEAN NOT NULL DEFAULT false,
    "gauth_key" VARCHAR(80),
    "temp_gauth_key" VARCHAR(80),
    "gauth_qr" TEXT,
    "otp_cd" INTEGER NOT NULL DEFAULT 0,
    "otp_atmp" INTEGER NOT NULL DEFAULT 0,
    "otp_resend_atmp" INTEGER NOT NULL DEFAULT 0,
    "otp_tm" TIMESTAMP(3),
    "sessionId" TEXT,
    "is_temp_pass" BOOLEAN NOT NULL DEFAULT true,
    "last_pass_chng" TIMESTAMP(3),
    "last_login_tm" TIMESTAMP(3),
    "temp_pass" BOOLEAN NOT NULL DEFAULT true,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_mst" (
    "id" SERIAL NOT NULL,
    "comp_id" INTEGER NOT NULL,
    "branch_id" INTEGER,
    "login_id" INTEGER NOT NULL,
    "full_nm" VARCHAR(50) NOT NULL,
    "gender" "gender" NOT NULL,
    "dob" TIMESTAMP(3),
    "department" INTEGER NOT NULL,
    "join_dt" TIMESTAMP(3) NOT NULL,
    "profile_img" TEXT,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_mst" (
    "id" SERIAL NOT NULL,
    "comp_id" INTEGER NOT NULL,
    "depart_nm" VARCHAR(30) NOT NULL,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_mst" (
    "id" SERIAL NOT NULL,
    "plan_nm" VARCHAR(30) NOT NULL,
    "price" DECIMAL NOT NULL,
    "validate_type" "plan_validate_type" NOT NULL,
    "validate_for" INTEGER NOT NULL,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3),

    CONSTRAINT "plan_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_module_mst" (
    "id" SERIAL NOT NULL,
    "module_nm" VARCHAR(30) NOT NULL,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3),

    CONSTRAINT "app_module_mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_module_dtl" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "module_id" INTEGER NOT NULL,
    "entry_by" INTEGER,
    "entry_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_by" INTEGER,
    "update_dt" TIMESTAMP(3),

    CONSTRAINT "plan_module_dtl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_mst_comp_cd_domain_key" ON "company_mst"("comp_cd", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "branch_mst_branch_cd_key" ON "branch_mst"("branch_cd");

-- CreateIndex
CREATE UNIQUE INDEX "login_mst_user_nm_key" ON "login_mst"("user_nm");

-- CreateIndex
CREATE UNIQUE INDEX "department_mst_depart_nm_key" ON "department_mst"("depart_nm");

-- CreateIndex
CREATE UNIQUE INDEX "plan_mst_plan_nm_key" ON "plan_mst"("plan_nm");

-- CreateIndex
CREATE UNIQUE INDEX "app_module_mst_module_nm_key" ON "app_module_mst"("module_nm");

-- AddForeignKey
ALTER TABLE "branch_mst" ADD CONSTRAINT "fk_comp_branch" FOREIGN KEY ("comp_id") REFERENCES "company_mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_mst" ADD CONSTRAINT "fk_comp_staff" FOREIGN KEY ("comp_id") REFERENCES "company_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_mst" ADD CONSTRAINT "fk_staff_login" FOREIGN KEY ("login_id") REFERENCES "login_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_mst" ADD CONSTRAINT "fk_comp_department_staff" FOREIGN KEY ("department") REFERENCES "department_mst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_mst" ADD CONSTRAINT "fk_comp_department" FOREIGN KEY ("comp_id") REFERENCES "company_mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_module_dtl" ADD CONSTRAINT "fk_plan_module" FOREIGN KEY ("module_id") REFERENCES "app_module_mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_module_dtl" ADD CONSTRAINT "fk_plan" FOREIGN KEY ("plan_id") REFERENCES "plan_mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;
