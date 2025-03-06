export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType?: string; // Null will be converted to `undefined`
  webViewLink?: string; // Null will be converted to `undefined`
}

export enum DocumentOwnerType {
  CLIENT = "client",
  PROVIDER = "provider",
}

export interface FileUpload {
  name: string;
  type: string;
  data: any;
}
