import { HttpMethodEnum } from '../enum/http-method.enum.js';

export type HttpMethodType = typeof HttpMethodEnum[keyof typeof HttpMethodEnum];
