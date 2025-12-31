import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiRefreshCw } from "react-icons/fi";
import { policyService } from "@/services/policyService";
import AdminPolicyActions from "@/components/modal/PolicyActions";
export default function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await policyService.listPolicies();
      console.log("All policies:", res);

      const policiesData = res?.policies || [];
      setPolicies(policiesData);

      if (policiesData.length > 0) {
        const firstCategory = policiesData[0]?.planId?.category || "All";
        setActiveTab(firstCategory);
      }
    } catch (err) {
      console.error("Failed to fetch policies", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const policyCategories = useMemo(() => {
    const categories = policies.map((p) => p.planId?.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [policies]);

  // Filter policies by tab
  const filteredPolicies = useMemo(() => {
    if (activeTab === "All") return policies;
    return policies.filter((p) => p.planId?.category === activeTab);
  }, [policies, activeTab]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Policies</h1>
          <p className="text-gray-500 mt-2">
            View and manage all customer policies
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchPolicies}
          disabled={loading}
          className="flex items-center gap-2 mt-4 md:mt-0 border-gray-300"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-2 mb-6">
          {policyCategories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
              <Badge variant="secondary" className="ml-2">
                {category === "All"
                  ? policies.length
                  : policies.filter((p) => p.planId?.category === category)
                      .length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {policyCategories.map((category) => (
          <TabsContent key={category} value={category}>
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse border-gray-200">
                    <CardHeader>
                      <div className="h-5 bg-gray-200 rounded w-40" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-64" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPolicies.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No policies found
              </p>
            ) : (
              <div className="grid gap-6">
                {filteredPolicies.map((policy, idx) => {
                  const plan = policy.planId || {};
                  return (
                    <motion.div
                      key={policy._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-gray-200 hover:shadow-md transition">
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg">
                              {plan.name || "Unnamed Policy"}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              Policy No: {policy.policyNumber || "N/A"}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-100 text-blue-700">
                              {policy.status}
                            </Badge>
                            <Badge variant="outline">
                              {plan.category || "Uncategorized"}
                            </Badge>
                            <Badge variant="outline">
                              ${plan.premium || policy.premium}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="text-sm text-gray-600">
                            <p>
                              Customer:{" "}
                              <span className="font-medium">
                                {policy.userId?.fullName || "N/A"}
                              </span>
                            </p>
                            <p>Coverage: {plan.coverageAmount || "N/A"}</p>
                          </div>

                          {/* Actions Modal */}
                          <AdminPolicyActions policy={policy} />
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
    </div>
  );
}
