// features/policies/PolicyList.js
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePolicies } from "@/contexts/PolicyContext";
export default function PolicyList() {
  const { policies } = usePolicies();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {policies.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{p.policyNumber}</p>
              <p className="text-sm text-muted-foreground">
                {p.coverageType} • ${p.premiumAmount}
              </p>
            </div>
            <Badge>{p.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
