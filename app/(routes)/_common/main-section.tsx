"use client";

import { memo, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { formatDistanceToNow } from "date-fns";

import { FolderOpenDotIcon } from "lucide-react";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Spinner } from "@/components/ui/spinner";
import PromptInput from "@/components/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

import { useCreateProject, useGetProjects } from "@/features/use-project";

import { ProjectType } from "@/types/project";

import Header from "./header";

const MainSection = () => {
  const [promptText, setPromptText] = useState<string>("");

  const { user } = useKindeBrowserClient();
  const userId = user?.id;

  const { data: projects, isLoading, isError } = useGetProjects(userId ?? "");
  const { mutate, isPending } = useCreateProject();

  const designSuggestions = [
    {
      label: "Food Delivery",
      icon: "🍔",
      value:
        "Food delivery home feed. Top search bar with location pin. Horizontal scrolling hero carousel of daily deals. Vertical list of restaurants with large food thumbnails, delivery time badges, and rating stars. Floating Action Button (FAB) for cart. Mobile app, single screen. Style: Vibrant and appetizing. Warm colors (orange, red, yellow), rounded card corners, subtle drop shadows to create depth. Friendly and inviting UI.",
    },

    {
      label: "Fitness Tracker",
      icon: "🏋️",
      value:
        "Modern fitness tracking dashboard. Header with user avatar, greeting, and daily streak. Large circular progress indicator showing daily activity goal. Cards for steps, calories burned, workout time, and heart rate. Weekly activity chart and recent workouts section. Bottom navigation for Home, Workouts, Progress, and Profile. Style: Energetic and modern. Dark background with vibrant accent colors, rounded cards, bold typography, and clean data visualization.",
    },

    {
      label: "Travel Planner",
      icon: "✈️",
      value:
        "Travel discovery and trip planning home screen. Large destination search bar at the top. Hero card featuring a recommended destination with full-width photography. Horizontal categories for Beaches, Cities, Mountains, and Adventure. Upcoming trip card showing destination, dates, weather, and countdown. Bottom navigation for Explore, Trips, Saved, and Profile. Style: Premium and adventurous. Large photography, soft gradients, rounded cards, spacious layout, and elegant typography.",
    },

    {
      label: "Finance Dashboard",
      icon: "💳",
      value:
        "Personal finance mobile dashboard. Large account balance at the top with percentage change. Quick action buttons for Send, Receive, Pay, and Add Money. Interactive spending chart followed by recent transactions with merchant icons and amounts. Monthly budget progress card. Bottom navigation for Home, Analytics, Cards, and Profile. Style: Minimal fintech design. Dark navy and emerald accents, clean typography, subtle gradients, glass-style cards, and professional spacing.",
    },

    {
      label: "AI Assistant",
      icon: "✨",
      value:
        "AI personal assistant mobile interface. Minimal header with assistant name and settings button. Central welcome message with animated AI orb. Large prompt input at the bottom with voice, attachment, and send buttons. Suggested prompt cards for writing, research, coding, and planning. Recent conversations below. Style: Futuristic and minimal. Dark interface, purple and blue gradients, glassmorphism, glowing accents, smooth rounded elements, and premium AI product aesthetic.",
    },
  ];

  const handleSuggestionClick = (val: string) => {
    setPromptText(val);
  };

  const handleSumbit = () => {
    if (!promptText) return;
    mutate(promptText);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <Header />
        <div className="relative overflow-hidden pt-28">
          <div
            className="max-w-6xl mx-auto flex flex-col items-center
        justify-center"
          >
            <div className="space-y-3">
              <h1
                className="text-center font-semibold text-4xl truncate-tight
            sm:text-5xl"
              >
                Design mobile apps <br className="md:hidden" />
                <span className="text-primary">in an instant</span>
              </h1>
              <p
                className="mx-auto m-3 max-w-2xl text-center font-medium text-foreground leading-relaxed
            sm:text-lg"
              >
                Take your idea and evolve it into the app of your desires with
                AI.
              </p>
            </div>
            <div className="flex w-full max-w-3xl flex-col items-center gap-8 relative z-50">
              <div className="w-full">
                <PromptInput
                  className="ring-2 ring-primary"
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSumbit}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-5">
                <Suggestions>
                  {designSuggestions.map((s) => (
                    <Suggestion
                      key={s.label}
                      suggestion={s.label}
                      className="text-xs! h-7! px-2.5 pt-1!"
                      onClick={() => handleSuggestionClick(s.value)}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            </div>
            <div
              className="absolute -translate-x-1/2 left-1/2
          w-1250 h-[3000px] top-[80%] -z-10"
            >
              <div
                className="-translate-x-1/2 absolute bottom-[calc(100%-300px)] left-1/2
            h-[2000px] w-[2000px] opacity-20 bg-radial-primary"
              ></div>
              <div
                className="absolute -mt-2.5 size-full rounded-[50%] bg-primary/20 opacity-70
            [box-shadow:0_-15px_24.8px_var(--primary)]"
              ></div>
              <div className="absolute z-0 size-full rounded-[50%] bg-background"></div>
            </div>
          </div>
        </div>

        <div className="w-full py-10">
          <div className="mx-auto max-w-3xl">
            {userId && (
              <div>
                <h1 className="font-medium text-xl tracking-light">
                  Recent Projects
                </h1>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Spinner className="size-10" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {projects?.map((project: ProjectType) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {isError && (
              <p className="text-red-600">Failed to load the Projects!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = memo(({ project }: { project: ProjectType }) => {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div className="h-48 bg-[#eee] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover object-left scale-110"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FolderOpenDotIcon />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold mb-1 w-full truncate line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default MainSection;
