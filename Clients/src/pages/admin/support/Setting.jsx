// src/components/Settings.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiBell,
  FiShield,
  FiCreditCard,
  FiDatabase,
  FiGlobe,
  FiSave,
  FiMail,
  FiSmartphone,
  FiLock,
} from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    claims: true,
    renewals: true,
    marketing: false,
  });

  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "admin@insurance.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    language: "en",
    timezone: "America/New_York",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleSave = () => {
    // Save settings logic
    console.log("Settings saved:", { notifications, userData });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and system preferences
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <FiSave className="w-4 h-4" />
          Save Changes
        </Button>
      </motion.div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="account" className="gap-2">
            <FiUser className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <FiBell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <FiShield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <FiCreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <FiDatabase className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <FiGlobe className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <FiSmartphone className="text-gray-400" />
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userData.role}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Methods</h3>
                  <div className="space-y-4">
                    {[
                      {
                        id: "email",
                        label: "Email Notifications",
                        description: "Receive notifications via email",
                      },
                      {
                        id: "sms",
                        label: "SMS Notifications",
                        description: "Receive notifications via text message",
                      },
                      {
                        id: "push",
                        label: "Push Notifications",
                        description: "Receive browser push notifications",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <Label htmlFor={method.id}>{method.label}</Label>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        <Switch
                          id={method.id}
                          checked={notifications[method.id]}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [method.id]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    {[
                      {
                        id: "claims",
                        label: "New Claims",
                        description: "Notify when new claims are submitted",
                      },
                      {
                        id: "renewals",
                        label: "Policy Renewals",
                        description: "Notify about upcoming policy renewals",
                      },
                      {
                        id: "marketing",
                        label: "Marketing Updates",
                        description:
                          "Receive marketing newsletters and updates",
                      },
                    ].map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <Label htmlFor={`type-${type.id}`}>
                            {type.label}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {type.description}
                          </p>
                        </div>
                        <Switch
                          id={`type-${type.id}`}
                          checked={notifications[type.id]}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [type.id]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Security Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="session-timeout">Auto Logout</Label>
                        <p className="text-sm text-gray-500">
                          Automatically logout after 30 minutes of inactivity
                        </p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>
                    Set your preferred language and region
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={userData.language}
                      onValueChange={(value) =>
                        setUserData({ ...userData, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={userData.timezone}
                      onValueChange={(value) =>
                        setUserData({ ...userData, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          Eastern Time (ET)
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time (CT)
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time (MT)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time (PT)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Data Preferences</CardTitle>
                  <CardDescription>
                    Manage your data retention and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-backup">Automatic Backups</Label>
                      <p className="text-sm text-gray-500">
                        Automatically backup data daily
                      </p>
                    </div>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="data-export">Allow Data Export</Label>
                      <p className="text-sm text-gray-500">
                        Enable export of your data in CSV format
                      </p>
                    </div>
                    <Switch id="data-export" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-gray-500">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
