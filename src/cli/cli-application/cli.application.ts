import { CliCommandInterface } from '../cli-command/cli-command.interface.js';

type ParsedCommandType = {
  [key: string]: string[],
};

export default class CliApplication {
  private commands: {[propertyName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';

  public registerCliCommands(commandList: CliCommandInterface[]): void {
    commandList.forEach((command) => {
      this.commands[command.name] = command;
    });
  }

  private parseCommand(cliArguments: string[]): ParsedCommandType {
    const parsedCommand: ParsedCommandType = {};
    let command = '';

    cliArguments.forEach((item) => {
      if (item.startsWith('--')) {
        parsedCommand[item] = [];
        command = item;
      } else if (command && item) {
        parsedCommand[command].push(item);
      }
    });

    return parsedCommand;
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }

}
