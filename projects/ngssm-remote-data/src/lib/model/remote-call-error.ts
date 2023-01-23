export interface RemoteCallError {
  type: string;
  title: string;
  status: number;
  tracedId: string;
  errors?: { [key: string]: string[] };
}
