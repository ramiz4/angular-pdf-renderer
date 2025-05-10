import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AbstractRenderer } from '../core/abstract-renderer';

export class PdfRenderer extends AbstractRenderer {
    private pdfDoc!: PDFDocument;
    private page: any;
    private font: any;
    private cursorY = 800;
    private initPromise: Promise<void>;

    constructor() {
        super();
        // Store the init promise reference so we can await it in other methods
        this.initPromise = this.init();
    }

    getPdfDoc() {
        return this.pdfDoc;
    }

    override async init(): Promise<void> {
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

    override async saveOutput(): Promise<Uint8Array> {
        console.warn(`[PdfRenderer] Saving PDF...`);
        await this.ensureInitialized();

        // Save the PDF document
        const bytes = await this.pdfDoc.save();
        console.log(`[PdfRenderer] PDF saved successfully.`);
        return bytes;
    }

    override async setValue(node: any, value: string): Promise<void> {
        await this.ensureInitialized();

        if (node.type === 'element') {
            // Handle element types differently based on the node type (h1, p, etc.)
            const elementType = node.type === 'element' ? node.attributes?.['name'] || 'div' : node.type;

            // Handle element rendering
            for (const child of node.children) {
                // Use child.value if it exists, otherwise pass the 'value' parameter
                await this.setValue(child, child.value || value);
            }

            // Add extra spacing after block elements
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].includes(elementType)) {
                // Add additional spacing after block elements
                this.cursorY -= 10; // Extra spacing between paragraphs
            }
        } else if (node.type === 'text') {
            // Only draw text if we have a non-empty value
            if (value && value.trim().length > 0) {
                // Determine font size based on parent element type (if available)
                let fontSize = 14; // Default font size
                if (node.parent?.type === 'element') {
                    // Apply different font sizes based on element type
                    if (node.parent.attributes?.['name'] === 'h1') {
                        fontSize = 24;
                    } else if (node.parent.attributes?.['name'] === 'h2') {
                        fontSize = 20;
                    } else if (node.parent.attributes?.['name'] === 'h3') {
                        fontSize = 18;
                    }
                }

                // Handle multi-line text
                const words = value.split(' ');
                let line = '';
                const maxWidth = this.page.getSize().width - 100; // Leave margins

                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const textWidth = this.font.widthOfTextAtSize(testLine, fontSize);

                    if (textWidth > maxWidth && i > 0) {
                        // Draw the line at the current cursor position
                        this.page.drawText(line, {
                            x: 50,
                            y: this.cursorY,
                            size: fontSize,
                            font: this.font,
                            color: rgb(0, 0, 0),
                        });

                        // Move to the next line
                        this.cursorY -= fontSize * 1.2;
                        line = words[i] + ' ';
                    } else {
                        line = testLine;
                    }
                }

                // Draw any remaining text
                if (line.trim().length > 0) {
                    this.page.drawText(line, {
                        x: 50,
                        y: this.cursorY,
                        size: fontSize,
                        font: this.font,
                        color: rgb(0, 0, 0),
                    });

                    // Move the cursor down for the next line of text
                    this.cursorY -= fontSize * 1.2;
                }
            } else {
                // If the value is empty, just log a warning and do not draw anything
                console.warn(`[PdfRenderer] Empty value provided for text node. Skipping rendering.`);
            }
        }

        console.log(`[PdfRenderer] Value set: ${value}`);
    }

    // Implement required methods of Renderer2
    override createElement(name: string, namespace?: string | null): any {
        return { type: 'element', attributes: { name }, children: [] };
    }

    override createText(value: string): any {
        return { type: 'text', value: value || '' };
    }

    override appendChild(parent: any, newChild: any): void {
        if (newChild) {
            // Maintain parent-child relationship to support style inheritance
            newChild.parent = parent;
            parent.children.push(newChild);
        }
    }

    override selectRootElement(selectorOrNode: string | any, preserveContent?: boolean) {
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

    override setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
        // Store attributes in the element if needed
        if (el && typeof el === 'object') {
            el.attributes = el.attributes || {};
            el.attributes[name] = value;
        }
    }

    override removeAttribute(el: any, name: string, namespace?: string | null): void {
        if (el && el.attributes) {
            delete el.attributes[name];
        }
    }
}