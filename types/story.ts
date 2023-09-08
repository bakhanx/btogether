import { Story } from "@prisma/client";

export interface StoryWithUser extends Story {
  user: {
    name: string;
    id: number;
  };
  _count: {
    likes: number;
    comments: number;
  };
}
export type StoryResponse = {
  ok: boolean;
  stories: StoryWithUser[];
  pages: number;
};

export type StoryUploadForm = {
  content: string;
}

export type StoryUploadResponse = {
  ok: boolean;
  revalidated?: boolean;
  story: Story;
}