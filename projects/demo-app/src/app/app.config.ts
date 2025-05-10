import { ApplicationConfig, RendererFactory2 } from '@angular/core';
import { PdfRendererFactory } from './renderers/pdf/pdf-renderer-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RendererFactory2, useClass: PdfRendererFactory },
  ]
};
