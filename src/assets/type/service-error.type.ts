import { ServiceErrorEnum } from '../enum/service-error.enum.js';

export type ServiceErrorType = typeof ServiceErrorEnum[keyof typeof ServiceErrorEnum];
