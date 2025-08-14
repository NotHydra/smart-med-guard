-- CreateTable
CREATE TABLE "public"."iot_device" (
    "id" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iot_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."temperature_reading" (
    "id" TEXT NOT NULL,
    "iot_device_id" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temperature_reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."humidity_reading" (
    "id" TEXT NOT NULL,
    "iot_device_id" TEXT NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "humidity_reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."occupancy_reading" (
    "id" TEXT NOT NULL,
    "iot_device_id" TEXT NOT NULL,
    "occupancy" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occupancy_reading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "iot_device_agency_floor_room_key" ON "public"."iot_device"("agency", "floor", "room");

-- AddForeignKey
ALTER TABLE "public"."temperature_reading" ADD CONSTRAINT "temperature_reading_iot_device_id_fkey" FOREIGN KEY ("iot_device_id") REFERENCES "public"."iot_device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."humidity_reading" ADD CONSTRAINT "humidity_reading_iot_device_id_fkey" FOREIGN KEY ("iot_device_id") REFERENCES "public"."iot_device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."occupancy_reading" ADD CONSTRAINT "occupancy_reading_iot_device_id_fkey" FOREIGN KEY ("iot_device_id") REFERENCES "public"."iot_device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
