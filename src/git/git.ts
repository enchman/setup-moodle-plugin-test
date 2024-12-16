import { env } from "process";
import { Repository } from "./repo";
import { exec } from "@actions/exec";
import * as core from "@actions/core";
import { Configuration } from "../config";

export interface Git {
    sync(repo: Repository, path?: string): Promise<number>;
}

export class GitCommand implements Git {

    constructor(private config: Configuration) {
    }

    public async sync(repo: Repository, path?: string): Promise<number> {
        console.log(`Syncing ${repo.owner}/${repo.name}...`);

        let exitCode = await this.clone(repo, path);
        if (exitCode !== 0) {
            core.error(`Failed to clone ${repo.owner}/${repo.name}`);
            return exitCode;
        }

        exitCode = await this.fetch(repo, path);
        if (exitCode !== 0) {
            core.error(`Failed to fetch ${repo.ref}`);
            return exitCode;
        }

        exitCode = await this.checkout(repo, path);
        if (exitCode !== 0) {
            core.error(`Failed to checkout ${repo.ref}`);
            return exitCode;
        }

        return 0;
    }

    private clone(
        repo: Repository,
        path?: string
    ): Promise<number> {
        const args = [
            'repo',
            'clone',
            `${repo.owner}/${repo.name}`,
        ];

        if (path) {
            args.push(path);
        }

        return this.gitCmd('gh', args);
    }

    private checkout(
        repo: Repository,
        path?: string
    ): Promise<number> {
        const args = [
            'checkout',
            repo.ref,
        ];

        if (path) {
            args.unshift(
                '-C',
                path,
            );
        }

        return this.gitCmd('git', args);
    }

    private fetch(
        repo: Repository,
        path?: string
    ): Promise<number> {
        const args = [
            'fetch',
            'origin',
            repo.ref,
        ];

        if (path) {
            args.unshift(
                '-C',
                path,
            );
        }

        return this.gitCmd('git', args);
    }

    private gitCmd(
        cmd: string,
        args: string[]
    ): Promise<number> {
        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    core.info(data.toString());
                },
                stderr: (data: Buffer) => {
                    core.error(data.toString());
                },
                env: {
                    ...env,
                    GITHUB_TOKEN: this.getToken(),
                }
            },
        };

        return exec(cmd, args, options);
    }

    private getToken(): string {
        let token = this.config.token;
        if (token === "") {
            token = core.getInput("token");
        }
        return token;
    }
}
