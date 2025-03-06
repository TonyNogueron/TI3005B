export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType?: string; // Null will be converted to `undefined`
}
