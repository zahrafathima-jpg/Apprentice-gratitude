export interface DesignOption {
  id: string;
  title: string;
  description: string;
  frontPrompt: string;
  backPrompt: string;
}

export interface GeneratedImage {
  url: string;
  side: 'Front' | 'Back';
}

export enum BrandColor {
  Blue = '#4285F4',
  Red = '#DB4437',
  Yellow = '#F4B400',
  Green = '#0F9D58',
}