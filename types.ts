/* eslint-disable prettier/prettier */
export enum ContentType {
  TEXT = 'text',
  CHECKLIST = 'checklist',
  IMAGE = 'image',
  AUDIO = 'audio',
}

export interface ContentBlock {
  id: string;
  type: ContentType;
  props: BlockProps;
}

export interface Note {
  id: string;
  title: string;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface BlockProps {
  text?: string;
  placeholder?: string;
  isExpanded?: boolean;
  focus?: boolean;
  title?: string;
  items?: ChecklistItem[];
  uri?: string;
  duration?: number;
}

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};
