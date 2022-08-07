import yaml from "js-yaml"
import Koa from "koa"
import bodyParser from "koa-bodyparser";
import fs from "fs";
import { strict as assert } from "node:assert";

interface ServerConfig {
    // 启动消息
    helloMessage: string;
    // 服务端口
    port: number;
    // hexo 源码仓库的 ssh 链接
    hexoRepositoryUrl: string;
    // 博客源码仓库的 ssh 链接
    blogRepositoryUrl: string;
    // 静态页面源码仓库的 ssh 链接
    pageRepositoryUrl: string;
    // webhook 的口令
    webhookSecret: string;

    // 处理发布的时间间隔
    deployInterval: number;
}

export default class Server {
    // 服务配置信息
    private config: ServerConfig;

    // Koa 实例
    private server: Koa;

    // 最近一次博客文章提交的时间
    private lastPostTime: number = 0;

    // 是否有未处理的新提交
    private pending: boolean = false;


    constructor(configFilename: string) {
        assert(configFilename.length > 0, "路径无效");
        const configString = fs.readFileSync(configFilename, 'utf8');
        this.config = yaml.load(configString) as ServerConfig;
        assert(this.config, "配置文件解析失败");
        console.info("服务启动，当前配置为: ");
        console.info(this.config);
        this.server = new Koa;
    }

    // 启动服务
    public run(): void {
        this.server.use(async ctx => await this.handleRequest(ctx));
        // 定时处理发布请求，避免短时间多次更新导致不停运行发布流程
        setInterval(async () => await this.handleDeploy(),
            this.config.deployInterval);
        console.info(`服务启动端口为 ${this.config.port}`);
        this.server.listen(this.config.port);
    }

    // 处理新请求
    private async handleRequest(ctx: Koa.Context) {
        console.debug("收到新请求");
        console.debug(ctx.request);
        console.debug(ctx.request.body);
        console.debug("=========================================");
        ctx.body = this.config.helloMessage;
        this.lastPostTime = Date.now();
        this.pending = true;
    }

    // 定时处理生成发布服务
    private async handleDeploy() {
        if (!this.pending) {
            return;
        }
        this.pending = false;

        console.debug("开始发布工作...");
        // TODO 生成页面和发布
    }
}
