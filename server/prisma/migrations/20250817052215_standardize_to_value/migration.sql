/*
  Warnings:

  - You are about to drop the column `humidity` on the `humidity_reading` table. All the data in the column will be lost.
  - You are about to drop the column `occupancy` on the `occupancy_reading` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `temperature_reading` table. All the data in the column will be lost.
  - Added the required column `value` to the `humidity_reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `occupancy_reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `temperature_reading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."humidity_reading" DROP COLUMN "humidity",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."occupancy_reading" DROP COLUMN "occupancy",
ADD COLUMN     "value" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "public"."temperature_reading" DROP COLUMN "temperature",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
