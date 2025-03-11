import { Document } from "./IDocumentInterfaces";
import { Provider } from "./IProviderInterfaces";
import { Vendor } from "./IVendorInterfaces";

export enum ClientProviderStatus {
  SIN_ENTREGA = "Sin entrega",
  POR_VALIDAR = "Por validar",
  INCORRECTO = "Incorrecto",
  ACEPTADO = "Aceptado",
  EN_ESPERA = "En espera",
}

export interface Client {
  id: number;
  name: string;
  vendorId: number;
  email: string;
  phoneNumber: string;
  documentsStatus: ClientProviderStatus;
  isActive: boolean;
}

export interface IClientProviderResponse {
  success: boolean;
  message: string;
  data?: (Client | Provider)[];
}

export interface IClientDocumentsResponse {
  success: boolean;
  message: string;
  clients: IClientDashboardRow[];
}

export interface IClientDashboardRow {
  client: Client;
  vendor: Vendor;
  documents: Document[];
}
