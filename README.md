<div align="center">

# 🚀 Angular Custom Renderer POC

<img src="https://angular.io/assets/images/logos/angular/angular.svg" width="100" height="100" alt="Angular Logo">

**A proof of concept demonstrating custom rendering in Angular applications**

[![Angular](https://img.shields.io/badge/Framework-Angular-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PDF-Lib](https://img.shields.io/badge/Library-PDF--Lib-ff0000?style=flat-square)](https://pdf-lib.js.org/)

</div>

<hr>

## 🔍 Project Purpose

This POC demonstrates:
- ✅ How to implement a custom Angular renderer by extending the Renderer2 interface
- ✅ The architecture needed to swap out Angular's DOM rendering with other output formats
- ✅ A foundation for developing native renderers for iOS, Android, and other platforms
- ✅ Techniques for translating Angular component tree into different output formats

## 💡 Conceptual Advantages

By overriding Angular's default renderer:

| Advantage | Description |
|-----------|-------------|
| **🌐 Write Once, Render Anywhere** | Use standard Angular components but output to different formats/platforms |
| **🏗️ Platform Agnostic** | The same codebase can target web, PDF documents, native mobile apps |
| **⚙️ Leverage Angular Ecosystem** | Use Angular's powerful features (DI, components, services) while outputting to non-DOM targets |
| **📱 Simplified Native Development** | Potential to share more code across web and native platforms |

## 🛠️ Current Implementation

The current POC implements a PDF renderer that:
- Takes Angular component structures and outputs PDF documents
- Handles basic text layout and styling
- Demonstrates the core architecture for custom renderers

<div align="center">
<img src="https://pdf-lib.js.org/assets/github-logo-light.png" width="300" alt="PDF-Lib Logo">
</div>

## 🏃‍♂️ Development Server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 📋 How to Use the Custom Renderer

This POC demonstrates how to use a custom renderer in your Angular components:

### Step 1: Inject the renderer service

```typescript
constructor(private pdfService: PdfRendererService) {}
```

### Step 2: Generate output with the custom renderer

```typescript
async generatePdf() {
  const pdfBytes = await this.pdfService.retrievePdf();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  
  // Display or download the PDF
  window.open(url);
}
```

### Step 3: Create content through the renderer interface

```typescript
async setPdfContent() {
  const rootElement = this.pdfService.renderer.createElement('div');
  const heading = this.pdfService.renderer.createElement('h1');
  const text = this.pdfService.renderer.createText('Hello Custom Renderer!');
  
  this.pdfService.renderer.appendChild(heading, text);
  this.pdfService.renderer.appendChild(rootElement, heading);
  
  await this.pdfService.renderer.setValue(rootElement, '');
}
```

## 🌈 Path to Native Renderers

This POC serves as a foundation for developing native renderers for platforms like iOS and Android:

<div align="center">

### 📱 iOS Renderer
</div>

- Implement a custom renderer that outputs to UIKit/SwiftUI components
- Map Angular components to corresponding iOS native controls
- Handle platform-specific styling and interactions

<div align="center">

### 🤖 Android Renderer
</div>

- Create a renderer that translates components to Android Views/Jetpack Compose
- Manage lifecycle and state across the Angular and Android ecosystems
- Handle Android-specific layouts and interactions

<div align="center">

### 🔄 Cross-Platform Architecture
</div>

- Develop a unified API for targeting multiple platforms
- Create platform-specific renderer implementations that share common structure
- Enable seamless development across web, mobile, and other platforms

## ⏭️ Next Steps

<div align="center">

### 🛣️ Roadmap to Production-Ready Native Renderers
</div>

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Renderer Abstraction Layer** | Create a more robust abstraction that can be implemented for different targets |
| 2 | **Component Mapping System** | Develop a system to map Angular components to platform-specific equivalents |
| 3 | **Layout Engine Integration** | Connect with platform-specific layout engines (UIKit, Android layouts) |
| 4 | **Event Handling** | Implement bidirectional event handling across Angular and native platforms |
| 5 | **Plugin System** | Create a plugin architecture for platform-specific features |
| 6 | **State Management** | Develop a unified state management approach that works across platforms |
| 7 | **Performance Optimizations** | Optimize the rendering pipeline for mobile performance |
| 8 | **Testing Framework** | Build a testing framework that works across all target platforms |
| 9 | **CLI Tools** | Create tooling to generate platform-specific output |
| 10 | **Documentation and Examples** | Comprehensive documentation with examples for different platforms |

## 📚 Additional Resources

- [Angular Custom Renderers Documentation](https://angular.io/api/core/Renderer2)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

<div align="center">

## 👥 Contributing

This is a proof of concept meant to demonstrate the possibilities of custom Angular renderers.  
Contributions, ideas, and feedback on extending this to native platforms are welcome!

<hr>

<sub>Made with ❤️ by the Angular community</sub>

</div>
