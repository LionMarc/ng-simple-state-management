import { BlobContentReaderAsString } from 'ngssm-toolkit';
import { Observable, of } from 'rxjs';

export const mockBlobContentReaderAsString: (value: string) => BlobContentReaderAsString = (value: string) => {
  return (_file: Blob): Observable<string> => of(value);
};
