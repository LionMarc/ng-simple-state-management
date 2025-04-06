import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serviceInfoLoader } from './service-info';

describe('ServiceInfo', () => {
  describe('serviceInfoLoader', () => {
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [provideHttpClient(), provideHttpClientTesting()]
      });
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    it(`should make a GET request to the url set as parameter`, () => {
      const observable = TestBed.runInInjectionContext(() => serviceInfoLoader({}, 'dataSourceKey-for-testing', 'my-service'));
      observable.subscribe((v) => {
        expect(v).toEqual({ serviceName: 'my-service', serviceVersion: '1.0.0', environment: 'dev' });
      });

      httpTestingController.expectOne('my-service').flush({ serviceName: 'my-service', serviceVersion: '1.0.0', environment: 'dev' });
    });
  });
});
