// src/app/pdf-renderer.ts
import { ListenerOptions, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export class PdfRenderer implements Renderer2 {

    private pdfDoc!: PDFDocument;
    private page: any;
    private font: any;
    private cursorY = 800;
    private initPromise: Promise<void>;
    private initialized = false;

    getPdfDoc() {
        return this.pdfDoc;
    }

    constructor() {
        // Store the init promise reference so we can await it in other methods
        this.initPromise = this.init();
    }

    async init(): Promise<void> {
        try {
            this.pdfDoc = await PDFDocument.create();
            this.page = this.pdfDoc.addPage(PageSizes.A4);
            const { _, height } = this.page.getSize()
            const fontSize = 30
            this.font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);

            // Add debug watermark to confirm initialization
            this.page.drawText('PDF Renderer Initialized', {
                x: 50,
                y: height - 2 * fontSize,
                size: fontSize,
                font: this.font,
                color: rgb(0, 0.53, 0.7),
            });

            this.cursorY = height - 3 * fontSize; // Set initial cursor position

            this.initialized = true;
            console.log(`[PdfRenderer] PDF Document initialized successfully.`);
        } catch (error) {
            console.error(`[PdfRenderer] Initialization failed:`, error);
            throw error;
        }
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initPromise;
        }
    }

    async setValue(node: any, value: string): Promise<void> {
        await this.ensureInitialized();

        if (node.type === 'element') {
            // Handle element rendering
            for (const child of node.children) {
                // Use child.value if it exists, otherwise pass the 'value' parameter
                await this.setValue(child, child.value || value);
            }
        } else if (node.type === 'text') {
            // Only draw text if we have a non-empty value
            if (value && value.trim().length > 0) {

                const { _, height } = this.page.getSize()
                const fontSize = 14

                // Draw the text at the current cursor position
                await this.page.drawText(value, {
                    x: 50,
                    y: this.cursorY, // Adjust Y position for the text
                    size: fontSize,
                    font: this.font,
                    color: rgb(0, 0, 0),
                });
                // Move the cursor down for the next line of text
                this.cursorY -= height - 2 * fontSize; // Move down for the next line

            } else {
                // If the value is empty, just log a warning and do not draw anything
                console.warn(`[PdfRenderer] Empty value provided for text node. Skipping rendering.`);
            }
        }

        console.log(`[PdfRenderer] Value set: ${value}`);
    }

    async savePdf(): Promise<Uint8Array> {
        console.warn(`[PdfRenderer] Saving PDF...`);
        await this.ensureInitialized();

        // Save the PDF document
        const bytes = await this.pdfDoc.save();
        console.log(`[PdfRenderer] PDF saved successfully.`);
        return bytes;
    }

    // Implement required methods of Renderer2
    createElement(name: string, namespace?: string | null): any {
        return { type: name, children: [] };
    }

    createText(value: string): any {
        return { type: 'text', value: value || '' };
    }

    appendChild(parent: any, newChild: any): void {
        parent.children.push(newChild);
    }

    get data(): { [key: string]: any; } {
        console.warn('Method not implemented.');
        return {};
    }

    destroy(): void {
        console.warn('Method not implemented.');
    }

    createComment(value: string) {
        console.warn('Method not implemented.');
    }

    destroyNode!: ((node: any) => void) | null;

    insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean): void {
        console.warn('Method not implemented.');
    }

    removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
        console.warn('Method not implemented.');
    }

    selectRootElement(selectorOrNode: string | any, preserveContent?: boolean) {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="container">
            <iframe id="pdf-iframe"></iframe>
        </div>
        `;
        document.body.appendChild(div);
        console.warn(`[PdfRenderer] Root element selected: ${selectorOrNode}`);
        return { type: 'root', children: [] };
    }

    parentNode(node: any) {
        console.warn('Method not implemented.');
    }

    nextSibling(node: any) {
        console.warn('Method not implemented.');
    }

    setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
        // Optional: store attributes in the element if needed
        if (el && typeof el === 'object') {
            el.attributes = el.attributes || {};
            el.attributes[name] = value;
        }
    }

    removeAttribute(el: any, name: string, namespace?: string | null): void {
        if (el && el.attributes) {
            delete el.attributes[name];
        }
    }

    addClass(el: any, name: string): void {
        console.warn('Method not implemented.');
    }

    removeClass(el: any, name: string): void {
        console.warn('Method not implemented.');
    }

    setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
        console.warn('Method not implemented.');
    }

    removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
        console.warn('Method not implemented.');
    }

    setProperty(el: any, name: string, value: any): void {
        console.warn('Method not implemented.');
    }

    listen(target: 'window' | 'document' | 'body' | any, eventName: string, callback: (event: any) => boolean | void, options?: ListenerOptions): () => void {
        // Since the PDF has no interactivity, just log and return noop unsubscribe
        console.warn(`[PdfRenderer] Event binding ignored: (${eventName})`);
        return () => {
            // noop unsubscribe
        };
    }
}
