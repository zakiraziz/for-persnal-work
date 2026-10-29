export type Period = "7 days" | "30 days" | "90 days";

export type NavigationItem = {
  label: string;
  icon:
    | "overview"
    | "story"
    | "characters"
    | "thumbnail"
    | "video"
    | "seo"
    | "planner"
    | "analytics"
    | "comments"
    | "settings";
};

export const navigationItems: NavigationItem[] = [
  { label: "Overview", icon: "overview" },
  { label: "Story Studio", icon: "story" },
  { label: "Character Studio", icon: "characters" },
  { label: "Thumbnail Studio", icon: "thumbnail" },
  { label: "Video Studio", icon: "video" },
  { label: "YouTube SEO", icon: "seo" },
  { label: "Content Planner", icon: "planner" },
  { label: "Analytics", icon: "analytics" },
  { label: "Comments", icon: "comments" },
];

export const weeklyViews = [
  { day: "Mon", views: 1820 },
  { day: "Tue", views: 2480 },
  { day: "Wed", views: 2110 },
  { day: "Thu", views: 3360 },
  { day: "Fri", views: 2840 },
  { day: "Sat", views: 4210 },
  { day: "Sun", views: 3780 },
];

export const recentProjects = [
  {
    title: "The Little Cloud Who Found Its Way",
    type: "Animated story",
    views: "12.8K",
    date: "Oct 24, 2024",
    status: "Published",
    art: "cloud",
  },
  {
    title: "5 Tiny Habits That Make a Big Difference",
    type: "Explainer",
    views: "8.2K",
    date: "Oct 21, 2024",
    status: "Published",
    art: "habits",
  },
  {
    title: "A Day in the Life of a Curious Cat",
    type: "Short animation",
    views: "—",
    date: "Last edited Oct 26",
    status: "Draft",
    art: "cat",
  },
];

export const quickActions = [
  {
    title: "Write a Story",
    description: "Turn a spark of an idea into a story.",
    icon: "story",
    color: "violet",
  },
  {
    title: "Generate Thumbnail",
    description: "Explore a look for your next video.",
    icon: "thumbnail",
    color: "blue",
  },
  {
    title: "Plan a Video",
    description: "Shape your next upload, step by step.",
    icon: "video",
    color: "orange",
  },
  {
    title: "Find Video Ideas",
    description: "Collect ideas worth bringing to life.",
    icon: "ideas",
    color: "green",
  },
] as const;
