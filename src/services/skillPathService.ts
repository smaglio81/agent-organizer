/**
 * Skill Path Service - resolves skill locations across workspace and user home
 */

import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export class SkillPathService {
    private readonly DEFAULT_SCAN_LOCATIONS = [
        '.agents/skills',
        '.github/skills',
        '.claude/skills',
        '~/.agents/skills',
        '~/.copilot/skills',
        '~/.claude/skills'
    ];

    constructor() {}

    getScanLocations(): string[] {
        const config = vscode.workspace.getConfiguration('chat');
        const locations = config.get<string[]>('agentSkillsLocations');
        
        // Use configured locations if available, otherwise fall back to defaults
        if (locations && Array.isArray(locations) && locations.length > 0) {
            return locations;
        }
        
        return this.DEFAULT_SCAN_LOCATIONS;
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
        const config = vscode.workspace.getConfiguration('agentOrganizer');
        return config.get<string>('installLocation', '.github/skills');
    }

    isHomeLocation(location: string): boolean {
        const loc = location.trim();
        return loc.startsWith('~');
    }

    requiresWorkspaceFolder(location: string): boolean {
        return !this.isHomeLocation(location);
    }

    getWorkspaceFolderForLocation(location: string): vscode.WorkspaceFolder | undefined {
        if (!this.requiresWorkspaceFolder(location)) {
            return undefined;
        }

        return this.getWorkspaceFolder();
    }

    resolveLocationToUri(location: string, workspaceFolder?: vscode.WorkspaceFolder): vscode.Uri | undefined {
        const loc = location.trim();
        if (this.isHomeLocation(loc)) {
            const resolvedPath = path.join(this.getHomeDirectory(), loc.slice(1).replace(/^[/\\]+/, ''));
            return vscode.Uri.file(this.normalizePath(resolvedPath));
        }

        if (!workspaceFolder) {
            return undefined;
        }

        const segments = this.normalizeWorkspaceLocation(loc).split(/[\\/]+/).filter(s => s.length > 0);
        return vscode.Uri.joinPath(workspaceFolder.uri, ...segments);
    }

    resolveInstallTarget(skillName: string, workspaceFolder?: vscode.WorkspaceFolder): vscode.Uri | undefined {
        const trimmed = skillName.trim();
        if (!trimmed || trimmed === '.' || /[/\\]/.test(trimmed) || trimmed.includes('..')) {
            return undefined;
        }

        const installLocation = this.getInstallLocation();
        const resolvedWorkspaceFolder = workspaceFolder ?? this.getWorkspaceFolderForLocation(installLocation);
        const baseDir = this.resolveLocationToUri(installLocation, resolvedWorkspaceFolder);

        if (!baseDir) {
            return undefined;
        }

        return vscode.Uri.joinPath(baseDir, trimmed);
    }

    private normalizeWorkspaceLocation(location: string): string {
        const normalized = path.posix.normalize(location.replace(/\\/g, '/'));
        const root = path.posix.parse(normalized).root;
        if (normalized.length <= root.length) {
            return normalized;
        }

        return normalized.replace(/\/+$/, '');
    }

    private normalizePath(value: string): string {
        const normalized = path.normalize(value);
        const root = path.parse(normalized).root;
        if (normalized.length <= root.length) {
            return normalized;
        }

        return normalized.replace(/[\\/]+$/, '');
    }
}
