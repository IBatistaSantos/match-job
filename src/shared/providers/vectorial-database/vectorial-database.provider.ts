export interface VectorialDatabaseOutput {
  id: string;
  score: number;
}

export interface VectorialDatabase {
  index(id: string, content: number[]): Promise<void>;
  search(content: number[]): Promise<VectorialDatabaseOutput[]>;
}
