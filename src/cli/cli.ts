#!/usr/bin/env node

import HelpCliCommand from './cli-command/help-command.cli.js';
import VersionCliCommand from './cli-command/version-command.cli.js';
import CliApplication from './cli-application/cli.application.js';
import ImportCliCommand from './cli-command/import-command.cli.js';

const myManager = new CliApplication();
myManager.registerCliCommands([
  new HelpCliCommand,
  new VersionCliCommand,
  new ImportCliCommand,
]);
myManager.processCommand(process.argv);
