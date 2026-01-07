import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import { addFAQ, fetchFAQs, editFAQ } from "../controllers/faqController.js";
import { protect, restrictTo } from "../middlewares/protect.js";
import { ROLES } from "../constants/roles.js";
const router = express.Router();

/**
 * All routes below would typically be protected by an authentication middleware
 */
router.use(protect);

// --- CUSTOMER & GENERAL ENDPOINTS ---

router
  .route("/")
  /** @route POST /api/v1/support/tickets - Create a new ticket */
  .post(ticketController.createTicket)

  /** @route GET /api/v1/support/tickets - List my tickets (Customer) or all tickets (Agent) */
  .get(ticketController.getAllTickets);

router
  .route("/:id")
  /** @route GET /api/v1/support/tickets/:id - Get full conversation and ticket details */
  .get(ticketController.getTicketDetails);

router
  .route("/:id/messages")
  /** @route POST /api/v1/support/tickets/:id/messages - Add a reply to a ticket */
  .post(ticketController.addReply);

// --- AGENT & ADMIN ONLY ENDPOINTS ---

/** @route PATCH /api/v1/support/tickets/:id/status - Update ticket status (Staff Only) */
router.patch(
  "/:id/status",
  // authorize('agent', 'admin'),
  ticketController.updateStatus
);

/** @route PATCH /api/v1/support/tickets/:id/assign - Assign ticket to an agent */
router.patch(
  "/:id/assign",
  // authorize('admin'),
  ticketController.assignTicket
);
router.get("/", fetchFAQs);

// Protected Admin routes: Only staff can manage the content
router.post("/faqs", protect, restrictTo(ROLES.ADMIN), addFAQ);
router.patch("/faqs/:id", protect, restrictTo(ROLES.ADMIN), editFAQ);

export default router;
