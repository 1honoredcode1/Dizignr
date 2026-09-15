import { useRouter } from "next/navigation";

import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

export const useCreateProject = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios
        .post("/api/project", {
          prompt,
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      router.push(`/project/${data.data.id}`);
    },
    onError: (error) => {
      console.log("Project failed", error);
      toast.add({
        title: "Create Project",
        description: "Failed to create project",
      });
    },
  });
};

export const useGetProjects = (userId: string) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/project");
      return res.data.data;
    },
    enabled: !!userId,
  });
};
