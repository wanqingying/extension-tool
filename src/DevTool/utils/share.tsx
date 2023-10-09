import { EventEmitter } from "eventemitter3";
export enum EventNameType {
  HAR_HOT = "HAR_HOT",
}
type EventEntryType = {
  HAR_HOT: HarData;
};
export const emitter = new EventEmitter<EventNameType, any>();

interface HarData {
  url: string;
  content: any;
  encoding: string;
  text: string;
  bodySize: number;
  headersReq: Array<{ name: string; value: any }>;
  headersRes: Array<{ name: string; value: any }>;
  method: string;
}

interface HarHotType {
  type: "http";
  data: HarData;
}
