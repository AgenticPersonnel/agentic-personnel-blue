export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ServiceCard {
  title: string;
  description: string;
  features: string[];
  icon?: string;
}

export interface ProblemCard {
  title: string;
  description: string;
  icon?: string;
}

export interface SolutionPillar {
  title: string;
  description: string;
  features: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface Resource {
  title: string;
  description: string;
  type: 'guide' | 'template' | 'calculator' | 'webinar';
  downloadUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  featured_image_url: string | null;
  status: string;
  season: string | null;
  publish_date: string | null;
  published_at: string | null;
  content: string | null;
}

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
}