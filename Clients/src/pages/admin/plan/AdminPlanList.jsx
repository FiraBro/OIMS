import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const plans = [
  {
    id: 1,
    name: "Health Basic",
    premium: "$45/mo",
    coverage: "$5,000",
    type: "Health",
  },
  {
    id: 2,
    name: "Car Protection",
    premium: "$25/mo",
    coverage: "$10,000",
    type: "Vehicle",
  },
];

export default function AdminPlansList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Manage Insurance Plans
          </CardTitle>

          <Link to="/admin/plans/new">
            <Button className="flex items-center gap-2">
              <FaPlus /> Add New Plan
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.premium}</TableCell>
                  <TableCell>{plan.coverage}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
