/**
 * Skill Path Service - resolves skill locations across workspace and user home
 */

import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export class SkillPathService {
    constructor() {}

    getScanLocations(): string[] {
        return ['.github/skills', '.claude/skills', '~/.copilot/skills/', '~/.claude/skills/'];
    }

    getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
        return vscode.workspace.workspaceFolders?.[0];
    }

    getFileSystem(): vscode.FileSystem {
        return vscode.workspace.fs;
    }

    getHomeDirectory(): string {
        return os.homedir();
    }

    getInstallLocation(): string {
        const config = vscode.workspace.getConfiguration('agentSkills');
        return config.get<string>('installLocation', '.github/skills');
    }

    resolveLocationToUri(location: string, workspaceFolder?: vscode.WorkspaceFolder): vscode.Uri | undefined {
        if (location.startsWith('~')) {
            const resolvedPath = path.join(this.getHomeDirectory(), location.slice(1).replace(/^[/\\]+/, ''));
            return vscode.Uri.file(resolvedPath);
        }

        if (!workspaceFolder) {
            return undefined;
        }

        return vscode.Uri.joinPath(workspaceFolder.uri, location);
    }

    resolveInstallTarget(skillName: string, workspaceFolder?: vscode.WorkspaceFolder): vscode.Uri | undefined {
        const installLocation = this.getInstallLocation();
        const baseDir = this.resolveLocationToUri(installLocation, workspaceFolder);

        if (!baseDir) {
            return undefined;
        }

        return vscode.Uri.joinPath(baseDir, skillName);
    }
}
