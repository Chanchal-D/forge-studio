
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

interface Order {
  id: string;
  brand: string;
  name: string;
  status: string;
  progress: number;
  deadline: string;
  created: string;
  items: number;
  revenue: number;
  laborHours: number;
  materialCost: number;
}

interface StatusMap {
  [key: string]: { label: string; color: string };
}

interface ManufacturerOrderTableProps {
  orders: Order[];
  statusMap: StatusMap;
  selectedOrder: string | null;
  setSelectedOrder: (id: string | null) => void;
}

export const ManufacturerOrderTable = ({ 
  orders, 
  statusMap, 
  selectedOrder, 
  setSelectedOrder 
}: ManufacturerOrderTableProps) => {
  const [sortField, setSortField] = useState<"deadline" | "created" | "revenue" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "deadline" | "created" | "revenue") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === "revenue") {
      return sortDirection === "asc" 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      
      return sortDirection === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
  });

  const handleViewDetails = (id: string) => {
    setSelectedOrder(id === selectedOrder ? null : id);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("deadline")}>
              <div className="flex items-center">
                Deadline
                {sortField === "deadline" && (
                  sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("revenue")}>
              <div className="flex items-center">
                Revenue
                {sortField === "revenue" && (
                  sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            sortedOrders.map((order) => (
              <TableRow key={order.id} className={selectedOrder === order.id ? "bg-forge-50" : ""}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.brand}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>
                  <Badge 
                    className={`${statusMap[order.status]?.color || 'bg-gray-500'} text-white`}
                  >
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={order.progress} className="w-[60px]" />
                    <span className="text-xs">{order.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(order.deadline), 'MM/dd/yyyy')}</TableCell>
                <TableCell>${order.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant={selectedOrder === order.id ? "default" : "outline"}
                    onClick={() => handleViewDetails(order.id)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    {selectedOrder === order.id ? "Hide" : "View"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
