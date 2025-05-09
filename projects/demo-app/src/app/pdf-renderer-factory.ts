import { Renderer2, RendererFactory2, RendererType2 } from "@angular/core";
import { PdfRenderer } from "./pdf-renderer";

export class PdfRendererFactory implements RendererFactory2 {
    private renderer: PdfRenderer | null = null;
    
    createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
        // Return cached instance if it exists
        if (this.renderer) {
            console.info(`[PdfRendererFactory] Returning existing renderer instance`);
            return this.renderer;
        }
        
        // Create new instance and cache it
        this.renderer = new PdfRenderer();
        return this.renderer;
    }
}
