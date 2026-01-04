import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnterpriseDashboard } from "@/hooks/useAdmin";
import EnterpriseAnalytics from "./EnerpriseAnalytics";
import SystemSettings from "./SystemSettings";
import { FiBarChart2, FiSettings, FiActivity } from "react-icons/fi";

export default function AdminControlCenter() {
  const { adminData, settings, isLoading, refresh } = useEnterpriseDashboard();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Syncing Enterprise Data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-manrope">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* TOP LEVEL BRANDING */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Control Center
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              IMS Enterprise v2.0 • {settings?.systemName || "Standard Mode"}
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm border hover:bg-slate-50 transition-all"
          >
            <FiActivity className="text-blue-600" /> Live Refresh
          </button>
        </header>

        <Tabs defaultValue="analytics" className="w-full space-y-6">
          <TabsList className="inline-flex h-14 items-center justify-start rounded-2xl bg-white p-1 shadow-sm border border-slate-100">
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold"
            >
              <FiBarChart2 /> Business Intelligence
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold"
            >
              <FiSettings /> System Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="focus-visible:outline-none">
            {/* INJECTING THE ANALYTICS COMPONENT WE BUILT */}
            <EnterpriseAnalytics data={adminData} />
          </TabsContent>

          <TabsContent value="settings" className="focus-visible:outline-none">
            {/* INJECTING THE SETTINGS COMPONENT */}
            <SystemSettings
              initialSettings={settings}
              onUpdateSuccess={refresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
