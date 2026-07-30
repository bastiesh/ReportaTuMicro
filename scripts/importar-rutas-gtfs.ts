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

function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
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
      data.push(obj);
    }
  }
  
  return data;
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

  // Parse routes
  const routesPath = path.join(EXTRACT_DIR, "routes.txt");
  if (!fs.existsSync(routesPath)) {
    console.error("❌ No se encontró routes.txt en el GTFS");
    process.exit(1);
  }

  console.log("🔍 Parseando routes.txt...");
  const routes = parseCSV(routesPath);
  console.log(`📊 ${routes.length} rutas encontradas`);

  // Parse trips
  const tripsPath = path.join(EXTRACT_DIR, "trips.txt");
  if (!fs.existsSync(tripsPath)) {
    console.error("❌ No se encontró trips.txt en el GTFS");
    process.exit(1);
  }

  console.log("🔍 Parseando trips.txt...");
  const trips = parseCSV(tripsPath);
  console.log(`📊 ${trips.length} viajes encontrados`);

  // Parse stop_times
  const stopTimesPath = path.join(EXTRACT_DIR, "stop_times.txt");
  if (!fs.existsSync(stopTimesPath)) {
    console.error("❌ No se encontró stop_times.txt en el GTFS");
    process.exit(1);
  }

  console.log("🔍 Parseando stop_times.txt...");
  const stopTimes = parseCSV(stopTimesPath);
  console.log(`📊 ${stopTimes.length} tiempos de parada encontrados`);

  // Get existing paraderos
  console.log("📝 Obteniendo paraderos existentes...");
  const paraderos = await prisma.paradero.findMany({
    select: { id: true, gtfsStopId: true }
  });
  const paraderoMap = new Map(paraderos.map(p => [p.gtfsStopId, p.id]));
  console.log(`📊 ${paraderos.length} paraderos en base de datos`);

  // Create route map
  const routeMap = new Map(routes.map(r => [r.route_id, r]));

  // Create trip map
  const tripMap = new Map(trips.map(t => [t.trip_id, t]));

  // Build paradero-routes mapping
  console.log("🔗 Construyendo mapeo paradero-rutas...");
  const paraderoRoutes = new Map<string, Set<string>>();

  for (const st of stopTimes) {
    const paraderoId = paraderoMap.get(st.stop_id);
    if (!paraderoId) continue;

    const trip = tripMap.get(st.trip_id);
    if (!trip) continue;

    const route = routeMap.get(trip.route_id);
    if (!route) continue;

    if (!paraderoRoutes.has(paraderoId)) {
      paraderoRoutes.set(paraderoId, new Set());
    }
    paraderoRoutes.get(paraderoId)!.add(route.route_id);
  }

  console.log(`📊 ${paraderoRoutes.size} paraderos con rutas asignadas`);

  // Update paraderos with route info (we'll store as JSON in a new field or use a separate approach)
  // For now, let's create a JSON file with the mapping
  const mapping: Record<string, string[]> = {};
  paraderoRoutes.forEach((routes, paraderoId) => {
    mapping[paraderoId] = Array.from(routes);
  });

  const outputPath = path.join(process.cwd(), "paradero-routes.json");
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`✅ Mapeo guardado en ${outputPath}`);

  // Cleanup
  fs.unlinkSync(ZIP_PATH);
  fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  console.log("🧹 Archivos temporales eliminados");

  console.log("\n📋 Resumen:");
  console.log(`   - Rutas: ${routes.length}`);
  console.log(`   - Viajes: ${trips.length}`);
  console.log(`   - Tiempos de parada: ${stopTimes.length}`);
  console.log(`   - Paraderos con rutas: ${paraderoRoutes.size}`);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
