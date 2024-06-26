import * as api from "@tauri-apps/api";
import * as fs from "@tauri-apps/plugin-fs";
import * as os from "@tauri-apps/plugin-os";
import * as app from "@tauri-apps/api/app";
import * as path from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

export interface Path {
    name: string;
    path: string;
}

export async function ls(where: string) {
    const entries = await fs.readDir(where);
    const paths: Path[] = [];
    for (const entry of entries) {
        const abs = await path.join(where, entry.name);
        paths.push({ name: entry.name, path: abs });
    }
    return paths;
}

export function cx(...cns: (boolean | string | undefined)[]): string {
    return cns.filter(Boolean).join(" ");
}

export async function getAppInfo() {
    const appVersion = await app.getVersion();
    const commitHash = await invoke("get_commit_hash");
    const arch = await os.arch();
    const platform = await os.platform();
    const kVer = await os.version();
    const osType = await os.type();
    const osVer = await os.version();
    const configPath = await api.path.appLocalDataDir();
    const entries = await ls(configPath);
    const models = entries
        .filter((e) => e.name?.endsWith(".bin"))
        .map((e) => e.name)
        .join(", ");
    const defaultModel = localStorage.getItem("model_path")?.split("/")?.pop() ?? "Not Found";
    return `App Version: ${appVersion}
Commit Hash: ${commitHash}
Arch: ${arch}
Platform: ${platform}
Kernel Version: ${kVer}
OS: ${osType}
OS Version: ${osVer}
Models: ${models}
Default Model: ${defaultModel}`;
}

export async function getIssueUrl(logs: string) {
    return `https://github.com/thewh1teagle/vibe/issues/new?assignees=octocat&labels=bug&projects=&template=bug_report.yaml&title=Bug:&logs=${encodeURIComponent(
        logs
    )}`;
}
