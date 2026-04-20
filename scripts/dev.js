const http = require("http");
const path = require("path");
const static = require("node-static");
const fs = require("fs-extra");

const mri = require("mri");

const render = require("./utils").render;
const spPath = require("./utils").spPath;
const assets = require("./assets");

const args = mri(process.argv.slice(2));

const host = (args.hasOwnProperty("host")) ? args.host : "";
const port = (args.hasOwnProperty("port")) ? args.port : 8080;
const assetVersion = Date.now().toString();
const cssAssets = assets.css.map(asset => `${asset}?v=${assetVersion}`);
const jsAssets = assets.js.map(asset => `${asset}?v=${assetVersion}`);
const reportsDir = path.join(process.cwd(), "reports", "deadwood-runs");

const fileServer = new static.Server(".");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function safeReportFileName(runId) {
    return String(runId || `deadwood-run-${Date.now()}`)
        .replace(/[^a-zA-Z0-9._-]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/api/deadwood/reports") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const report = JSON.parse(body || "{}");
                const fileName = `${safeReportFileName(report.runId)}.json`;
                const filePath = path.join(reportsDir, fileName);
                const relativeFilePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
                const reportToSave = {
                    ...report,
                    persistence: {
                        ...(report.persistence || {}),
                        attempted: true,
                        saved: true,
                        filePath: relativeFilePath,
                        error: null,
                    },
                };

                await fs.ensureDir(reportsDir);
                await fs.writeJson(filePath, reportToSave, { spaces: 2 });

                sendJson(res, 200, {
                    ok: true,
                    filePath: relativeFilePath,
                });
            } catch (error) {
                sendJson(res, 500, {
                    ok: false,
                    error: error instanceof Error ? error.message : "FAILED TO WRITE REPORT",
                });
            }
        });

        req.on("error", error => {
            sendJson(res, 500, {
                ok: false,
                error: error instanceof Error ? error.message : "REQUEST ERROR",
            });
        });

        return;
    }

    let filePath = spPath(req.url, assets.dev);

    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(render(assets.html, cssAssets, jsAssets));
        res.end();
    } else if (filePath.length !== 0) {
        fileServer.serveFile(filePath, 200, {}, req, res);
    } else {
        req.addListener("end", () => {
            fileServer.serve(req, res);
        }).resume();
    }
}).listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
