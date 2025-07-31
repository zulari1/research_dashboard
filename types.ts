
import { User } from '@auth0/auth0-spa-js';

export interface AppUser extends User {}

export interface ResearchRequestPayload {
  email: string;
  topic: string;
  type: string;
  depth: string;
  urgency: string;
}

export interface ResearchResult {
  id: string;
  topic: string;
  status: 'Completed' | 'In Progress';
  progress?: number;
  timeRemaining?: string;
  completedAt?: string;
  pdfUrl?: string;
}
