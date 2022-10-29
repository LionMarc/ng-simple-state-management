import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  describe('when using default precision', () => {
    [
      { value: 345, expected: '345 bytes' },
      { value: 1456, expected: '1.42 KB' },
      { value: 1657988, expected: '1.58 MB' },
      { value: 1424562331, expected: '1.33 GB' }
    ].forEach((item) => {
      it(`should return '${item.expected}' when size value is ${item.value}`, () => {
        const pipe = new FileSizePipe();
        const result = pipe.transform(item.value);
        expect(result).toEqual(item.expected);
      });
    });
  });

  describe('when using custom precision', () => {
    [
      { value: 1657988, precision: 2, expected: '1.58 MB' },
      { value: 1657988, precision: 3, expected: '1.581 MB' },
      { value: 1657988, precision: 4, expected: '1.5812 MB' }
    ].forEach((item) => {
      it(`should return '${item.expected}' when size value is ${item.value}`, () => {
        const pipe = new FileSizePipe();
        const result = pipe.transform(item.value, item.precision);
        expect(result).toEqual(item.expected);
      });
    });
  });
});
