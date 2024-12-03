export interface EmbeddingProvider {
  embed(resume: string): Promise<number[]>;
}
