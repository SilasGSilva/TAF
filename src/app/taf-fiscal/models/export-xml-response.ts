import { ItemExportXml } from "./item-export-xml";

export interface ExportXmlResponse {
  event: string;
  totalEvent: number;
  homeDirectory: string;
  exportXML:Array<ItemExportXml>;
  sucess:boolean;
  message:string;
}
