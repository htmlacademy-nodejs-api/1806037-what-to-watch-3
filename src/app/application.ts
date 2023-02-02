import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../assets/enum/component.symbol.enum.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';

@injectable()
export default class Application {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private config: ConfigInterface,
  ) { }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }

}
