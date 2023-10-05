export interface Post {
  layout: string;
  fileName: string;
  title: string;
  description: string;
  author: string;
  authorLink: string;
  image: {
    url: string;
    alt: string;
  };
  pubDate: string;
  tags: string[];
}

export interface LatestPostsProps {
  posts: Post[];
  prevPage?: string | undefined;
  nextPage?: string | undefined;
};

export interface PostSummary {
  title: string;
  pubDate: string;
  image: {
    url: string;
    alt: string;
  };
  fileName: string;
  description: string;
}