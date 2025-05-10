import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { RendererType } from './renderers/core/renderer-factory';
import { RendererFactoryManager } from './renderers/core/renderer-factory-manager';
import { PdfRendererFactory } from './renderers/pdf/pdf-renderer-factory';

// Factory function to initialize and register the PDF renderer factory
function initializeRendererFactories(manager: RendererFactoryManager, pdfFactory: PdfRendererFactory) {
  return () => {
    // Register the PDF renderer factory with the manager
    manager.registerFactory(pdfFactory);
    // Set as default renderer type
    manager.setDefaultType(RendererType.PDF);
    console.log('PDF renderer factory registered successfully');
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the renderer factory manager
    RendererFactoryManager,
    // Provide the PDF renderer factory
    PdfRendererFactory,
    // Register an APP_INITIALIZER to set up factories before the app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRendererFactories,
      deps: [RendererFactoryManager, PdfRendererFactory],
      multi: true
    }
  ]
};
