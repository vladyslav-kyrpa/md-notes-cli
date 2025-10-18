#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import os from "os";
import path from "path";

const program = new Command();

const CONFIG_PATH = path.join(os.homedir(), ".noteconfig.json");
const defaultConfig = {
    notesPath: path.join(os.homedir(), ".notes.json"),
};

function loadConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    }
    return defaultConfig;
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function normalizeFileName(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/gi, "") // remove bad chars
        .replace(/\s+/g, "_"); // replace spaces
}

function getTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

const config = loadConfig();

const addNote = (options) => {
    if (!options.message) {
        console.error(" Please provide message (-m).");
        process.exit(1);
    }

    const dirPath = path.resolve(config.notesPath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const timestamp = getTimestamp();
    const isAnon = !!(!options.name);

    const filename = !isAnon
        ? `${normalizeFileName(options.name)}_${timestamp}.md`
        : `${timestamp}.md`;
    const filePath = path.join(dirPath, filename);

    const title = isAnon ? "" : `# ${options.name}\n\n`;
    const content = `${title}${options.message}\n\nCreation date: ${timestamp}`;

    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Note saved: ${filePath}`);
}

const changeConfig = (options) => {
    if (options.path) {
        config.notesPath = path.resolve(options.path);
        saveConfig(config);
        console.log(`Notes path updated to: ${config.notesPath}`);
    } else {
        console.log("Current config:", config);
    }
}

// ==== DEFINE CLI API ====

program
    .name("note")
    .description("A simple CLI note-taking tool")
    .version("1.0");

program
    .option("-n, --name <title>", "Note title")
    .option("-m, --message <text>", "Note message body")
    .action(addNote);

program
    .command("config")
    .description("View or change configuration")
    .option("--path <path>", "Set default notes file path")
    .action(changeConfig);

program.parse(process.argv);