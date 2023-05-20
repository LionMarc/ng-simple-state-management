import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Logger } from 'ngssm-store';

@Injectable({
  providedIn: 'root'
})
export class AceBuildsLoader {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _initialized = false;

  constructor(@Inject(DOCUMENT) private document: any, private logger: Logger) {}

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  public loadScripts(): Observable<boolean> {
    this.logger.debug(`[ace-editor] trying to get ace, isInitialized=${this._initialized}`);
    if (this._initialized) {
      return this._loading$.asObservable();
    }

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'ace-builds/ace.js';
    script.onload = () => {
      (window as any).ace.config.set('basePath', 'ace-builds');
      (window as any).ace.config.set('workerPath', 'ace-builds');
      this.logger.information(`[ace-editor] ace loaded.`);
      this._loading$.next(false);
    };

    this.logger.information(`[ace-editor] loading ace.`);
    this.document.body.appendChild(script);

    this._initialized = true;
    return this._loading$.asObservable();
  }
}
