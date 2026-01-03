/*
  Warnings:

  - You are about to drop the column `completed` on the `CharacterBestiaryOverride` table. All the data in the column will be lost.
  - Added the required column `manualKills` to the `CharacterBestiaryOverride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterBestiaryOverride" DROP COLUMN "completed",
ADD COLUMN     "manualKills" INTEGER NOT NULL;
