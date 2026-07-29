-- CreateTable
CREATE TABLE "paraderos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gtfs_stop_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "comuna" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paradero_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reportes_abuso" INTEGER NOT NULL DEFAULT 0,
    "oculta" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resenas_paradero_id_fkey" FOREIGN KEY ("paradero_id") REFERENCES "paraderos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "incidencias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "hora_inicio" DATETIME,
    "hora_fin" DATETIME,
    "expira_at" DATETIME NOT NULL,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "paraderos_gtfs_stop_id_key" ON "paraderos"("gtfs_stop_id");

-- CreateIndex
CREATE INDEX "paraderos_lat_lng_idx" ON "paraderos"("lat", "lng");

-- CreateIndex
CREATE INDEX "resenas_paradero_id_idx" ON "resenas"("paradero_id");

-- CreateIndex
CREATE INDEX "resenas_oculta_idx" ON "resenas"("oculta");

-- CreateIndex
CREATE INDEX "incidencias_expira_at_idx" ON "incidencias"("expira_at");

-- CreateIndex
CREATE INDEX "incidencias_lat_lng_idx" ON "incidencias"("lat", "lng");
