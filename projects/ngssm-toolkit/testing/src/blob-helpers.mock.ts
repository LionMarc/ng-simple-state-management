import { BlobContentReaderAsString } from 'ngssm-toolkit';
import { Observable, of } from 'rxjs';

export const mockBlobContentReaderAsString: (value: string) => BlobContentReaderAsString = (value: string) => {
  return (): Observable<string> => of(value);
};
