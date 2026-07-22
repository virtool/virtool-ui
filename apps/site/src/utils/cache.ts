import { promises as fs } from "fs";

export class Cache {
  path: string;

  constructor(path = "./public/.cache") {
    this.path = path;
  }

  async load() {
    try {
      await fs.access(this.path);
    } catch (err) {
      if (err && err.code === "ENOENT") {
        await fs.mkdir(this.path);
      }
    }
  }

  async get(key: string) {
    try {
      return JSON.parse(await fs.readFile(`${this.path}/${key}.json`));
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }
  }

  async set(key: string, value: object) {
    await this.delete(key);
    await fs.writeFile(`${this.path}/${key}.json`, JSON.stringify(value));
    return value;
  }

  async delete(key: string) {
    await fs.rm(`${this.path}/${key}.json`, { force: true });
  }
}
