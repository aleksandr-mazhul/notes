export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  hidden: boolean;
  tags: string[];
}
