import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "@/services/tickerService";
import { toast } from "react-toastify";

export const useTickets = (ticketId = null, fetchAll = false) => {
  const queryClient = useQueryClient();

  // 1. User's personal tickets
  const { data: myTickets, isLoading: isLoadingMy } = useQuery({
    queryKey: ["tickets", "mine"],
    queryFn: ticketService.getMyTickets,
    select: (res) => res?.data || res,
  });

  // 2. Admin Global Queue (UNLOCKED)
  const { data: allTickets, isLoading: isLoadingAll } = useQuery({
    queryKey: ["tickets", "all"],
    queryFn: ticketService.getAllTickets,
    select: (res) => res?.data || res,
    enabled: fetchAll, // Only runs when we pass 'true' from the Admin page
  });

  // 3. Live Chat History
  const { data: ticketDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["tickets", "detail", ticketId],
    queryFn: () => ticketService.getTicketDetails(ticketId),
    enabled: !!ticketId,
    select: (res) => res?.data || res,
    refetchInterval: 3000, // This keeps the chat "Live"
  });

  // Mutations (Reply, Status, Create)
  const replyMutation = useMutation({
    mutationFn: ({ id, message, sender }) =>
      ticketService.replyToTicket(id, message, sender),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tickets", "detail", variables.id],
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => ticketService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Status updated");
    },
  });

  return {
    myTickets,
    allTickets,
    ticketDetails,
    isLoading: isLoadingMy || isLoadingAll,
    isLoadingDetails,
    replyToTicket: replyMutation.mutate,
    isReplying: replyMutation.isPending,
    updateStatus: statusMutation.mutate,
  };
};
