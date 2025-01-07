"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "./date-range-picker"
import { Clock, Download, ListTodo, AlertCircle, CheckCircle2, Users } from 'lucide-react'

import {useTranslations} from 'next-intl';
// import {Link} from '@/i18n/routing';

// Mock data for the chart
const data = [
  {
    name: "Jan 1",
    total: 12,
  },
  {
    name: "Jan 2",
    total: 15,
  },
  {
    name: "Jan 3",
    total: 8,
  },
  {
    name: "Jan 4",
    total: 22,
  },
  {
    name: "Jan 5",
    total: 18,
  },
  {
    name: "Jan 6",
    total: 25,
  },
  {
    name: "Jan 7",
    total: 20,
  },
]

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      avatar: "/placeholder.svg"
    },
    action: "completed task",
    task: "Update user authentication flow",
    time: "2 hours ago"
  },
  {
    id: 2,
    user: {
      name: "Mike Jones",
      email: "mike.jones@example.com",
      avatar: "/placeholder.svg"
    },
    action: "created task",
    task: "Design new landing page",
    time: "4 hours ago"
  },
  {
    id: 3,
    user: {
      name: "Alex Kim",
      email: "alex.kim@example.com",
      avatar: "/placeholder.svg"
    },
    action: "updated status",
    task: "Fix payment integration bugs",
    time: "5 hours ago"
  },
]

export function Overview() {
  const t = useTranslations('DashPage');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  -8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Task Completion Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You have {recentActivities.length} recent activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={activity.user.avatar} alt="Avatar" />
                        <AvatarFallback>
                          {activity.user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} "{activity.task}"
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground inline mr-1" />
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

