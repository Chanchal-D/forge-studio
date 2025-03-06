
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Package, Truck, Users } from "lucide-react";
import { OrderTable } from "@/components/OrderTable";
import { OrderDetails } from "@/components/OrderDetails";

// Simulated order data
const orders = [
  {
    id: "ORD-1234",
    name: "Summer Collection 2025",
    status: "production",
    progress: 45,
    deadline: "2025-07-15",
    created: "2025-06-25",
    items: 120,
    manufacturer: "TextilePro Manufacturing",
  },
  {
    id: "ORD-1235",
    name: "Fall Basics",
    status: "cutting",
    progress: 25,
    deadline: "2025-08-10",
    created: "2025-06-28",
    items: 85,
    manufacturer: "Forge Partners Ltd",
  },
  {
    id: "ORD-1236",
    name: "Winter Jackets",
    status: "techpack_review",
    progress: 10,
    deadline: "2025-09-01",
    created: "2025-07-01",
    items: 50,
    manufacturer: "Pending Assignment",
  },
  {
    id: "ORD-1237",
    name: "Holiday Special Collection",
    status: "completed",
    progress: 100,
    deadline: "2025-06-30",
    created: "2025-06-10",
    items: 200,
    manufacturer: "TextilePro Manufacturing",
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

const Brands = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  // Stats calculation
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  
  // Find selected order details
  const orderDetails = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

  return (
    <div className="min-h-screen bg-forge-50">
      <Header />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-forge-900">Brand Dashboard</h1>
          <p className="text-forge-600 mt-1">Track your orders and manufacturing progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">Orders in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">Delivered orders</p>
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
            <OrderTable 
              orders={orders} 
              statusMap={statusMap} 
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            <OrderTable 
              orders={orders.filter(o => o.status !== "completed" && o.status !== "cancelled")} 
              statusMap={statusMap}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <OrderTable 
              orders={orders.filter(o => o.status === "completed")} 
              statusMap={statusMap}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </TabsContent>
        </Tabs>
        
        {orderDetails && (
          <OrderDetails order={orderDetails} statusMap={statusMap} />
        )}
      </div>
    </div>
  );
};

export default Brands;
