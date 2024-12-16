import * as core from "@actions/core";
import { Git, GitCommand } from "./git/git";
import { PluginRepository } from "./git/repo";
import { MoodleClient, MoodleService } from "./moodle/client";
import { AppConfig } from "./config";
import { GitHubClient } from "./git/github";

export class PluginInstaller {
    private static local: PluginInstaller|null = null;

    constructor(
        private git: Git,
        private client: MoodleService
    ) {
    }

    public async install(urls: string[]): Promise<void> {
        const repos = PluginRepository.fromList(urls);

        if (repos.length === 0) {
            core.info('No plugins to install');
            return;
        }

        for (const repo of repos) {
            const plugin = await this.client.getPlugin(repo);
            core.info(`Installing plugin ${plugin.component}`);
            const existCode = await this.git.sync(repo, plugin.path);

            if (existCode !== 0) {
                core.error(`Failed to install plugin ${plugin.component}`);
                return;
            }
        }
    }

    private static create(): PluginInstaller {
        const cfg = AppConfig.instance;
        const git = new GitCommand(cfg);
        const api = new GitHubClient(cfg);
        const moodle = new MoodleClient(api);
        return new PluginInstaller(
            git,
            moodle
        );
    }

    public static instance(): PluginInstaller {
        return this.local ??= this.create();
    }
}
