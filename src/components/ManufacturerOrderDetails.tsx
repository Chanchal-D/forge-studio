
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, FileText, Package, Truck, Users } from "lucide-react";

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

interface ManufacturerOrderDetailsProps {
  order: Order;
  statusMap: StatusMap;
}

// Production milestones for the timeline
const productionSteps = [
  { key: "techpack_review", label: "Tech Pack Review", icon: FileText },
  { key: "accepted", label: "Order Accepted", icon: Calendar },
  { key: "production", label: "In Production", icon: Package },
  { key: "cutting", label: "Cutting", icon: Users },
  { key: "sewing", label: "Sewing", icon: Users },
  { key: "quality_check", label: "Quality Check", icon: Users },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "completed", label: "Completed", icon: Clock },
];

// Helper function to determine the current milestone index
const getCurrentMilestoneIndex = (status: string): number => {
  const index = productionSteps.findIndex(step => step.key === status);
  return index >= 0 ? index : 0; // Default to first step if status not found
};

export const ManufacturerOrderDetails = ({ order, statusMap }: ManufacturerOrderDetailsProps) => {
  const currentStep = getCurrentMilestoneIndex(order.status);
  
  // Calculate profit
  const profit = order.revenue - order.materialCost - (order.laborHours * 25); // $25/hour labor cost
  const profitMargin = Math.round((profit / order.revenue) * 100);
  
  // Calculate time efficiency
  const standardHoursPerItem = 2.5; // Standard time per item
  const standardHours = order.items * standardHoursPerItem;
  const timeEfficiency = Math.round((standardHours / order.laborHours) * 100);
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{order.name}</span>
          <Badge 
            className={`${statusMap[order.status]?.color || 'bg-gray-500'} text-white ml-2`}
          >
            {statusMap[order.status]?.label || order.status}
          </Badge>
        </CardTitle>
        <CardDescription className="flex flex-col space-y-1">
          <span>Order ID: {order.id}</span>
          <span>Brand: {order.brand}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Revenue</p>
            <p className="font-medium text-emerald-600">${order.revenue.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Costs</p>
            <p className="font-medium text-rose-600">${(order.materialCost + (order.laborHours * 25)).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
            <p className="font-medium">{profitMargin}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
            <p className="font-medium">{timeEfficiency}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Created On</p>
            <p className="font-medium">{format(new Date(order.created), 'MMM d, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Deadline</p>
            <p className="font-medium">{format(new Date(order.deadline), 'MMM d, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Items</p>
            <p className="font-medium">{order.items} units</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Production Progress</h3>
            <span className="text-sm font-medium">{order.progress}%</span>
          </div>
          <Progress value={order.progress} className="h-2" />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Production Timeline</h3>
            <div className="space-y-6">
              {productionSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= currentStep;
                const isPastStep = index < currentStep;
                const isCurrentStep = index === currentStep;
                
                return (
                  <div key={step.key} className={`relative flex items-start ${index !== 0 ? 'mt-6' : ''}`}>
                    {index > 0 && (
                      <div 
                        className={`absolute left-3.5 top-[-30px] w-0.5 h-[30px] ${isPastStep ? 'bg-primary' : 'bg-muted'}`} 
                        aria-hidden="true"
                      />
                    )}
                    <div 
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                        isCurrentStep 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : isActive 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-muted bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {isCurrentStep && (
                        <p className="text-xs text-muted-foreground">Current stage</p>
                      )}
                      {isPastStep && (
                        <p className="text-xs text-muted-foreground">Completed</p>
                      )}
                      {!isActive && (
                        <p className="text-xs text-muted-foreground">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Cost Breakdown</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Material Cost</p>
                  <p className="text-sm font-medium">${order.materialCost.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Labor Hours</p>
                  <p className="text-sm font-medium">{order.laborHours} hrs</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Labor Cost</p>
                  <p className="text-sm font-medium">${(order.laborHours * 25).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className="text-sm font-medium text-emerald-600">${profit.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cost Per Item</p>
                <p className="text-sm font-medium">
                  ${Math.round((order.materialCost + (order.laborHours * 25)) / order.items).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
