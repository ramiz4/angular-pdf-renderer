import { RendererFactory2, RendererType2 } from '@angular/core';
import { AbstractRenderer } from './abstract-renderer';

/**
 * The RendererType enum defines the available renderer types in the system.
 * This can be extended with new renderer types as they are implemented.
 */
export enum RendererType {
    PDF = 'pdf',
    // Future renderer types:
    // IOS = 'ios',
    // ANDROID = 'android',
    // SVG = 'svg',
    // etc.
}

/**
 * Interface for renderer factories that create specific renderer instances
 */
export interface IRendererFactory {
    /**
     * Creates a renderer of the specific type
     */
    createRenderer(hostElement: any, type: RendererType2 | null): AbstractRenderer;

    /**
     * The type of renderer this factory creates
     */
    readonly rendererType: RendererType;
}

/**
 * Abstract factory for creating renderer instances
 * This class provides a foundation for platform-specific renderer factories
 */
export abstract class AbstractRendererFactory implements RendererFactory2 {
    protected renderer: AbstractRenderer | null = null;

    /**
     * Create a renderer instance
     */
    abstract createRenderer(hostElement: any, type: RendererType2 | null): AbstractRenderer;

    /**
     * Get the type of renderer this factory creates
     */
    abstract get rendererType(): RendererType;
}