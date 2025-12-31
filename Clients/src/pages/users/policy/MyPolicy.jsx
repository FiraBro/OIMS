import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiRefreshCw } from "react-icons/fi";
import { policyService } from "@/services/policyService";
import PolicyActions from "@/components/modal/PolicyActions";
import { useAuthStore } from "@/stores/authStore";

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  // FIX 1: Stable Selectors. Do NOT return a new object {} here.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authReady = useAuthStore((state) => state.authReady);

  // FIX 2: Stable Fetch Function.
  // Functional update for activeTab removes the need for activeTab dependency.
  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await policyService.getMyPolicies();
      const policiesData = res.data || [];
      setPolicies(policiesData);

      setActiveTab((prevTab) => {
        if (policiesData.length > 0 && !prevTab) {
          return policiesData[0]?.planId?.category || "General";
        }
        return prevTab;
      });
    } catch (err) {
      console.error("Failed to fetch policies", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // FIX 3: Effect now relies on primitive values that don't change reference.
  useEffect(() => {
    if (authReady && isAuthenticated) {
      fetchPolicies();
    }
  }, [authReady, isAuthenticated, fetchPolicies]);

  // Derived Categories
  const policyCategories = useMemo(() => {
    const categories = policies.map((p) => p.planId?.category).filter(Boolean);
    return [...new Set(categories)];
  }, [policies]);

  // FIX 4: Safety guard - If categories change and activeTab is now invalid, reset it.
  useEffect(() => {
    if (policyCategories.length > 0 && !policyCategories.includes(activeTab)) {
      setActiveTab(policyCategories[0]);
    }
  }, [policyCategories, activeTab]);

  const filteredPolicies = useMemo(() => {
    if (!activeTab) return policies;
    return policies.filter((p) => p.planId?.category === activeTab);
  }, [policies, activeTab]);

  const getPolicyDetails = (policy) => {
    const plan = policy.planId || {};
    return {
      name: plan.name || policy.name || "Unnamed Policy",
      policyNumber: policy.policyNumber || "N/A",
      status: policy.status || "Active",
      premium: policy.premium || plan.premium || 0,
    };
  };

  if (!authReady || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-gray-500 text-lg">
          Login required to view your policies
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Policies</h1>
          <p className="text-gray-500 mt-2">
            View and manage all your active policies
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchPolicies}
          disabled={loading}
          className="flex items-center gap-2 mt-4 md:mt-0"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {policyCategories.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-6">
            {policyCategories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
                <Badge variant="secondary" className="ml-2">
                  {
                    policies.filter((p) => p.planId?.category === category)
                      .length
                  }
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {policyCategories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-xl" />
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredPolicies.map((policy, idx) => {
                    const details = getPolicyDetails(policy);
                    return (
                      <motion.div
                        key={policy._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="rounded-xl border border-gray-200 hover:shadow-md transition">
                          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1 w-full text-left">
                              <CardTitle className="text-lg font-semibold mb-2">
                                {details.name}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-green-100 text-green-700 border-none">
                                  {details.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  #{details.policyNumber}
                                </span>
                                <span className="text-sm font-medium text-blue-600">
                                  ${details.premium} /{" "}
                                  {policy.planId?.premiumFrequency || "mo"}
                                </span>
                              </div>
                            </div>
                            <PolicyActions policy={policy} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {loading ? "Loading policies..." : "No policies found"}
          </p>
          {!loading && (
            <Button onClick={fetchPolicies}>Refresh Policies</Button>
          )}
        </div>
      )}
    </div>
  );
}
