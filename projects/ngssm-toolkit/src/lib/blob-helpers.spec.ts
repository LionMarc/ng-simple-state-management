import { TestBed } from '@angular/core/testing';
import { BLOB_CONTENT_READER_AS_STRING, BlobContentReaderAsString, provideBlobHelpers } from './blob-helpers';

describe('BlobHelpers', () => {
  describe('defaultBlobContentReaderAsString', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideBlobHelpers()] });
    });

    it(`should return the content of the input blob`, () => {
      const item = {
        name: 'testing',
        id: 13
      };
      const data = new TextEncoder().encode(JSON.stringify(item));

      const blob = new Blob([data]);

      const reader = TestBed.inject(BLOB_CONTENT_READER_AS_STRING) as BlobContentReaderAsString;

      reader(blob).subscribe((value) => {
        expect(value).toEqual(JSON.stringify(item));
      });
    });
  });
});
