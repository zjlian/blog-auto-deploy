import yaml from "js-yaml"
import koa from "koa"
import fs from "fs";
import { strict as assert } from "node:assert";

export default class Server {
    /// 配置文件路径名称
    private configFilename: string;
    /// 服务端口
    private port: number = 3366;

    constructor(configFilename: string) {
        this.configFilename = configFilename;
        const config = yaml.load(fs.readFileSync(configFilename, 'utf8'));
        console.log(config);
    }
}
