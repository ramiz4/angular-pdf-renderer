import { Injectable } from '@angular/core';
import { AbstractRenderer } from './renderers/core/abstract-renderer';
import { RendererType } from './renderers/core/renderer-factory';
import { RendererFactoryManager } from './renderers/core/renderer-factory-manager';
import { PdfRenderer } from './renderers/pdf/pdf-renderer';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
    private _renderer: AbstractRenderer;

    constructor(private factoryManager: RendererFactoryManager) {
        // Get a PDF renderer from the factory manager
        this._renderer = this.factoryManager.createRenderer(null, null, RendererType.PDF);
    }

    // Typed getter for the renderer that casts to the correct type
    get renderer(): PdfRenderer {
        return this._renderer as PdfRenderer;
    }

    // Generic method to retrieve the renderer's output
    async retrievePdf(): Promise<Uint8Array> {
        return await this.renderer.saveOutput();
    }
}
