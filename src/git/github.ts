import { Configuration } from "../config";
import { Errors } from "../errors";
import { Repository } from "./repo";

export interface GitHubApi {
    getFileContent(path: string, repo: Repository): Promise<string>;
}

export class GitHubClient implements GitHubApi {
    private config: Configuration;

    constructor(config: Configuration) {
        this.config = config;
    }

    public async getFileContent(path: string, repo: Repository): Promise<string> {
        const uri = path.startsWith('/') ? path.substring(1) : path;
        const url = this.getUrl(repo, uri);
        const response = await this.request(url);
        if (!response.ok) {
            throw Errors.unableToFetchFromRepo(uri, repo);
        }
        return response.text();
    }

    private getUrl(repo: Repository, path: string): string {
        return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.ref}/${path}`;
    }

    private request(url: string): Promise<Response> {
        if (this.config.token === '') {
            return fetch(url, {
                method: 'GET'
            });
        }

        return fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.config.token}`
            }
        });
    }
}
