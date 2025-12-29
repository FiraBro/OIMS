import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FiSearch, FiEye, FiEdit, FiTrash2, FiUserX } from "react-icons/fi";

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Admin",
    status: "Suspended",
  },
];

export default function AdminUsersPage() {
  const [users] = useState(sampleUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-6"
      >
        Manage Users
      </motion.h1>

      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Role</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Badge
                    variant={
                      user.status === "Active" ? "default" : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="py-3 flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setViewOpen(true);
                    }}
                  >
                    <FiEye />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditOpen(true);
                    }}
                  >
                    <FiEdit />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteOpen(true);
                    }}
                  >
                    <FiTrash2 />
                  </Button>

                  <Button size="sm" variant="outline">
                    <FiUserX />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= */}
      {/* View User Modal */}
      {/* ========================= */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-3">
              <p>
                <b>Name:</b> {selectedUser.name}
              </p>
              <p>
                <b>Email:</b> {selectedUser.email}
              </p>
              <p>
                <b>Role:</b> {selectedUser.role}
              </p>
              <p>
                <b>Status:</b> {selectedUser.status}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================= */}
      {/* Edit User Modal */}
      {/* ========================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input placeholder="Full Name" defaultValue={selectedUser?.name} />
            <Input placeholder="Email" defaultValue={selectedUser?.email} />
            <Input placeholder="Role" defaultValue={selectedUser?.role} />
          </div>

          <DialogFooter>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================= */}
      {/* Delete Confirmation */}
      {/* ========================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this user?</p>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
