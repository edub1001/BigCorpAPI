/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    employeesUrl: string
  }
  export const config: Config
  export type Config = IConfig
}
