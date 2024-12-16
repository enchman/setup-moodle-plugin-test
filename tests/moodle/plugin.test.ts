import {expect, test} from 'vitest';
import {MoodlePlugin} from '../../src/moodle/plugin';

test('get plugin component', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.component).toEqual('assignsubmission_myplugin');
});

test('get plugin version', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.version).toEqual('2024122000');
});

test('get plugin moodle', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.moodle).toEqual('2024121000');
});

test('get plugin type', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.type).toEqual('assignsubmission');
});

test('get plugin name', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.name).toEqual('myplugin');
});

test('get plugin path', () => {
    const plugin = new MoodlePlugin('assignsubmission_myplugin', '2024122000', '2024121000');
    expect(plugin.path).toEqual('/mod/assign/submission/myplugin');
});

test('get plugin path with invalid plugin name', () => {
    const plugin = new MoodlePlugin('assignsubmission', '2024122000', '2024121000');
    expect(() => plugin.path).toThrow();
});

test('get plugin path with invalid type', () => {
    const plugin = new MoodlePlugin('assignunknown', '2024122000', '2024121000');
    expect(() => plugin.path).toThrow();
});