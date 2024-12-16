import { Errors } from "../errors";
import { GitHubApi } from "../git/github";
import { Repository } from "../git/repo";
import { MoodlePlugin, Plugin } from "./plugin";

export interface MoodleService {
    getPlugin(repo: Repository): Promise<Plugin>;
}

export class MoodleClient implements MoodleService {
    private github: GitHubApi;

    constructor(github: GitHubApi) {
        this.github = github;
    }

    public async getPlugin(repo: Repository): Promise<Plugin> {
        const version = await this.getPluginVersionFile(repo);
        return this.parsePluginVersionFile(version);
    }

    private getPluginVersionFile(repo: Repository): Promise<string> {
        return this.github.getFileContent('version.php', repo);
    }

    private parsePluginVersionFile(content: string): Plugin {
        return new MoodlePlugin(
            this.getVersionPropertyAsString(content, 'component', Errors.invalidPluginName),
            this.getVersionPropertyAsNumber(content, 'version', Errors.invalidPluginVersion),
            this.getVersionPropertyAsNumber(content, 'requires', Errors.invalidPluginMoodle),
        );
    }

    private getVersionPropertyAsNumber(
        content: string,
        property: string,
        errorEmitter: () => Error
    ): string {
        return this.getVersionProperty(content, property, '\\d+', errorEmitter);
    }

    private getVersionPropertyAsString(
        content: string,
        property: string,
        errorEmitter: () => Error
    ): string {
        return this.getVersionProperty(content, property, '\\w+', errorEmitter);
    }

    private getVersionProperty(
        content: string,
        property: string,
        valuePattern: string,
        errorEmitter: () => Error
    ): string {
        const pattern = new RegExp(
            `\\$plugin->${property}\\s*=\\s*['"]*(?<${property}>${valuePattern})['"]*`,
            'gm'
        );
        const match = pattern.exec(content);
        if (!match || !match.groups?.[property]) {
            throw errorEmitter();
        }
        return match.groups[property];
    }
}
