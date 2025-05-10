import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { PdfRendererService } from './pdf-renderer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DatePipe],
})
export class AppComponent implements AfterViewInit {
  title = 'Angular PDF Renderer';
  description = 'This content is rendered from Angular into a PDF.';
  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  private pdfRendererService = inject(PdfRendererService);

  async ngAfterViewInit(): Promise<void> {
    console.log('ngAfterViewInit called');
    const bytes = await this.pdfRendererService.retrievePdf();

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // render the PDF in the iframe
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;

    if (!iframe) {
      return;
    }

    iframe.src = url;
    iframe.onload = () => {
      const pdfDoc = this.pdfRendererService.renderer.getPdfDoc();
      if (pdfDoc) {
        const pageCount = pdfDoc.getPageCount();
        console.log(`PDF has ${pageCount} pages.`);
      } else {
        console.error('Failed to retrieve PDF document.');
      }
    };
  }
}
