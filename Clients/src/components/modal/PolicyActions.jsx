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
import { motion } from "framer-motion";

export default function PolicyActions({ policy }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleRenew = () => {
    // 🔹 Replace this with your renewal API call
    console.log("Renewing policy:", policy.policyNumber);
    alert(`Renewal triggered for ${policy.policyNumber}`);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Renew Policy */}
      <Button
        size="sm"
        variant="secondary"
        className="ml-auto"
        onClick={handleRenew}
      >
        Renew Policy
      </Button>

      {/* View Full Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            View Full Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>{policy.name}</DialogTitle>
              <DialogDescription>
                Detailed info about the policy.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <p>
                <strong>Policy Number:</strong> {policy.policyNumber}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {policy.planId?.category || policy.category}
              </p>
              <p>
                <strong>Coverage:</strong>{" "}
                {policy.planId?.coverage || policy.coverage}
              </p>
              <p>
                <strong>Premium:</strong> {policy.premium}{" "}
                {policy.currency || "USD"}
              </p>
              <p>
                <strong>Status:</strong> {policy.status}
              </p>
              <p>
                <strong>Start → End:</strong>{" "}
                {new Date(policy.startDate).toLocaleDateString()} →{" "}
                {new Date(policy.endDate).toLocaleDateString()}
              </p>
              {policy.documents?.length > 0 && (
                <div>
                  <strong>Documents:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {policy.documents.map((doc) => (
                      <li key={doc._id}>
                        <a
                          href={doc.url}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogClose asChild>
              <Button className="mt-6 w-full">Close</Button>
            </DialogClose>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
