import { Injectable, RendererFactory2 } from '@angular/core';
import { PdfRenderer } from './pdf-renderer';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
    public renderer: PdfRenderer;

    constructor(factory: RendererFactory2) {
        this.renderer = factory.createRenderer(null, null) as PdfRenderer;
    }

    async retrievePdf() {
        return await this.renderer.savePdf();
    }
}
