import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "@/services/tickerService";
import { toast } from "react-toastify";

// Added 'filters' parameter to the hook
export const useTickets = (ticketId = null, fetchAll = false, filters = {}) => {
  const queryClient = useQueryClient();

  // 1. User's personal tickets (No changes needed here unless you want user-side pagination)
  const { data: myTickets, isLoading: isLoadingMy } = useQuery({
    queryKey: ["tickets", "mine", filters],
    queryFn: () => ticketService.getMyTickets(filters),
    select: (res) => ({
      data: res?.data || [],
      pagination: res?.pagination || { page: 1, pages: 1, total: 0 },
    }),
  });
  console.log("My Tickets Data:", myTickets);

  // 2. Admin Global Queue (UPDATED FOR PAGINATION)
  const {
    data: allTickets,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useQuery({
    // IMPORTANT: Adding 'filters' here makes the query refetch whenever page/search/status changes
    queryKey: ["tickets", "all", filters],
    queryFn: () => ticketService.getAllTickets(filters),
    select: (res) => ({
      data: res?.data || [],
      pagination: res?.pagination || { page: 1, pages: 1, total: 0 },
    }),
    enabled: fetchAll,
    placeholderData: (previousData) => previousData,
  });

  // 3. Live Chat History
  const { data: ticketDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["tickets", "detail", ticketId],
    queryFn: () => ticketService.getTicketDetails(ticketId),
    enabled: !!ticketId,
    select: (res) => res?.data || res,
    // Only poll if the ticket isn't closed to save resources
    refetchInterval: (data) => (data?.status === "CLOSED" ? false : 3000),
  });

  // --- Mutations ---

  const replyMutation = useMutation({
    mutationFn: ({ id, message, sender }) =>
      ticketService.replyToTicket(id, message, sender),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tickets", "detail", variables.id],
      });
    },
    onError: (err) => toast.error(err.message || "Failed to send message"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => ticketService.updateStatus(id, status),
    onSuccess: () => {
      // Invalidate everything under "tickets" to refresh the list and detail views
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket status synchronized");
    },
  });

  return {
    myTickets,
    allTickets, // Returns { data: [], pagination: {} }
    ticketDetails,
    isLoading: isLoadingMy || isLoadingAll,
    isLoadingDetails,
    refetchAll, // Explicit refetch for the "Refresh" button
    replyToTicket: replyMutation.mutate,
    isReplying: replyMutation.isPending,
    updateStatus: statusMutation.mutate,
  };
};
