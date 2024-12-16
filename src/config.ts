import * as core from '@actions/core';
import * as github from '@actions/github';

export interface Configuration {
    owner: string;
    token: string;
}

export class AppConfig implements Configuration {
    private static local: AppConfig|null = null;

    get owner(): string {
        return github.context.repo.owner;
    }

    get token(): string {
        return core.getInput('token');
    }

    public static get instance(): AppConfig {
        return this.local ??= new AppConfig();
    }
}