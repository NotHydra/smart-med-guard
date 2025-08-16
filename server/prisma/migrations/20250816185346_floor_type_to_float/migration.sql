/*
  Warnings:

  - Changed the type of `floor` on the `iot_device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."iot_device" DROP COLUMN "floor",
ADD COLUMN     "floor" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "iot_device_agency_floor_room_key" ON "public"."iot_device"("agency", "floor", "room");
