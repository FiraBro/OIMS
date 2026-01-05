import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/applicationService";
import { toast } from "react-toastify";

export const useApplications = (filters = {}) => {
  const queryClient = useQueryClient();

  // --- 1️⃣ Query: My Applications (User View) ---
  const myApplicationsQuery = useQuery({
    queryKey: ["applications-me"],
    queryFn: applicationService.getMyApplications,
    staleTime: 60000,
  });

  // --- 2️⃣ Query: All Applications (Admin View) ---
  const adminApplicationsQuery = useQuery({
    // FIX: Explicitly list search and page in the key to trigger refetch
    queryKey: [
      "applications-admin",
      filters.page,
      filters.search,
      filters.isAdmin,
    ],
    queryFn: () => applicationService.listApplications(filters),
    enabled: !!filters.isAdmin,
    placeholderData: (prev) => prev,
  });

  // --- 3️⃣ Mutations ---
  const applyMutation = useMutation({
    mutationFn: (formData) => applicationService.applyForPolicy(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-me"] });
      toast("Application submitted successfully!");
    },
    onError: (error) =>
      toast(error.response?.data?.message || "Application failed"),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => applicationService.approveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-admin"] });
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast("Application approved");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => applicationService.rejectApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-admin"] });
      toast("Application rejected");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => applicationService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-admin"] });
      toast("Application deleted");
    },
  });

  return {
    adminApplications: adminApplicationsQuery.data?.applications || [],
    meta: {
      total: adminApplicationsQuery.data?.total || 0,
      totalPages: adminApplicationsQuery.data?.totalPages || 1,
    },
    isLoading: adminApplicationsQuery.isLoading,
    // Combined processing state for UI feedback
    isProcessing:
      approveMutation.isPending ||
      rejectMutation.isPending ||
      deleteMutation.isPending ||
      applyMutation.isPending,

    approve: approveMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    apply: applyMutation.mutateAsync,
  };
};
