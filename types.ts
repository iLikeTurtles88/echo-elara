export interface ArtPiece {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  year: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewState {
  HOME = 'HOME',
  GALLERY = 'GALLERY',
  ABOUT = 'ABOUT',
}