import { Provider } from "./IProviderInterfaces";

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
