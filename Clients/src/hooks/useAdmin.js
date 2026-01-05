import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "react-toastify";

export const useEnterpriseDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);

      // We use Promise.allSettled to ensure that if Analytics fails (for customers),
      // the Settings call still finishes so the Maintenance Page can work.
      const [analyticsRes, settingsRes] = await Promise.allSettled([
        adminService.getEnterpriseData(),
        adminService.getSettings(),
      ]);

      // --- 1. PROCESS SETTINGS (The Maintenance Gate) ---
      if (settingsRes.status === "fulfilled") {
        let rawSettings = settingsRes.value?.data ?? settingsRes.value;

        // Handle case where MongoDB returns an array [ { ... } ]
        if (Array.isArray(rawSettings)) {
          rawSettings = rawSettings[0];
        }

        setSettings(rawSettings);
      }

      // --- 2. PROCESS ANALYTICS ---
      if (analyticsRes.status === "fulfilled") {
        const rawAnalytics = analyticsRes.value?.data ?? analyticsRes.value;
        setAdminData(rawAnalytics);
      }
    } catch (error) {
      console.error("System Sync Error:", error);
      toast.error("Failed to sync system settings", {
        position: "bottom-left",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    adminData,
    settings,
    isLoading,
    refresh: fetchData,
  };
};
