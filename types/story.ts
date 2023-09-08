import { Comment, Story, User } from "@prisma/client";

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
export type StoryListResponse = {
  ok: boolean;
  stories: StoryWithUser[];
  pages: number;
};

export type StoryUploadForm = {
  content: string;
};

export type StoryUploadResponse = {
  ok: boolean;
  revalidated?: boolean;
  story: Story;
};

export interface StoryCommentWithUser extends Comment {
  user: User;
}

export type StoryResponse = {
  ok: boolean;
  story: storyDetail;
  isLike: boolean;
};
export interface storyDetail extends Story {
  _count: {
    likes: number;
    comments: number;
  };
  user: User;
  comments: StoryCommentWithUser[];
}

export type StoryCommentForm = {
  comment: string;
};
export type StoryCommentFormError = {
  comment?: {
    type?: string;
    message?: string;
  };
};
export type StoryCommentResponse = {
  ok: boolean;
  createComment?: Comment;
  deleteComment?: Comment;
};

export interface StoryCommentListResponse {
  ok: true;
  story: {
    comments: StoryCommentWithUser[];
    _count: {
      comments: number;
    };
  };
  pages: number;
}
