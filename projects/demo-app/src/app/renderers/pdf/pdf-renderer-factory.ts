import { RendererType2 } from '@angular/core';
import { AbstractRendererFactory, RendererType } from '../core/renderer-factory';
import { PdfRenderer } from './pdf-renderer';

export class PdfRendererFactory extends AbstractRendererFactory {
    protected override renderer: PdfRenderer | null = null;

    override createRenderer(hostElement: any, type: RendererType2 | null): PdfRenderer {
        // Return cached instance if it exists
        if (this.renderer) {
            return this.renderer;
        }

        // Create new instance and cache it
        this.renderer = new PdfRenderer();
        console.log(`[PdfRendererFactory] Created new PDF renderer instance`);
        return this.renderer;
    }

    override get rendererType(): RendererType {
        return RendererType.PDF;
    }
}