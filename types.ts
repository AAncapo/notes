export enum ContentType {
  TEXT = "text",
  CHECKLIST = "checklist",
  IMAGE = "image",
  AUDIO = "audio",
}

export interface ContentBlock {
  id: string;
  type: ContentType;
  content: string;
  checked?: boolean;
  uri?: string;
  duration?: number;
}

export interface Note {
  id: string;
  title: string;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}
