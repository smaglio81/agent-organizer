# Agent Organizer

Browse, download, and manage AI tools from GitHub — agents, skills, hooks, instructions, plugins, and prompts — all from a single VS Code sidebar.

## What it does

Agent Organizer adds a sidebar panel to VS Code with views for each type of AI tool:

- **Marketplace** — discover content from GitHub repositories
- **Agents** — `*.agent.md` files
- **Hooks - GitHub** — folder-based hooks with `hooks.json`
- **Hooks - Kiro** — single-file JSON hooks
- **Instructions** — `*.instructions.md` files
- **Plugins** — folders with `plugin.json`
- **Prompts / Commands** — `*.prompt.md` files
- **Skills** — folders with `SKILL.md`

Each view shows what you have installed locally, grouped by location. The Marketplace lets you browse repositories and download items with one click.

## Getting started

1. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=smaglio81.agent-organizer)
2. Open the **Agent Organizer** panel in the Activity Bar
3. Browse the Marketplace and click the download button on any item
4. Your downloaded items appear in the corresponding area view

## Key features

**Download from GitHub** — browse multiple repositories, view README documentation, and download any item to your configured location.

**Duplicate detection** — when the same item exists in multiple locations, color-coded icons show which copy is newest (green), older (orange), identical (blue), or unique (purple).

**Plugin sync** — keep plugin subfolders (`/agents`, `/skills`, `/commands`, `/hooks`) in sync with your latest installed items using "Get latest copy" commands.

**Flexible locations** — each area has its own configurable download location. Scans workspace folders and home directories automatically.

**Green check indicators** — items you've already downloaded show a green check in the Marketplace.

For detailed guides, see the [docs](docs/) folder:

- [Marketplace & downloading](docs/marketplace.md)
- [Managing installed items](docs/installed-items.md)
- [Plugin workflows](docs/plugins.md)
- [Configuration](docs/configuration.md)

## Default repositories

The extension comes pre-configured with these GitHub repositories:

| Repository | Content |
|---|---|
| anthropics/skills | Anthropic's official skills |
| github/awesome-copilot | Community agents, hooks, instructions, plugins, prompts, skills |
| pytorch/pytorch | PyTorch skills |
| openai/skills | OpenAI curated skills |
| microsoftdocs/mcp | Microsoft MCP documentation |
| formulahendry/agent-skill-code-runner | Code runner skill |

Add your own repositories from the Marketplace toolbar or in Settings.

## Issues & feedback

Found a bug or have a feature request? [Open an issue on GitHub](https://github.com/smaglio81/agent-organizer/issues).

## License

MIT — see [LICENSE](LICENSE) for details.

## Credits

Based on the original work from [formulahendry/vscode-agent-skills](https://github.com/formulahendry/vscode-agent-skills).
