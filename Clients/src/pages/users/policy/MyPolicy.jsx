// pages/policies/MyPolicies.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiFileText, FiRefreshCw } from "react-icons/fi";
import { policyService } from "@/services/policyService";
import PolicyActions from "@/components/modal/PolicyActions";
import { useAuth } from "@/contexts/AuthContext";

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const { isAuthenticated, authReady } = useAuth();

  useEffect(() => {
    if (!authReady || !isAuthenticated) return;
    fetchPolicies();
  }, [authReady, isAuthenticated]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await policyService.getMyPolicies();
      console.log("res", res);
      const policiesData = res.data || [];
      setPolicies(policiesData);

      // Set the first category as activeTab initially
      if (policiesData.length > 0) {
        // Get category from planId object
        const firstCategory = policiesData[0]?.planId?.category || "All";
        setActiveTab(firstCategory);
      }
    } catch (err) {
      console.error("Failed to fetch policies", err);
    }
    setLoading(false);
  };

  // Get unique categories dynamically from planId
  const policyCategories = useMemo(() => {
    const categories = policies.map((p) => p.planId?.category).filter(Boolean); // Remove undefined/null

    // Add "All" tab if you want to show all policies
    const uniqueCategories = [...new Set(categories)];

    // Return "All" first, then other categories
    return uniqueCategories.length > 0 ? uniqueCategories : [];
  }, [policies]);

  // Filter policies based on active tab
  const filteredPolicies = useMemo(() => {
    if (!activeTab || activeTab === "All") return policies;
    return policies.filter((p) => p.planId?.category === activeTab);
  }, [policies, activeTab]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US") : "-";

  // Helper to get policy details
  const getPolicyDetails = (policy) => {
    const plan = policy.planId || {};
    return {
      name: plan.name || policy.name || "Unnamed Policy",
      description: plan.description || "No description available",
      coverage: plan.coverage || policy.coverage || "-",
      category: plan.category || "Uncategorized",
      status: policy.status || "Active",
      startDate: policy.startDate,
      endDate: policy.endDate,
      policyNumber: policy.policyNumber || "N/A",
      premium: policy.premium || plan.premium || 0,
      documents: policy.documents || [],
      features: plan.features || [],
      networkSize: plan.networkSize || "N/A",
      deductible: plan.deductible || "N/A",
      coverageAmount: plan.coverageAmount || "N/A",
    };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
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
          className="flex items-center gap-2 mt-4 md:mt-0 border-gray-300"
        >
          <FiRefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""} `}
          />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      {policyCategories.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 max-w-xl mb-6">
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
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card
                      key={i}
                      className="rounded-xl border border-gray-100 animate-pulse"
                    >
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-48" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPolicies.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">
                  No {category} policies found
                </p>
              ) : (
                <div className="grid gap-6">
                  {filteredPolicies.map((policy, idx) => {
                    const details = getPolicyDetails(policy);
                    return (
                      <motion.div
                        key={policy._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <Card className="rounded-xl border border-gray-200 hover:shadow-lg transition">
                          <CardHeader className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold mb-2">
                                {details.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  {details.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-gray-300"
                                >
                                  Policy: {details.policyNumber}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-gray-300"
                                >
                                  Premium: ${details.premium}{" "}
                                  {policy.planId?.premiumFrequency ||
                                    "per month"}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold">{details.name}</p>
                                <p className="text-sm text-gray-500">
                                  Policy: {details.policyNumber} | Premium: $
                                  {details.premium}{" "}
                                  {policy.planId?.premiumFrequency ||
                                    "per month"}
                                </p>
                              </div>

                              {/* Only include the actions modal trigger */}
                              <PolicyActions policy={policy} />
                            </div>
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
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-lg mb-4">No policies found</p>
              <Button onClick={fetchPolicies}>Refresh Policies</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
