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
import { motion } from "framer-motion";
import { FiShield, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function PolicyActions({ policy }) {
  const [open, setOpen] = useState(false);

  const plan = policy.planId || {};

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={() => alert("Renew flow")}>
        Renew Policy
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">View Full Details</Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white">
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

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Coverage Summary</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {plan.coverage}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {plan.description}
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
                  <li>Avg Claim Time: {plan.averageClaimTime} days</li>
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

            {/* Documents */}
            {policy.documents?.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-semibold mb-2">Documents</h4>
                  <ul className="list-disc ml-5 text-sm">
                    {policy.documents.map((doc) => (
                      <li key={doc._id}>
                        <a
                          href={doc.url}
                          target="_blank"
                          className="text-indigo-600 underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <DialogClose asChild>
              <Button
                className="mt-8 w-full border-blue-600 cursor-pointer"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
