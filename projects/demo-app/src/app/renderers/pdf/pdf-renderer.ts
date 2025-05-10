import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AbstractRenderer } from '../core/abstract-renderer';

export class PdfRenderer extends AbstractRenderer {
    private pdfDoc!: PDFDocument;
    private page: any;
    private font: any;
    private cursorY = 800;
    private iframe: HTMLIFrameElement | null = null;

    constructor() {
        super();
        this.init();
    }

    override async init(): Promise<void> {
        try {

            if (this.initialized) {
                console.warn(`[PdfRenderer] PDF Document already initialized. Skipping initialization.`);
                return;
            }

            this.pdfDoc = await PDFDocument.create();
            this.page = this.pdfDoc.addPage(PageSizes.A4);
            this.font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);

            this.initialized = true;

            this.displayPdf();

            console.log(`[PdfRenderer] PDF Document initialized successfully.`);
        } catch (error) {
            console.error(`[PdfRenderer] Initialization failed:`, error);
            throw error;
        }
    }

    /**
     * Displays the PDF in the iframe that was created by selectRootElement
     */
    private async displayPdf(): Promise<void> {
        console.log('[PdfRenderer] Displaying PDF in iframe');

        // Get the PDF bytes
        const bytes = await this.pdfDoc.save();

        // Create a blob and URL
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Find the iframe (ensure it exists)
        this.iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;

        if (!this.iframe) {
            console.error('[PdfRenderer] Failed to find pdf-iframe element');
            return;
        }

        // Set the source and log info when loaded
        this.iframe.src = url;
        this.iframe.onload = () => {
            const pageCount = this.pdfDoc.getPageCount();
            console.log(`[PdfRenderer] PDF has ${pageCount} pages and is now displayed.`);
        };
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
                let textColor = rgb(0, 0, 0); // Default color (black)

                if (node.parent?.type === 'element') {
                    // Apply different font sizes based on element type
                    if (node.parent.attributes?.['name'] === 'h1') {
                        fontSize = 24;
                    } else if (node.parent.attributes?.['name'] === 'h2') {
                        fontSize = 20;
                    } else if (node.parent.attributes?.['name'] === 'h3') {
                        fontSize = 18;
                    }

                    // Apply text color if specified in parent's style
                    if (node.parent.styles?.color) {
                        const color = node.parent.styles.color.trim().toLowerCase();
                        if (color === 'red') {
                            textColor = rgb(1, 0, 0); // Red color
                        } else if (color.startsWith('#')) {
                            // Handle hex colors (basic implementation)
                            try {
                                const hex = color.substring(1);
                                const r = parseInt(hex.substring(0, 2), 16) / 255;
                                const g = parseInt(hex.substring(2, 4), 16) / 255;
                                const b = parseInt(hex.substring(4, 6), 16) / 255;
                                textColor = rgb(r, g, b);
                            } catch (e) {
                                console.warn(`[PdfRenderer] Failed to parse color: ${color}`);
                            }
                        }
                        // Add more color handling as needed
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
                            color: textColor,
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
                        color: textColor,
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
        const rootElement = document.getElementsByTagName(selectorOrNode)[0];
        rootElement.setAttribute('class', 'container');
        
        const iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'pdf-iframe');

        rootElement.appendChild(iframe);
        console.log(`[PdfRenderer] Root element selected: ${selectorOrNode}`);
        return { type: 'root', children: [] };
    }

    override setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
        // Store attributes in the element if needed
        if (el && typeof el === 'object') {
            el.attributes = el.attributes || {};
            el.attributes[name] = value;

            // Parse style attribute to extract individual CSS properties
            if (name === 'style') {
                el.styles = el.styles || {};
                const stylePairs = value.split(';');

                for (const pair of stylePairs) {
                    const [propName, propValue] = pair.split(':').map(s => s.trim());
                    if (propName && propValue) {
                        el.styles[propName] = propValue;
                    }
                }
            }
        }
    }

    override removeAttribute(el: any, name: string, namespace?: string | null): void {
        if (el && el.attributes) {
            delete el.attributes[name];

            // Clear style properties if style attribute is removed
            if (name === 'style' && el.styles) {
                el.styles = {};
            }
        }
    }
}