import { expect, test } from 'vitest';
import { PluginRepository } from '../../src/git/repo';

test('parse repo from string', () => {
    const repoUri = "owner/repo@ref";
    const options = {
        owner: 'owner',
        ref: 'ref'
    };
    const repo = PluginRepository.fromString(repoUri, options);
    expect(repo.owner).toBe('owner');
    expect(repo.name).toBe('repo');
    expect(repo.ref).toBe('ref');
});
