/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "ANTHROPIC_API_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "MyService": {
      "service": string
      "type": "sst.aws.Service"
      "url": string
    }
    "MyVpc": {
      "type": "sst.aws.Vpc"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}