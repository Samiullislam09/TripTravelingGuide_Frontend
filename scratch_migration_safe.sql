
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'discovered',
ALTER COLUMN "primaryKeyword" SET NOT NULL,
ALTER COLUMN "contentHtml" SET NOT NULL,
ALTER COLUMN "contentHtml" SET DEFAULT '',
ALTER COLUMN "contentMarkdown" SET NOT NULL,
ALTER COLUMN "contentMarkdown" SET DEFAULT '',
ALTER COLUMN "wordCount" SET NOT NULL,
ALTER COLUMN "wordCount" SET DEFAULT 0,
ALTER COLUMN "wordCount" SET DATA TYPE INTEGER,
ALTER COLUMN "metaTitle" SET NOT NULL,
ALTER COLUMN "metaTitle" SET DEFAULT '',
ALTER COLUMN "metaDescription" SET NOT NULL,
ALTER COLUMN "metaDescription" SET DEFAULT '',
ALTER COLUMN "featuredImagePrompt" SET NOT NULL,
ALTER COLUMN "featuredImagePrompt" SET DEFAULT '',
ALTER COLUMN "comparisonType" SET NOT NULL,
ALTER COLUMN "tags" SET NOT NULL,
ALTER COLUMN "tags" SET DEFAULT '',
ALTER COLUMN "reasoning" SET NOT NULL,
ALTER COLUMN "reasoning" SET DEFAULT '',
ALTER COLUMN "titleAlternatives" SET NOT NULL,
ALTER COLUMN "titleAlternatives" SET DEFAULT '',
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'ai',
ALTER COLUMN "coverImageUrl" SET NOT NULL,
ALTER COLUMN "coverImageUrl" SET DEFAULT '',
ALTER COLUMN "coverImageAlt" SET NOT NULL,
ALTER COLUMN "coverImageAlt" SET DEFAULT '',
ALTER COLUMN "categoryName" SET NOT NULL,
ALTER COLUMN "categoryName" SET DEFAULT '',
ALTER COLUMN "categorySlug" SET NOT NULL,
ALTER COLUMN "categorySlug" SET DEFAULT '',
ALTER COLUMN "needsRewrite" SET NOT NULL,
ALTER COLUMN "needsRewrite" SET DEFAULT false,
ALTER COLUMN "qualityNote" SET NOT NULL,
ALTER COLUMN "qualityNote" SET DEFAULT '',
ALTER COLUMN "topicScore" SET NOT NULL,
ALTER COLUMN "topicScore" SET DEFAULT 0,
ALTER COLUMN "topicScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "searchVolumeLow" SET NOT NULL,
ALTER COLUMN "searchVolumeLow" SET DEFAULT 0,
ALTER COLUMN "searchVolumeLow" SET DATA TYPE INTEGER,
ALTER COLUMN "searchVolumeHigh" SET NOT NULL,
ALTER COLUMN "searchVolumeHigh" SET DEFAULT 0,
ALTER COLUMN "searchVolumeHigh" SET DATA TYPE INTEGER,
ALTER COLUMN "keywordDifficulty" SET NOT NULL,
ALTER COLUMN "keywordDifficulty" SET DEFAULT 0,
ALTER COLUMN "keywordDifficulty" SET DATA TYPE INTEGER,
ALTER COLUMN "trendDirection" SET NOT NULL,
ALTER COLUMN "trendDirection" SET DEFAULT 'flat',
ALTER COLUMN "intentLabel" SET NOT NULL,
ALTER COLUMN "intentLabel" SET DEFAULT '',
ALTER COLUMN "readabilityScore" SET NOT NULL,
ALTER COLUMN "readabilityScore" SET DEFAULT 0,
ALTER COLUMN "readabilityScore" SET DATA TYPE INTEGER,
ALTER COLUMN "duplicateScore" SET NOT NULL,
ALTER COLUMN "duplicateScore" SET DEFAULT 0,
ALTER COLUMN "duplicateScore" SET DATA TYPE INTEGER,
ALTER COLUMN "internalLinkCount" SET NOT NULL,
ALTER COLUMN "internalLinkCount" SET DEFAULT 0,
ALTER COLUMN "internalLinkCount" SET DATA TYPE INTEGER,
ALTER COLUMN "externalLinkCount" SET NOT NULL,
ALTER COLUMN "externalLinkCount" SET DEFAULT 0,
ALTER COLUMN "externalLinkCount" SET DATA TYPE INTEGER,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "approvedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "publishedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "thumbnailStatus" SET NOT NULL,
ALTER COLUMN "thumbnailStatus" SET DEFAULT 'none',
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET DEFAULT '';


-- CreateTable
CREATE TABLE "WebStory" (
    "id" TEXT NOT NULL,
    "articleId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL DEFAULT '',
    "slides" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "source" TEXT NOT NULL DEFAULT 'ai',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "WebStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordMetric" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "page" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeywordMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageMetric" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "HumanInputMarker" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "markerType" TEXT NOT NULL,
    "markerText" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanInputMarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalLink" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "targetArticleId" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL,

    CONSTRAINT "InternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "statusCheckPassed" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "avgPosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adsenseRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adsenseRpm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishSchedule" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "weeklyCapBucket" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebStory_slug_key" ON "WebStory"("slug");

-- CreateIndex
CREATE INDEX "KeywordMetric_query_idx" ON "KeywordMetric"("query");

-- CreateIndex
CREATE INDEX "KeywordMetric_date_idx" ON "KeywordMetric"("date");

-- CreateIndex
CREATE INDEX "PageMetric_page_idx" ON "PageMetric"("page");

-- CreateIndex
CREATE INDEX "PageMetric_date_idx" ON "PageMetric"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- AddForeignKey
ALTER TABLE "WebStory" ADD CONSTRAINT "WebStory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanInputMarker" ADD CONSTRAINT "HumanInputMarker_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalLink" ADD CONSTRAINT "InternalLink_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalLink" ADD CONSTRAINT "InternalLink_targetArticleId_fkey" FOREIGN KEY ("targetArticleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

