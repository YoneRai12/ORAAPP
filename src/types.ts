export type UserProfile = {
  name: string;
  email: string;
  picture?: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
};

export type Message = {
  id: string;
  text: string;
  createdAt: string;
  from: 'user' | 'assistant';
  attachments?: Attachment[];
  webSearchEnabled?: boolean;
};
