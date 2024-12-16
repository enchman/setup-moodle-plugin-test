import { Errors } from '../errors';
import pluginDirs from './plugins.json';

interface PluginDirectoryMap {
    [key: string]: string;
}

export interface Plugin {
    component: string;
    type: string;
    name: string;
    version: string;
    moodle: string;
    path: string;
}

export class MoodlePlugin implements Plugin {
    private pluginComponent: string;
    private pluginVersion: string;
    private pluginMoodle: string;
    private pluginType: string | null = null;
    private pluginName: string | null = null;
    private pluginPath: string | null = null;
    private pluginDirectories: PluginDirectoryMap = pluginDirs;

    constructor(
        component: string,
        version: string,
        moodle: string,
    ) {
        this.pluginComponent = component;
        this.pluginVersion = version;
        this.pluginMoodle = moodle;
    }

    public get component(): string {
        return this.pluginComponent;
    }

    public get type(): string {
        if (!this.pluginType) {
            const i = this.pluginComponent.indexOf('_');
            if (i === -1) {
                throw Errors.invalidPluginName();
            }
            this.pluginType = this.pluginComponent.substring(0, i);
            this.pluginName = this.pluginComponent.substring(i + 1);
        }
        return this.pluginType;
    }

    public get name(): string {
        if (!this.pluginName) {
            const i = this.pluginComponent.indexOf('_');
            if (i === -1) {
                throw Errors.invalidPluginName();
            }
            this.pluginType = this.pluginComponent.substring(0, i);
            this.pluginName = this.pluginComponent.substring(i + 1);
        }
        return this.pluginName;
    }

    public get version(): string {
        return this.pluginVersion;
    }

    public get moodle(): string {
        return this.pluginMoodle;
    }

    public get path(): string {
        return this.pluginPath ??= this.findInstallationPath();
    }

    private findInstallationPath(): string {
        const typeDir = this.pluginDirectories[this.type];
        if (!typeDir) {
            throw Errors.noInstallationPathFound();
        }

        return `${typeDir}/${this.name}`;
    }
}
