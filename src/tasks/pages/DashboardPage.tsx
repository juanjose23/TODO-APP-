"use client"

import * as React from "react"
import { CheckCircle, Clock, ListTodo, PieChartIcon, TrendingUp, Calendar } from "lucide-react"
import { Bar, BarChart, XAxis, Pie, PieChart, Label, Sector, ResponsiveContainer } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  // Task completion data for the bar chart
  const taskCompletionData = [
    { date: "2024-07-15", completed: 12, pending: 5 },
    { date: "2024-07-16", completed: 8, pending: 7 },
    { date: "2024-07-17", completed: 15, pending: 3 },
    { date: "2024-07-18", completed: 6, pending: 9 },
    { date: "2024-07-19", completed: 18, pending: 4 },
    { date: "2024-07-20", completed: 14, pending: 6 },
  ]

  // Task category data for the pie chart
  const taskCategoryData = [
    { category: "work", tasks: 32, fill: "#4caf50" },
    { category: "personal", tasks: 24, fill: "#ff9800" },
    { category: "learning", tasks: 18, fill: "#2196f3" },
    { category: "health", tasks: 15, fill: "#e91e63" },
    { category: "other", tasks: 8, fill: "#e91e63" },
  ]

  // Chart configurations
  const completionChartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
      icon: Clock,
    },
  } satisfies ChartConfig

  const categoryChartConfig = {
    tasks: {
      label: "Tasks",
    },
    work: {
      label: "Work",
      color: "#4caf50",
    },
    personal: {
      label: "Personal",
      color: "hsl(var(--chart-2))",
    },
    learning: {
      label: "Learning",
      color: "hsl(var(--chart-3))",
    },
    health: {
      label: "Health",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  // Calculate total tasks for the pie chart center
  const totalTasks = React.useMemo(() => {
    return taskCategoryData.reduce((acc, curr) => acc + curr.tasks, 0)
  }, [taskCategoryData])

  // Calculate completion rate
  const completionRate = React.useMemo(() => {
    const totalCompleted = taskCompletionData.reduce((acc, curr) => acc + curr.completed, 0)
    const totalTasks = taskCompletionData.reduce((acc, curr) => acc + curr.completed + curr.pending, 0)
    return totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
  }, [taskCompletionData])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-green-800">Task Dashboard</h1>
        <Tabs defaultValue="week" className="w-full sm:w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{totalTasks}</div>
            <p className="text-xs text-green-600">
              +
              {taskCompletionData[taskCompletionData.length - 1].completed +
                taskCompletionData[taskCompletionData.length - 1].pending}{" "}
              today
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{completionRate}%</div>
            <p className="text-xs text-green-600">+2% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {taskCompletionData.reduce((acc, curr) => acc + curr.pending, 0)}
            </div>
            <p className="text-xs text-green-600">
              {taskCompletionData[taskCompletionData.length - 1].pending} due today
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Most Active Day</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Friday</div>
            <p className="text-xs text-green-600">18 tasks completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Task Completion Chart */}
        <Card className="border-green-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-800">Task Completion</CardTitle>
            <CardDescription className="text-green-600">Daily completed vs pending tasks</CardDescription>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={completionChartConfig}>
                  <BarChart data={taskCompletionData}>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }}
                    />
                  <Bar dataKey="completed" stackId="a" fill="#4caf50" radius={[4, 4, 0, 0]} />
<Bar dataKey="pending" stackId="a" fill="#ff9800" radius={[0, 0, 4, 4]} />

                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Categories Chart */}
        <Card className="flex flex-col border-green-100 shadow-sm">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-green-800">Task Categories</CardTitle>
            <CardDescription className="text-green-600">Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[300px]">
                  <PieChart>
                    <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={taskCategoryData}
                      dataKey="tasks"
                      nameKey="category"
                      innerRadius="60%"
                      outerRadius="80%"
                      strokeWidth={5}
                      activeIndex={0}
                      activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                        <Sector {...props} outerRadius={outerRadius + 10} />
                      )}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-green-700 text-2xl sm:text-3xl font-bold"
                                >
                                  {totalTasks}
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-green-600 text-sm">
                                  Tasks
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-green-800">
              <PieChartIcon className="h-4 w-4 text-green-600" /> Work tasks are your priority
            </div>
            <div className="leading-none text-green-600">
              32 work tasks make up {Math.round((32 / totalTasks) * 100)}% of your total tasks
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
