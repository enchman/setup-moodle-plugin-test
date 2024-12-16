import { Repository } from "./git/repo";

export class Errors {
    public static invalidRepository(): Error {
        return new Error('Invalid repository format');
    }

    public static invalidPluginVersion(): Error {
        return new Error('Invalid plugin version');
    }

    public static invalidPluginName(): Error {
        return new Error('Invalid plugin name');
    }

    public static invalidPluginMoodle(): Error {
        return new Error('Invalid plugin moodle version');
    }

    public static unableToFetchFromRepo(uri: string, repo: Repository): Error {
        return new Error(`Failed to fetch "${uri}" from ${repo.owner}/${repo.name}@${repo.ref}`);
    }

    public static noInstallationPathFound(): Error {
        return new Error('No installation path found');
    }
}
