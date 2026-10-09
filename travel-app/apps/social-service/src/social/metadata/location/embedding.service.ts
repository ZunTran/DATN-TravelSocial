import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private extractor: any;
  private loadingPromise: Promise<any> | null = null;

  private async getExtractor() {

    if (this.extractor) {
      return this.extractor;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      console.log('[EmbeddingService] Loading BGE-M3...');

      const { pipeline } = await import(
        '@huggingface/transformers'
      );

      const extractor = await pipeline(
        'feature-extraction',
        'Xenova/bge-m3',
      );

      this.extractor = extractor;

      console.log('[EmbeddingService] BGE-M3 loaded');

      return extractor;
    })();

    try {
      return await this.loadingPromise;
    } catch (error) {
      this.loadingPromise = null;

      console.error(
        '[EmbeddingService] Failed to load BGE-M3',
        error,
      );

      throw error;
    }
  }

  async embed(text: string): Promise<number[]> {
    const extractor = await this.getExtractor();

    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  }
}