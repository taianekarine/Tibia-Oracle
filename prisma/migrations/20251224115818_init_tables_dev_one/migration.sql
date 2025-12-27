-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "world" TEXT,
    "vocation" TEXT,
    "level" INTEGER,
    "experience" BIGINT,
    "residence" TEXT,
    "sex" TEXT,
    "accountStatus" TEXT,
    "achievementPoints" INTEGER,
    "guild" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyProgress" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weeklyTasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "bountyPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HuntSession" (
    "id" SERIAL NOT NULL,
    "characterId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "sessionStart" TIMESTAMP(3) NOT NULL,
    "sessionEnd" TIMESTAMP(3) NOT NULL,
    "sessionLength" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "loot" INTEGER NOT NULL,
    "supplies" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "damagePerHour" INTEGER NOT NULL,
    "healing" INTEGER NOT NULL,
    "healingPerHour" INTEGER NOT NULL,
    "rawXpGain" INTEGER NOT NULL,
    "rawXpPerHour" INTEGER NOT NULL,
    "xpGain" INTEGER NOT NULL,
    "xpPerHour" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HuntSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HuntKilledMonster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "huntSessionId" INTEGER NOT NULL,

    CONSTRAINT "HuntKilledMonster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HuntLootedItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "huntSessionId" INTEGER NOT NULL,

    CONSTRAINT "HuntLootedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyProgress_characterId_weekStart_key" ON "WeeklyProgress"("characterId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "HuntSession_characterId_sessionDate_key" ON "HuntSession"("characterId", "sessionDate");

-- CreateIndex
CREATE UNIQUE INDEX "HuntKilledMonster_huntSessionId_name_key" ON "HuntKilledMonster"("huntSessionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "HuntLootedItem_huntSessionId_name_key" ON "HuntLootedItem"("huntSessionId", "name");

-- AddForeignKey
ALTER TABLE "WeeklyProgress" ADD CONSTRAINT "WeeklyProgress_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HuntSession" ADD CONSTRAINT "HuntSession_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HuntKilledMonster" ADD CONSTRAINT "HuntKilledMonster_huntSessionId_fkey" FOREIGN KEY ("huntSessionId") REFERENCES "HuntSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HuntLootedItem" ADD CONSTRAINT "HuntLootedItem_huntSessionId_fkey" FOREIGN KEY ("huntSessionId") REFERENCES "HuntSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
