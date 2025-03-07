import { ClientProviderStatus } from "./IClientInterfaces";

export interface Provider {
  id: number;
  name: string;
  vendorId: number;
  email: string;
  phoneNumber: string;
  documentsStatus: ClientProviderStatus;
  isActive: boolean;
}
