-- CreateEnum
CREATE TYPE "Color" AS ENUM ('white', 'black');

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lichess_user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "openings" (
    "id" UUID NOT NULL,
    "eco" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pgn" TEXT NOT NULL,
    "uci" TEXT NOT NULL,

    CONSTRAINT "openings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repertoires" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Color" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repertoires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repertoire_lines" (
    "id" UUID NOT NULL,
    "repertoire_id" UUID NOT NULL,
    "moves" TEXT[],
    "uci" TEXT NOT NULL,
    "opening_id" UUID,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repertoire_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "openings_uci_key" ON "openings"("uci");

-- CreateIndex
CREATE INDEX "openings_eco_idx" ON "openings"("eco");

-- CreateIndex
CREATE UNIQUE INDEX "repertoires_student_id_name_key" ON "repertoires"("student_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "repertoire_lines_repertoire_id_uci_key" ON "repertoire_lines"("repertoire_id", "uci");

-- AddForeignKey
ALTER TABLE "repertoires" ADD CONSTRAINT "repertoires_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repertoire_lines" ADD CONSTRAINT "repertoire_lines_repertoire_id_fkey" FOREIGN KEY ("repertoire_id") REFERENCES "repertoires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repertoire_lines" ADD CONSTRAINT "repertoire_lines_opening_id_fkey" FOREIGN KEY ("opening_id") REFERENCES "openings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
