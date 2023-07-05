import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type BlobContentReaderAsString = (file: Blob) => Observable<string>;

export const defaultBlobContentReaderAsString: BlobContentReaderAsString = (file: Blob): Observable<string> => {
  const observable = new Subject<string>();
  const reader = new FileReader();

  reader.onloadend = () => {
    const data = reader.result as string;
    reader.onload = null;
    observable.next(data);
    observable.complete();
  };

  reader.onerror = (error) => {
    observable.error(error);
  };

  reader.readAsText(file);

  return observable;
};

export const BLOB_CONTENT_READER_AS_STRING = new InjectionToken<BlobContentReaderAsString>('BLOB_CONTENT_READER_AS_STRING');

export const provideBlobHelpers = (): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: BLOB_CONTENT_READER_AS_STRING, useValue: defaultBlobContentReaderAsString }]);
};
