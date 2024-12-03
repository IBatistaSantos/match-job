export interface SearchProvider {
  index(id: string, content: number[]): Promise<void>;
}
