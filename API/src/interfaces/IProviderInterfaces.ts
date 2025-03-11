import { ClientProviderStatus } from "./IClientInterfaces";
import { Document } from "./IDocumentInterfaces";
import { Vendor } from "./IVendorInterfaces";

export interface Provider {
  id: number;
  name: string;
  vendorId: number;
  email: string;
  phoneNumber: string;
  documentsStatus: ClientProviderStatus;
  isActive: boolean;
}

export interface IProviderDocumentsResponse {
  success: boolean;
  message: string;
  providers: IProviderDashboardRow[];
}

export interface IProviderDashboardRow {
  provider: Provider;
  vendor: Vendor;
  documents: Document[];
}
