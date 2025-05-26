export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

export const templates: Template[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and modern design with focus on content',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with elegant typography',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Stand out with vibrant colors and dynamic layouts',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80',
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((template) => template.id === id);
}

export function isValidTemplate(id: string): boolean {
  return templates.some((template) => template.id === id);
}
