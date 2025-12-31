import React from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system preferences and configurations.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general" className="flex gap-2">
            <User size={16} /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2">
            <Shield size={16} /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell size={16} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex gap-2">
            <Globe size={16} /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Update your account details and public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@insurance.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive system alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "Claim Alerts",
                  desc: "Notify when a new claim is submitted.",
                },
                {
                  title: "Weekly Report",
                  desc: "Send a summary of weekly performance every Monday.",
                },
                {
                  title: "Security Alerts",
                  desc: "Immediate email for suspicious login attempts.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{item.title}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
