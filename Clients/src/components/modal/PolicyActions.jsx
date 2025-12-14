import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiCalendar, FiDollarSign } from "react-icons/fi";
import { policyService } from "@/services/policyService";

export default function PolicyActions({ policy, onPolicyUpdated }) {
  const [open, setOpen] = useState(false);
  const [showRenewForm, setShowRenewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");

  const plan = policy.planId || {};
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  /* ---------------- Submit Renewal ---------------- */
  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    if (!paymentReference) return;

    try {
      setLoading(true);

      const response = await policyService.requestPolicyRenewal(policy._id, {
        paymentReference,
      });

      setShowRenewForm(false);
      setPaymentReference("");

      onPolicyUpdated?.(response.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit renewal request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ---------------- Renewal Button ---------------- */}
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setShowRenewForm((prev) => !prev)}
      >
        {showRenewForm ? "Cancel Renewal" : "Renew Policy"}
      </Button>

      {/* ---------------- Renewal Form ---------------- */}
      <AnimatePresence>
        {showRenewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-3 p-4 border rounded-md bg-gray-50 overflow-hidden"
            onSubmit={handleRenewSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Transfer Reference
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. CBE123456789"
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Renewal"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ---------------- Policy Details Modal ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button size="sm">View Full Details</Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-gray-50 border border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            {/* Header */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {plan.name}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Policy No: {policy.policyNumber}
              </DialogDescription>
            </DialogHeader>

            {/* Status + Category */}
            <div className="flex gap-2 mt-4">
              <Badge className="bg-green-100 text-green-700">
                {policy.status}
              </Badge>
              <Badge variant="outline" className="border-gray-400">
                {plan.category}
              </Badge>
            </div>

            <Separator className="my-6" />

            {/* Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex gap-3 items-start">
                <FiDollarSign className="text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Premium</p>
                  <p className="font-semibold">
                    ${policy.premium} / {plan.premiumFrequency}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <FiCalendar className="text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Validity</p>
                  <p className="font-semibold">
                    {formatDate(policy.startDate)} →{" "}
                    {formatDate(policy.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <FiShield className="text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Coverage Amount</p>
                  <p className="font-semibold">
                    ${plan.coverageAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Coverage Summary */}
            <div>
              <h4 className="font-semibold mb-2">Coverage Summary</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {plan.coverage}
              </p>
            </div>

            {/* Key Info */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2">Policy Details</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>Network Size: {plan.networkSize}</li>
                  <li>Deductible: ${plan.deductible}</li>
                  <li>Claim Settlement: {plan.claimSettlementRatio}%</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.features?.slice(0, 6).map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <DialogClose>
              <Button className="mt-8 w-full border-blue-600" variant="outline">
                Close
              </Button>
            </DialogClose>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
