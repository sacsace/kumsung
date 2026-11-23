export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location?: string;
  service?: string;
  schedule?: string;
  files?: string[];
  message: string;
  createdAt: string;
  status?: "new" | "read" | "replied";
  assignee?: string;
};
