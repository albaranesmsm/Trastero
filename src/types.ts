export interface Item {
  id: string;
  name: string;
  quantity: number;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  items: Item[];
}
