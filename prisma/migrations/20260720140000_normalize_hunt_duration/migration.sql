DROP INDEX IF EXISTS "HuntSession_characterId_sessionDate_key";

ALTER TABLE "HuntSession"
RENAME COLUMN "sessionLength" TO "sessionLengthSeconds";

ALTER TABLE "HuntSession"
ALTER COLUMN "sessionLengthSeconds" TYPE INTEGER
USING (
  split_part("sessionLengthSeconds", ':', 1)::INTEGER * 3600
  + regexp_replace(split_part("sessionLengthSeconds", ':', 2), '[^0-9]', '', 'g')::INTEGER * 60
);

CREATE INDEX "HuntSession_characterId_sessionDate_idx"
ON "HuntSession"("characterId", "sessionDate");
