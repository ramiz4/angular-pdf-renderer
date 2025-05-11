<div align="center">

# 🚀 Angular Custom Renderer Framework

<img src="https://angular.io/assets/images/logos/angular/angular.svg" width="100" height="100" alt="Angular Logo">

**A comprehensive framework for implementing custom renderers in Angular applications**

[![Angular](https://img.shields.io/badge/Framework-Angular-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PDF-Lib](https://img.shields.io/badge/Library-PDF--Lib-ff0000?style=flat-square)](https://pdf-lib.js.org/)

</div>

<hr>

## 🔍 Project Purpose

This framework demonstrates:
- ✅ A modular architecture for implementing custom renderers in Angular applications
- ✅ An abstract renderer base class that simplifies creation of new renderers
- ✅ A complete PDF renderer implementation using pdf-lib
- ✅ A factory pattern for managing and instantiating different renderer types
- ✅ Advanced techniques for translating Angular component trees into different output formats

## 💡 Key Architectural Components

The framework consists of several key components:

| Component | Description |
|-----------|-------------|
| **AbstractRenderer** | Base class implementing Angular's Renderer2 interface with common functionality |
| **RendererFactory** | Creates and manages renderer instances based on rendering context |
| **PdfRenderer** | Concrete implementation for PDF document generation |
| **Demo Application** | Showcases the renderer capabilities in a real Angular application |

## 🛠️ Implementation Details

### AbstractRenderer

The `AbstractRenderer` class provides:
- A common foundation for all custom renderers
- Asynchronous initialization pattern with safeguards
- Default implementations for optional Renderer2 methods
- Clear extension points for specialized renderers

### PDF Renderer

The PDF renderer implementation:
- Creates PDF documents using the pdf-lib library
- Handles text styling and layout
- Supports hierarchical component structures
- Renders styled text with font size variations
- Displays the generated PDF directly in the application

## 🏃‍♂️ Development Server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 📋 Using the Custom Renderer Framework

### Configure the renderer in your application

Simply configure the custom renderer in your application's configuration:

```typescript
// In your app.config.ts
import { ApplicationConfig, RendererFactory2 } from '@angular/core';
import { PdfRendererFactory } from './renderers/pdf/pdf-renderer-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RendererFactory2, useClass: PdfRendererFactory },
  ]
};
```

That's it! The PDF renderer works automatically in the background, handling the rendering process without requiring additional code. When you use Angular's standard component approach, the PDF renderer will intercept and translate your components into PDF format.

## 🌈 Extending with New Renderers

The framework makes it easy to add new renderers:

1. **Create a new renderer class that extends AbstractRenderer**
2. **Implement the required abstract methods**
3. **Register the renderer with the RendererFactory**

### Example: Creating a New Renderer

```typescript
export class MyNewRenderer extends AbstractRenderer {
  // Implement abstract methods
  async init(): Promise<void> {
    // Initialize your renderer
    this.initialized = true;
  }
  
  async setValue(node: any, value: string): Promise<void> {
    // Implement your rendering logic
  }
  
  createElement(name: string): any {
    // Create an element in your target format
  }
  
  createText(value: string): any {
    // Create a text node in your target format
  }
  
  appendChild(parent: any, newChild: any): void {
    // Handle parent-child relationships
  }
}
```

## ⏭️ Next Steps

<div align="center">

### 🛣️ Roadmap for Framework Enhancement
</div>

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Enhanced Style Handling** | Improved CSS styling support across different renderers |
| 2 | **Image Support** | Add capabilities for embedding images in rendered outputs |
| 3 | **Form Elements** | Support for interactive form elements in appropriate output formats |
| 4 | **Animation Support** | Framework for animations in compatible renderer formats |
| 5 | **Native Mobile Renderers** | Implementation of iOS and Android native renderers |
| 6 | **SVG Renderer** | Support for SVG output format |
| 7 | **Performance Optimizations** | Optimize rendering pipeline for speed and memory efficiency |
| 8 | **Testing Utilities** | Tools for testing custom renderers |
| 9 | **Documentation Generator** | Automated documentation generation for renderer capabilities |

## 📚 Additional Resources

- [Angular Renderer2 Documentation](https://angular.dev/api/core/Renderer2)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

<div align="center">

## 👥 Contributing

Contributions to this custom renderer framework are welcome! Whether you're fixing bugs, adding features, or creating new renderer implementations.

<hr>

<sub>Made with ❤️ by the Angular community</sub>

</div>
