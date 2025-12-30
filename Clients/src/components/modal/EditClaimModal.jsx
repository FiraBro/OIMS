import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  Info,
} from "lucide-react";
import { format } from "date-fns";

export default function EditClaimModal({ claim, open, onClose }) {
  if (!claim) return null;

  const formatDate = (date) =>
    date ? format(new Date(date), "MMMM dd, yyyy") : "—";

  // Dynamic color matching for the top banner
  const getBannerColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 border-green-100";
      case "rejected":
        return "bg-red-50 border-red-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border border-gray-200 bg-white p-0 overflow-hidden shadow-2xl">
        {/* Header Banner - Dynamic based on status */}
        <div className={`p-6 border-b ${getBannerColor(claim.status)}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Official Claim Record
                </span>
              </div>
              <DialogTitle className="text-2xl font-black text-gray-900">
                {claim.claimType} Request
              </DialogTitle>
              <p className="text-xs text-gray-500 font-mono">ID: {claim._id}</p>
            </div>
            <Badge className="px-4 py-1 text-sm capitalize font-bold">
              {claim.status}
            </Badge>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-tight">
                <User className="w-3 h-3 text-gray-400" /> Claimant Information
              </p>
              <p className="font-semibold text-gray-800 text-base border-l-2 border-blue-500 pl-3">
                {claim.user?.fullName || "Guest User"}
              </p>
              <p className="text-xs text-gray-500 pl-3">
                {claim.user?.email || "No email provided"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-tight">
                <ShieldCheck className="w-3 h-3 text-gray-400" /> Policy
                Reference
              </p>
              <p className="font-semibold text-gray-800 text-base border-l-2 border-purple-500 pl-3">
                {claim.policyNumber}
              </p>
              <p className="text-xs text-gray-400 pl-3 text-mono">
                Ref: {claim.policyId?.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-tight">
                <Calendar className="w-3 h-3 text-gray-400" /> Submission Date
              </p>
              <p className="font-semibold text-gray-800 pl-3">
                {formatDate(claim.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-tight">
                <DollarSign className="w-3 h-3 text-gray-400" /> Claimed Amount
              </p>
              <p className="font-black text-xl text-gray-900 pl-3">
                ${claim.amount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-3 pt-4 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight flex items-center gap-2">
              <Info className="w-3 h-3" /> Incident Description
            </p>
            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed shadow-sm">
              {claim.reason ||
                "The claimant did not provide a specific reason for this request."}
            </div>
          </div>

          {/* Dynamic Evidence/Documents Section */}
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
              Supporting Evidence
            </p>
            {claim.documentUrl ? (
              <a
                href={claim.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
              >
                <div className="bg-blue-600 p-2.5 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    View Attached Document
                  </p>
                  <p className="text-xs text-gray-400">
                    Click to open in new tab
                  </p>
                </div>
              </a>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-xs text-gray-400 italic">
                  No digital documents were attached to this claim.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Close Record
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
