import { PrismaClient } from "@prisma/client";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();

const GTFS_URL = "https://www.dtpm.cl/descargas/gtfs/GTFS_20260418.zip";
const ZIP_PATH = path.join(process.cwd(), "gtfs.zip");
const EXTRACT_DIR = path.join(process.cwd(), "gtfs_extracted");

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function extractZip(zipPath: string, dest: string): Promise<void> {
  try {
    execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${dest}' -Force"`, { stdio: "inherit" });
  } catch (error) {
    throw new Error(`Failed to extract zip: ${error}`);
  }
}

function parseStopsTxt(filePath: string): any[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const stops: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with quoted fields
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    
    if (values.length === headers.length) {
      const obj: any = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx]?.replace(/"/g, "") || "";
      });
      stops.push(obj);
    }
  }
  
  return stops;
}

async function main() {
  console.log("📥 Descargando GTFS desde DTPM...");
  await downloadFile(GTFS_URL, ZIP_PATH);
  console.log("✅ GTFS descargado");

  console.log("📦 Extrayendo archivo...");
  if (fs.existsSync(EXTRACT_DIR)) {
    fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(EXTRACT_DIR, { recursive: true });
  await extractZip(ZIP_PATH, EXTRACT_DIR);
  console.log("✅ Extraído");

  const stopsPath = path.join(EXTRACT_DIR, "stops.txt");
  if (!fs.existsSync(stopsPath)) {
    console.error("❌ No se encontró stops.txt en el GTFS");
    process.exit(1);
  }

  console.log("🔍 Parseando stops.txt...");
  const stops = parseStopsTxt(stopsPath);
  console.log(`📊 ${stops.length} paraderos encontrados`);

  console.log("🗑️ Limpiando paraderos existentes...");
  await prisma.paradero.deleteMany();

  console.log("💾 Importando paraderos...");
  let imported = 0;
  const batchSize = 100;
  
  for (let i = 0; i < stops.length; i += batchSize) {
    const batch = stops.slice(i, i + batchSize);
    const data = batch.map(stop => ({
      gtfsStopId: stop.stop_id || stop.stop_code || `stop_${i}`,
      nombre: stop.stop_name || "Sin nombre",
      lat: parseFloat(stop.stop_lat) || 0,
      lng: parseFloat(stop.stop_lon) || 0,
      comuna: stop.zone || "Santiago",
    })).filter(p => p.lat !== 0 && p.lng !== 0);
    
    if (data.length > 0) {
      await prisma.paradero.createMany({ data });
      imported += data.length;
    }
    
    if ((i / batchSize) % 10 === 0) {
      console.log(`   Progreso: ${imported}/${stops.length}`);
    }
  }

  console.log(`✅ ${imported} paraderos importados exitosamente`);

  // Cleanup
  fs.unlinkSync(ZIP_PATH);
  fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  console.log("🧹 Archivos temporales eliminados");
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
