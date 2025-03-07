export interface IDocumentResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const numToMonth = (num: number): string => {
  switch (num) {
    case 1:
      return "Enero";
    case 2:
      return "Febrero";
    case 3:
      return "Marzo";
    case 4:
      return "Abril";
    case 5:
      return "Mayo";
    case 6:
      return "Junio";
    case 7:
      return "Julio";
    case 8:
      return "Agosto";
    case 9:
      return "Septiembre";
    case 10:
      return "Octubre";
    case 11:
      return "Noviembre";
    case 12:
      return "Diciembre";
    default:
      return "";
  }
};

export enum OwnerType {
  CLIENT = "Client",
  PROVIDER = "Provider",
}

export enum DocumentType {
  CONSTANCIA_DE_SITUACION_FISCAL = "ConstanciaDeSituacionFiscal",
  OPINION_DE_CUMPLIMIENTO = "OpinionDeCumplimiento",
  CONTRATO = "Contrato",
  ORDEN_DE_COMPRA = "OrdenDeCompra",
}

export enum DocumentStatus {
  POR_VALIDAR = "Por validar",
  ACEPTADO = "Aceptado",
  RECHAZADO = "Rechazado",
  EN_ESPERA = "En espera",
}

export interface Document {
  id: number;
  ownerType: OwnerType;
  ownerId: number;
  documentType: DocumentType;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  uploadTimestamp?: string;
  requestedTimestamp: string;
  validStatus: DocumentStatus;
  rejectedReason?: string;
}
