import { Injectable, RendererFactory2, RendererType2 } from '@angular/core';
import { AbstractRenderer } from './abstract-renderer';
import { IRendererFactory, RendererType } from './renderer-factory';

/**
 * Master factory that manages and provides access to all renderer types
 */
@Injectable({ providedIn: 'root' })
export class RendererFactoryManager implements RendererFactory2 {
    private factories: Map<RendererType, IRendererFactory> = new Map();
    private defaultType: RendererType = RendererType.PDF; // PDF is the default renderer

    /**
     * Register a renderer factory
     */
    registerFactory(factory: IRendererFactory): void {
        this.factories.set(factory.rendererType, factory);
        console.log(`[RendererFactoryManager] Registered renderer factory for type: ${factory.rendererType}`);
    }

    /**
     * Set the default renderer type
     */
    setDefaultType(type: RendererType): void {
        if (!this.factories.has(type)) {
            console.warn(`[RendererFactoryManager] Cannot set default type to ${type} as no factory is registered for it`);
            return;
        }
        this.defaultType = type;
        console.log(`[RendererFactoryManager] Default renderer type set to: ${type}`);
    }

    /**
     * Create a renderer of the specified type, or the default type if none is specified
     */
    createRenderer(hostElement: any, type: RendererType2 | null, rendererType?: RendererType): AbstractRenderer {
        const targetType = rendererType || this.defaultType;
        const factory = this.factories.get(targetType);

        if (!factory) {
            throw new Error(`No renderer factory registered for type: ${targetType}`);
        }

        console.log(`[RendererFactoryManager] Creating renderer of type: ${targetType}`);
        return factory.createRenderer(hostElement, type);
    }
}