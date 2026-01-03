import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { policyService } from "@/services/policyService";
import { toast } from "react-toastify";

export const usePolicies = () => {
  const queryClient = useQueryClient();

  // --- QUERIES ---

  // Get current user's policies
  const useMyPolicies = () => {
    return useQuery({
      queryKey: ["policies", "my"],
      queryFn: policyService.getMyPolicies,
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    });
  };

  // List all policies (Admin) - Supports filtering/pagination
  const useAdminPolicies = (query = {}) => {
    return useQuery({
      queryKey: ["policies", "admin", query],
      queryFn: () => policyService.listPolicies(query),
      placeholderData: (previousData) => previousData, // Keeps UI stable while fetching new pages
    });
  };
  console.log("useAdminPolicies function called", useAdminPolicies);

  // Get single policy
  const usePolicy = (id) => {
    return useQuery({
      queryKey: ["policies", id],
      queryFn: () => policyService.getPolicyById(id),
      enabled: !!id, // Only fetch if ID exists
    });
  };

  // --- MUTATIONS ---

  // Generic mutation handler to reduce code repetition
  const usePolicyMutation = (mutationFn, successMsg) => {
    return useMutation({
      mutationFn: ({ id, data }) => mutationFn(id, data),
      onSuccess: () => {
        // Invalidate all policy queries to trigger a fresh background fetch
        queryClient.invalidateQueries({ queryKey: ["policies"] });
        if (successMsg) toast.success(successMsg);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Action failed");
      },
    });
  };

  // Specific Mutations
  const updateStatus = usePolicyMutation(
    (id, status) => policyService.updatePolicyStatus(id, status),
    "Policy status updated successfully"
  );

  const renewPolicy = usePolicyMutation(
    (id, data) => policyService.requestPolicyRenewal(id, data),
    "Renewal request submitted"
  );

  const approveRenewal = usePolicyMutation(
    (id) => policyService.approvePolicyRenewal(id),
    "Policy renewal approved"
  );

  const cancelPolicy = usePolicyMutation(
    (id) => policyService.cancelPolicy(id),
    "Policy has been cancelled"
  );

  const deletePolicy = useMutation({
    mutationFn: (id) => policyService.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy permanently deleted");
    },
  });

  return {
    // Queries
    useMyPolicies,
    useAdminPolicies,
    usePolicy,
    // Mutations
    updateStatus,
    renewPolicy,
    approveRenewal,
    cancelPolicy,
    deletePolicy,
  };
};
