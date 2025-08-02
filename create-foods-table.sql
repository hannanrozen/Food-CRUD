-- SQL Script untuk membuat tabel foods di Supabase
-- Jalankan script ini di Supabase SQL Editor

-- 1. Buat enum FoodType
CREATE TYPE "FoodType" AS ENUM ('uph', 'fresh');

-- 2. Buat tabel foods
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "FoodType" NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- 3. Buat trigger untuk auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_foods_updated_at 
    BEFORE UPDATE ON "foods" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Insert beberapa data sample untuk testing
INSERT INTO "foods" ("id", "name", "ingredients", "description", "type", "imageUrl") VALUES
('cm4g5h6j7k8l9m0n1', 'Nasi Goreng Spesial', 'Nasi, telur, kecap, bawang merah, cabai', 'Nasi goreng dengan telur mata sapi dan kerupuk', 'fresh', NULL),
('cm4g5h6j7k8l9m0n2', 'Mie Ayam Bakso', 'Mie, ayam, bakso, sayuran, kuah kaldu', 'Mie ayam dengan bakso dan sayuran segar', 'uph', NULL),
('cm4g5h6j7k8l9m0n3', 'Gado-Gado Jakarta', 'Sayuran, tahu, tempe, telur, bumbu kacang', 'Salad Indonesia dengan saus kacang khas Jakarta', 'fresh', NULL);

-- 5. Verifikasi data berhasil dibuat
SELECT * FROM "foods" ORDER BY "createdAt" DESC;
