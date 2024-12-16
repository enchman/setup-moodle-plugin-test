import { AppConfig } from "../config";
import { Errors } from "../errors";

export interface Repository {
    name: string;
    owner: string;
    ref: string;
}

export interface ParserOptions {
    owner: string;
    ref: string;
}

export class PluginRepository implements Repository {
    private repoName: string = '';
    private repoOwner: string = '';
    private repoRef: string = '';
    private options: ParserOptions;
    private static defaultOptions: ParserOptions|null = null;

    constructor(options: ParserOptions) {
        this.options = options;
    }

    public get name(): string {
        return this.repoName;
    }

    public get owner(): string {
        return this.repoOwner;
    }

    public get ref(): string {
        return this.repoRef;
    }

    private parse(str: string): void {
        if (str.trim() === '') {
            throw Errors.invalidRepository();
        }

        let i: number = str.indexOf('/');
        if (i > -1) {
            this.repoOwner = str.substring(0, i);
            str = str.substring(i + 1);
        } else {
            this.repoOwner = this.options.owner;
        }

        i = str.indexOf('@');
        if (i > -1) {
            this.repoRef = str.substring(i + 1);
            str = str.substring(0, i);
        } else {
            this.repoRef = this.options.ref;
        }

        this.repoName = str;

        if (this.repoName.trim() === '') {
            throw Errors.invalidRepository();
        }
    }

    public static fromString(str: string, options?: ParserOptions): PluginRepository {
        if (!options) {
            options = this.defaultOptions ??= {
                owner: AppConfig.instance.owner,
                ref: 'HEAD'
            };
        }
        const instance = new PluginRepository(options);
        instance.parse(str);
        return instance;
    }

    public static fromList(list: string[], options?: ParserOptions): PluginRepository[] {
        if (!options) {
            options = this.defaultOptions ??= {
                owner: AppConfig.instance.owner,
                ref: 'HEAD'
            };
        }
        const instance = new PluginRepository(options);

        return list.map((str: string) => {
            instance.parse(str);
            return new PluginRepository(instance.options);
        });
    }
}
