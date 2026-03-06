# agentSkills.installLocation Selection Dropdown Feature

## Location

The agentSkills.installed view with the Agetn Skills activity bar.

## Install Location Action / Button

I'd like to update the Installed view to have a dropdown at the top of it.

The dropdown have the label "Install Location".

The dropdown would show the current value of `agentSkills.installLocation`.

The dropdown could be selected and would display a drop down of these values:

* The values from the agentSkills.installLocation enum
* The current value of agentSkills.installLocation if that values does not exist in the agentSkills.installLocation enum
* The entry "Custom ..."

Selecting any value within the list other than "Custom ..." would set the value of `agentSkills.installLocation` in the user's settings.json file.

If "Custom ..." is selected, the user's settings.json file should open and the cursor should be placed on the entry for `agentSkills.installLocation`.

## Installed View Update Description

Could you update the Installed view to group plugins under the location where they are installed at.

For example:

```text
.github/skills
└── skill-01
~/.copilot/skill
└── skill-02
```

* The location should use a relative path.
* If the location is in the users home directory, it should use ~ to represent the home directory (the same we are doing with the `agentSkill.installLocation` values).
* If the location is not in the current workspace or the users home directory, then it should use the full path.
* The folder paths should expand/collapse directory tree nodes, the skill should be entries within the tree.
* The folder trees should default to expanded
  * If possible, please store information about which entries were expanded and collapsed when:
    * VS Code closed
    * Or, the folder/workspace is closed
  * The information about what was expanded/collapsed should be loaded and applied when the extension is loaded.

## Installed Expand All Action / Button

Add a button to the Installed View to expand all locations in the view.

## Installed Collapse All Action / Button

Add a button to the Installed View to collapse all locations in the view.
