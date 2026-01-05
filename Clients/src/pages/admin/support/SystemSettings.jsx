import React, { useState } from "react";
import {
  FiSave,
  FiSettings,
  FiMail,
  FiGlobe,
  FiPercent,
  FiAlertCircle,
  FiPower,
} from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/adminService";
import { toast } from "react-toastify";

export default function SystemSettings({ initialSettings, onUpdateSuccess }) {
  const [formData, setFormData] = useState(initialSettings || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await adminService.updateSettings(formData);

      // Bot-style Toast: Plain white background with blue progress bar
      toast("Global configurations synchronized", {
        icon: <FiSettings className="text-blue-500" />,
        position: "bottom-left",
        autoClose: 4000,
      });

      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast("Failed to update system settings", {
        position: "bottom-left",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 space-y-8 border border-slate-100">
        {/* Input Sections */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              System Agency Name
            </label>
            <div className="relative">
              <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input
                value={formData.systemName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, systemName: e.target.value })
                }
                className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Support Channel Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input
                value={formData.contactEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Global Tax Input */}
            <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FiPercent size={12} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Global Tax
                </p>
              </div>
              <Input
                type="number"
                value={formData.globalTaxRate || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    globalTaxRate: Number(e.target.value),
                  })
                }
                className="bg-transparent border-none p-0 text-3xl font-black h-auto focus-visible:ring-0"
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div
              className={`p-6 rounded-3xl space-y-1 transition-colors ${
                formData.maintenanceMode ? "bg-red-50" : "bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <FiPower size={12} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Maintenance
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-red-600 cursor-pointer"
                />
              </div>
              <p
                className={`text-xs font-bold mt-2 ${
                  formData.maintenanceMode ? "text-red-600" : "text-slate-400"
                }`}
              >
                {formData.maintenanceMode ? "SYSTEM LOCKED" : "SYSTEM LIVE"}
              </p>
            </div>
          </div>
        </div>

        {/* Commit Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-10 rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all ${
            isSaving ? "bg-slate-400" : "bg-slate-900 hover:bg-blue-600"
          } text-white`}
        >
          {isSaving ? "Syncing Logic..." : "Commit System Changes"}
        </Button>
      </div>
    </div>
  );
}
