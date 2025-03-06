
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, Package, Truck, Users } from "lucide-react";
import { ManufacturerOrderTable } from "@/components/ManufacturerOrderTable";
import { ManufacturerOrderDetails } from "@/components/ManufacturerOrderDetails";
import { LineChart } from "@/components/ui/chart";

// Simulated order data
const orders = [
  {
    id: "ORD-1234",
    brand: "Fashionista Inc.",
    name: "Summer Collection 2025",
    status: "production",
    progress: 45,
    deadline: "2025-07-15",
    created: "2025-06-25",
    items: 120,
    revenue: 18500,
    laborHours: 240,
    materialCost: 7200,
  },
  {
    id: "ORD-1235",
    brand: "Urban Styles",
    name: "Fall Basics",
    status: "cutting",
    progress: 25,
    deadline: "2025-08-10",
    created: "2025-06-28",
    items: 85,
    revenue: 12800,
    laborHours: 170,
    materialCost: 5100,
  },
  {
    id: "ORD-1236",
    brand: "Luxe Apparel",
    name: "Winter Jackets",
    status: "techpack_review",
    progress: 10,
    deadline: "2025-09-01",
    created: "2025-07-01",
    items: 50,
    revenue: 25000,
    laborHours: 350,
    materialCost: 12500,
  },
  {
    id: "ORD-1237",
    brand: "Fashionista Inc.",
    name: "Holiday Special Collection",
    status: "completed",
    progress: 100,
    deadline: "2025-06-30",
    created: "2025-06-10",
    items: 200,
    revenue: 32000,
    laborHours: 400,
    materialCost: 15000,
  },
  {
    id: "ORD-1238",
    brand: "Trendy Threads",
    name: "Spring Essentials",
    status: "quality_check",
    progress: 85,
    deadline: "2025-07-20",
    created: "2025-06-15",
    items: 150,
    revenue: 22500,
    laborHours: 300,
    materialCost: 9000,
  },
  {
    id: "ORD-1239",
    brand: "Urban Styles",
    name: "Summer Accessories",
    status: "sewing",
    progress: 60,
    deadline: "2025-07-25",
    created: "2025-06-20",
    items: 95,
    revenue: 8500,
    laborHours: 120,
    materialCost: 3200,
  }
];

// Status mapping for human-readable labels
const statusMap: Record<string, { label: string, color: string }> = {
  techpack_review: { label: "Tech Pack Review", color: "bg-blue-500" },
  accepted: { label: "Accepted", color: "bg-purple-500" },
  production: { label: "In Production", color: "bg-amber-500" },
  cutting: { label: "Cutting", color: "bg-indigo-500" },
  sewing: { label: "Sewing", color: "bg-pink-500" },
  quality_check: { label: "Quality Check", color: "bg-green-500" },
  shipping: { label: "Shipping", color: "bg-orange-500" },
  completed: { label: "Completed", color: "bg-emerald-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

// Revenue data for the chart
const revenueData = [
  { name: "Jan", revenue: 95000 },
  { name: "Feb", revenue: 75000 },
  { name: "Mar", revenue: 108000 },
  { name: "Apr", revenue: 112000 },
  { name: "May", revenue: 120000 },
  { name: "Jun", revenue: 119000 },
  { name: "Jul", revenue: 125000 },
];

// Capacity data for the chart
const capacityData = [
  { name: "Jan", current: 82, max: 100 },
  { name: "Feb", current: 65, max: 100 },
  { name: "Mar", current: 88, max: 100 },
  { name: "Apr", current: 91, max: 100 },
  { name: "May", current: 94, max: 100 },
  { name: "Jun", current: 92, max: 100 },
  { name: "Jul", current: 96, max: 100 },
];

const Manufacturers = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  // Stats calculation
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.revenue, 0);
  const activeRevenue = orders
    .filter(o => o.status !== "completed" && o.status !== "cancelled")
    .reduce((sum, order) => sum + order.revenue, 0);
  
  // Calculate capacity
  const maxDailyCapacity = 500; // items per day
  const currentCapacity = orders
    .filter(o => o.status !== "completed" && o.status !== "cancelled")
    .reduce((sum, order) => sum + order.items, 0);
  const capacityPercentage = Math.min(Math.round((currentCapacity / maxDailyCapacity) * 100), 100);
  
  // Find selected order details
  const orderDetails = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

  return (
    <div className="min-h-screen bg-forge-50">
      <Header />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-forge-900">Manufacturer Dashboard</h1>
          <p className="text-forge-600 mt-1">Track production, manage orders, and view performance metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">Orders in production</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${activeRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From active orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{capacityPercentage}%</div>
                <Progress value={capacityPercentage} className="h-2 w-20" />
              </div>
              <p className="text-xs text-muted-foreground">Current factory utilization</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All orders (YTD)</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends for the past 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={revenueData}
                  categories={["revenue"]}
                  index="name"
                  colors={["emerald"]}
                  valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Factory Capacity</CardTitle>
              <CardDescription>Monthly capacity utilization percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={capacityData}
                  categories={["current"]}
                  index="name"
                  colors={["blue"]}
                  valueFormatter={(value: number) => `${value}%`}
                  yAxisWidth={40}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <ManufacturerOrderTable 
              orders={orders} 
              statusMap={statusMap} 
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            <ManufacturerOrderTable 
              orders={orders.filter(o => o.status !== "completed" && o.status !== "cancelled")} 
              statusMap={statusMap}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <ManufacturerOrderTable 
              orders={orders.filter(o => o.status === "completed")} 
              statusMap={statusMap}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
        </Tabs>
        
        {orderDetails && (
          <ManufacturerOrderDetails order={orderDetails} statusMap={statusMap} />
        )}
      </div>
    </div>
  );
};

export default Manufacturers;
