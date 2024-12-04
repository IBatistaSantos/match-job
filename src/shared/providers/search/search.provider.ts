export interface SearchData {
  id: string;
  score: number;
}

export interface SearchProvider {
  index(id: string, content: number[]): Promise<void>;
  search(content: number[]): Promise<SearchData[]>;
}
