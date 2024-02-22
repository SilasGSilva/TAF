import { Basis } from './Basis';

export class ESocialBaseConferFgtsValues {
  public cpfNumber: string;
  public cpfNumberFormatted?: string;
  public name: string;
  public esocialRegistration: string;
  public esocialCategory: string;
  public numberEmployees?: string;
  public fgtsValue: number;
  public fgtsTafValue: number;
  public fgtsRetValue: number;
  public fgts13Value: number;
  public fgts13TafValue: number;
  public fgts13RetValue: number;
  public fgtsRescissionValue: number;
  public fgtsRescissionRetValue: number;
  public fgtsRescissionTafValue: number;
  public fgtsTotValue: number;
  public fgtsTotTafValue: number;
  public fgtsTotRetValue: number;
  public basis: Array<Basis>;
}
