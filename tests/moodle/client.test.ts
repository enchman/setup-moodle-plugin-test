import {expect, test} from 'vitest';
import {MoodleClient} from '../../src/moodle/client';
import { PluginRepository } from '../../src/git/repo';

class MockApi {
    constructor(private content: string) {
    }

    async getFileContent(path: string, repo: PluginRepository) {
        return this.content;
    }
}

test('get plugin version.php', async () => {
    const component = 'assignsubmission_myplugin';
    const version = '2024122000';
    const moodle = '2024121000';

    const api = new MockApi(`<?php
        $plugin->component = '${component}';
        $plugin->version = ${version};
        $plugin->requires = '${moodle}';
    `);
    const repo = PluginRepository.fromString('owner/repo@ref', { owner: 'owner', ref: 'ref' });
    const client = new MoodleClient(api as any);
    const plugin = await client.getPlugin(repo);

    expect(plugin.component).toEqual(component);
    expect(plugin.version).toEqual(version);
    expect(plugin.moodle).toEqual(moodle);
});