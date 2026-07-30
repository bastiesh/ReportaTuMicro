import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const GTFS_URL = "https://www.dtpm.cl/descargas/gtfs/GTFS_20260418.zip";
const ZIP_PATH = path.join(process.cwd(), "gtfs.zip");
const EXTRACT_DIR = path.join(process.cwd(), "gtfs_extracted");

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const https = require("https");
    https.get(url, (response: any) => {
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

  // Build route info map
  const routeMap: Record<string, any> = {};
  for (const route of routes) {
    routeMap[route.route_id] = {
      id: route.route_id,
      shortName: route.route_short_name || route.route_id,
      longName: route.route_long_name || route.route_short_name || route.route_id,
      color: route.route_color || "#3b82f6",
      textColor: route.route_text_color || "#FFFFFF",
      tipo: route.route_type || "bus"
    };
  }

  const outputPath = path.join(process.cwd(), "routes-info.json");
  fs.writeFileSync(outputPath, JSON.stringify(routeMap, null, 2));
  console.log(`✅ Información de rutas guardada en ${outputPath}`);

  // Cleanup
  fs.unlinkSync(ZIP_PATH);
  fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  console.log("🧹 Archivos temporales eliminados");
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
