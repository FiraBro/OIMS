import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  Clock,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Zap,
  Building,
  UserCheck,
  GraduationCap,
  Heart,
  Hospital,
  Percent,
} from "lucide-react";
import insurancePlanService from "@/services/planService";

export default function PlansPreview() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await insurancePlanService.getPopularPlans();
        console.log(data);
        setPlans(data?.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleApply = (planId) => planId && navigate(`/apply/${planId}`);
  const handleDetails = (planId) => planId && navigate(`/plans/${planId}`);

  const renderStars = (rating = 0) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );

  const getPlanIcon = (planType) => {
    switch ((planType || "").toLowerCase()) {
      case "corporate":
      case "group":
        return Building;
      case "senior":
        return UserCheck;
      case "student":
        return GraduationCap;
      case "family":
        return Users;
      default:
        return Heart;
    }
  };

  const getPlanColor = (colorScheme) => {
    const colors = {
      gold: "from-amber-500 to-yellow-500",
      silver: "from-gray-400 to-gray-300",
      blue: "from-blue-500 to-cyan-500",
      green: "from-emerald-500 to-green-500",
      purple: "from-purple-500 to-violet-500",
      indigo: "from-indigo-500 to-blue-500",
      red: "from-red-500 to-pink-500",
      default: "from-blue-500 to-indigo-500",
    };
    return colors[colorScheme] || colors.default;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-pulse space-y-8">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-96 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700"
              aria-label="Retry loading plans"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Trusted by Thousands</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Insurance Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our most popular insurance plans designed to provide
            comprehensive coverage and peace of mind.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No plans available
            </h3>
            <p className="text-gray-500">
              Check back later for our insurance plans.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const PlanIcon = getPlanIcon(plan.planType);
                const planColor = getPlanColor(plan.colorScheme);

                return (
                  <Card
                    key={plan._id}
                    className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
                  >
                    {plan.isPopular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${planColor} bg-opacity-10`}
                          >
                            <PlanIcon
                              className={`w-8 h-8 ${
                                planColor
                                  .replace("from-", "text-")
                                  .split(" ")[0]
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {plan.name || "Unnamed Plan"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {plan.category || "General Plan"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 mb-2 line-clamp-2">
                          {plan.coverageAmount || "Comprehensive coverage plan"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {plan.maxMembers
                              ? `${plan.maxMembers} Members`
                              : "Individual Plan"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {plan.waitingPeriod || "N/A"}
                          </span>
                        </div>
                      </div>

                      {plan.features && plan.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {plan.features.slice(0, 4).map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-gray-900 flex items-baseline gap-1">
                                {plan.currency === "USD" ? (
                                  <DollarSign className="inline-block align-middle w-6 h-6" />
                                ) : (
                                  <span>{plan.currency}</span>
                                )}
                                <span>{plan.premium || 0}</span>
                              </span>

                              <span className="text-gray-500">
                                /{plan.premiumFrequency || "month"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Premium starts from
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                      <Button
                        className={`w-full bg-gradient-to-r ${planColor} hover:opacity-90 text-white py-3 text-base font-medium transition-all duration-300 cursor-pointer`}
                        onClick={() => handleApply(plan._id)}
                        aria-label={`Apply for ${plan.name}`}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleDetails(plan._id)}
                        aria-label={`View details of ${plan.name}`}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-base cursor-pointer"
                onClick={() => navigate("/plans")}
              >
                View All Plans
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
