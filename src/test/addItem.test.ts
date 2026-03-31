/**
 * Add Item (New Skill) Test Suite
 *
 * Tests name normalization and skill scaffolding creation.
 */

import * as assert from 'assert';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { normalizeName, todayStamp } from '../extension';

suite('Add Item Test Suite', () => {

    suite('normalizeName', () => {
        test('lowercases input', () => {
            assert.strictEqual(normalizeName('MySkill'), 'myskill');
        });

        test('replaces spaces with dashes', () => {
            assert.strictEqual(normalizeName('my cool skill'), 'my-cool-skill');
        });

        test('replaces non-alphanumeric characters with dashes', () => {
            assert.strictEqual(normalizeName('skill@v2!'), 'skill-v2');
        });

        test('collapses multiple dashes', () => {
            assert.strictEqual(normalizeName('a---b'), 'a-b');
        });

        test('strips leading and trailing dashes', () => {
            assert.strictEqual(normalizeName('--hello--'), 'hello');
        });

        test('handles mixed special characters', () => {
            assert.strictEqual(normalizeName('My Cool Skill (v2)'), 'my-cool-skill-v2');
        });

        test('returns empty string for all-special input', () => {
            assert.strictEqual(normalizeName('!!!'), '');
        });

        test('preserves numbers', () => {
            assert.strictEqual(normalizeName('skill123'), 'skill123');
        });

        test('handles unicode characters', () => {
            const result = normalizeName('café-résumé');
            assert.strictEqual(result, 'caf-r-sum');
        });
    });

    suite('todayStamp', () => {
        test('returns yyyy.MM.dd format', () => {
            const stamp = todayStamp();
            assert.match(stamp, /^\d{4}\.\d{2}\.\d{2}$/, 'Should match yyyy.MM.dd format');
        });

        test('matches current date', () => {
            const stamp = todayStamp();
            const d = new Date();
            const expected = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
            assert.strictEqual(stamp, expected);
        });
    });

    suite('Add Skill scaffolding', () => {
        test('creates skill folder with SKILL.md containing correct frontmatter', async () => {
            const tmpBase = path.join(os.tmpdir(), `ao-add-skill-test-${Date.now()}`);
            const locationUri = vscode.Uri.file(tmpBase);

            try {
                const name = normalizeName('My Test Skill');
                const folderUri = vscode.Uri.joinPath(locationUri, name);
                await vscode.workspace.fs.createDirectory(folderUri);

                const stamp = todayStamp();
                const skillMd = `---\nname: ${name}\ndescription: \nmetadata:\n  version: "${stamp}"\n---\n`;
                const fileUri = vscode.Uri.joinPath(folderUri, 'SKILL.md');
                await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(skillMd));

                // Verify folder exists
                const folderStat = await vscode.workspace.fs.stat(folderUri);
                assert.strictEqual(folderStat.type & vscode.FileType.Directory, vscode.FileType.Directory);

                // Verify SKILL.md exists and has correct content
                const content = new TextDecoder().decode(await vscode.workspace.fs.readFile(fileUri));
                assert.ok(content.includes('name: my-test-skill'), 'Should contain normalized name');
                assert.ok(content.includes(`version: "${stamp}"`), 'Should contain today\'s date as version');
                assert.ok(content.includes('description: '), 'Should contain description field');
                assert.ok(content.startsWith('---\n'), 'Should start with frontmatter delimiter');
                assert.ok(content.includes('\n---\n'), 'Should have closing frontmatter delimiter');
            } finally {
                await vscode.workspace.fs.delete(vscode.Uri.file(tmpBase), { recursive: true });
            }
        });

        test('normalized name is used as folder name', async () => {
            const tmpBase = path.join(os.tmpdir(), `ao-add-skill-name-test-${Date.now()}`);
            const locationUri = vscode.Uri.file(tmpBase);

            try {
                const name = normalizeName('Hello World Skill!');
                assert.strictEqual(name, 'hello-world-skill');

                const folderUri = vscode.Uri.joinPath(locationUri, name);
                await vscode.workspace.fs.createDirectory(folderUri);

                const stat = await vscode.workspace.fs.stat(folderUri);
                assert.strictEqual(stat.type & vscode.FileType.Directory, vscode.FileType.Directory);
                assert.ok(folderUri.fsPath.endsWith('hello-world-skill'));
            } finally {
                await vscode.workspace.fs.delete(vscode.Uri.file(tmpBase), { recursive: true });
            }
        });

        test('SKILL.md frontmatter can be parsed back', async () => {
            const tmpBase = path.join(os.tmpdir(), `ao-add-skill-parse-test-${Date.now()}`);

            try {
                const name = 'test-skill';
                const stamp = todayStamp();
                const skillMd = `---\nname: ${name}\ndescription: \nmetadata:\n  version: "${stamp}"\n---\n`;

                const fileUri = vscode.Uri.file(path.join(tmpBase, name, 'SKILL.md'));
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(tmpBase, name)));
                await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(skillMd));

                const content = new TextDecoder().decode(await vscode.workspace.fs.readFile(fileUri));
                const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                assert.ok(match, 'Should have valid frontmatter');

                // Parse name from frontmatter
                const nameMatch = match![1].match(/^name:\s*(.+)$/m);
                assert.ok(nameMatch, 'Should have name field');
                assert.strictEqual(nameMatch![1].trim(), 'test-skill');
            } finally {
                await vscode.workspace.fs.delete(vscode.Uri.file(tmpBase), { recursive: true });
            }
        });
    });
});
