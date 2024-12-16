import * as core from '@actions/core';
import { PluginInstaller } from './installer';

const deps = core.getMultilineInput('plugins', { required: false });

if (deps.length === 0) {
    core.info('No plugins to install');
    process.exit(0);
}

const installer = PluginInstaller.instance();
installer.install(deps).catch((err) => {
    core.error(err);
    process.exit(1);
});
