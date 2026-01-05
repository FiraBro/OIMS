import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "react-toastify";

export const useEnterpriseDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [analytics, config] = await Promise.all([
        adminService.getEnterpriseData(),
        adminService.getSettings(),
      ]);
      setAdminData(analytics);
      setSettings(config);
    } catch (error) {
      toast(error.response?.data?.message || "System sync failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { adminData, settings, isLoading, refresh: fetchData };
};
