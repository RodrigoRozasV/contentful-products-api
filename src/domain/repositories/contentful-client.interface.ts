export interface ContentfulProduct {
  id: string;
  name: string;
  category?: string;
  price?: number;
  description?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentfulClient {
  fetchProducts(): Promise<ContentfulProduct[]>;
}
