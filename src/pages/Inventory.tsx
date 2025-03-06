
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart } from "@/components/ui/chart";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  lastRestocked: string;
  salesVelocity: number; // Items sold per day
  daysUntilReorder: number;
  priceInRupees: number;
}

// Simulated inventory data
const initialInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "TS-BLK-M",
    name: "Black T-Shirt (M)",
    category: "Apparel",
    currentStock: 45,
    reorderLevel: 20,
    lastRestocked: "2023-05-15",
    salesVelocity: 3.2,
    daysUntilReorder: 8,
    priceInRupees: 599
  },
  {
    id: "2",
    sku: "TS-BLK-L",
    name: "Black T-Shirt (L)",
    category: "Apparel",
    currentStock: 32,
    reorderLevel: 20,
    lastRestocked: "2023-05-15",
    salesVelocity: 2.8,
    daysUntilReorder: 4,
    priceInRupees: 599
  },
  {
    id: "3",
    sku: "TS-WHT-M",
    name: "White T-Shirt (M)",
    category: "Apparel",
    currentStock: 18,
    reorderLevel: 20,
    lastRestocked: "2023-05-01",
    salesVelocity: 4.1,
    daysUntilReorder: -1,
    priceInRupees: 549
  },
  {
    id: "4",
    sku: "JS-DNM-32",
    name: "Denim Jeans (32)",
    category: "Apparel",
    currentStock: 25,
    reorderLevel: 15,
    lastRestocked: "2023-05-10",
    salesVelocity: 1.5,
    daysUntilReorder: 7,
    priceInRupees: 1999
  },
  {
    id: "5",
    sku: "HD-GRY-L",
    name: "Grey Hoodie (L)",
    category: "Apparel",
    currentStock: 12,
    reorderLevel: 10,
    lastRestocked: "2023-04-20",
    salesVelocity: 0.8,
    daysUntilReorder: 3,
    priceInRupees: 1499
  }
];

// Simulated sales data for charts
const salesData = [
  { date: "Mon", sales: 12 },
  { date: "Tue", sales: 18 },
  { date: "Wed", sales: 15 },
  { date: "Thu", sales: 22 },
  { date: "Fri", sales: 28 },
  { date: "Sat", sales: 32 },
  { date: "Sun", sales: 24 },
];

const Inventory = () => {
  const { userType } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    category: "",
    currentStock: 0,
    reorderLevel: 0,
    priceInRupees: 0
  });

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate inventory stats
  const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderLevel).length;
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.priceInRupees), 0);
  const averageDaysToReorder = Math.round(inventory.reduce((sum, item) => 
    sum + (item.daysUntilReorder > 0 ? item.daysUntilReorder : 0), 0) / inventory.length);

  const handleAddItem = () => {
    const newInventoryItem: InventoryItem = {
      id: (inventory.length + 1).toString(),
      sku: newItem.sku,
      name: newItem.name,
      category: newItem.category,
      currentStock: newItem.currentStock,
      reorderLevel: newItem.reorderLevel,
      lastRestocked: new Date().toISOString().split('T')[0],
      salesVelocity: 0, // New items start with 0 sales velocity
      daysUntilReorder: 99, // Placeholder value
      priceInRupees: newItem.priceInRupees
    };

    setInventory([...inventory, newInventoryItem]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item Added",
      description: `${newItem.name} (${newItem.sku}) has been added to inventory.`,
    });
    
    // Reset form
    setNewItem({
      sku: "",
      name: "",
      category: "",
      currentStock: 0,
      reorderLevel: 0,
      priceInRupees: 0
    });
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from inventory.",
    });
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderLevel / 2) return "bg-red-500";
    if (item.currentStock <= item.reorderLevel) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-white">Inventory Tracker</h1>
          <p className="text-white/80 mt-1">
            Monitor stock levels, sales velocity, and automate replenishment
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <p className="text-xs text-white/60">Tracked items</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Low Stock</CardTitle>
              <BarChart className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{lowStockItems}</div>
              <p className="text-xs text-white/60">Items below reorder level</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Value</CardTitle>
              <FileText className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{totalValue.toLocaleString()}</div>
              <p className="text-xs text-white/60">Inventory worth</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Time to Reorder</CardTitle>
              <FileText className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageDaysToReorder} days</div>
              <p className="text-xs text-white/60">Until reorder needed</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Sales Velocity Chart */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Daily Sales</CardTitle>
            <CardDescription className="text-white/60">
              Items sold per day, last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={salesData}
                index="date"
                categories={["sales"]}
                colors={["#ef5747"]}
                valueFormatter={(value: number) => `${value} units`}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Management */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Inventory Items</h2>
            <div className="flex w-full sm:w-auto gap-4">
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#ef5747] hover:bg-[#ef5747]/90 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Add a new item to track in your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sku" className="text-white">SKU</Label>
                        <Input
                          id="sku"
                          placeholder="e.g. TS-BLK-M"
                          value={newItem.sku}
                          onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white">Category</Label>
                        <Input
                          id="category"
                          placeholder="e.g. Apparel"
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Item Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Black T-Shirt (M)"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentStock" className="text-white">Current Stock</Label>
                        <Input
                          id="currentStock"
                          type="number"
                          min="0"
                          value={newItem.currentStock}
                          onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) || 0 })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorderLevel" className="text-white">Reorder Level</Label>
                        <Input
                          id="reorderLevel"
                          type="number"
                          min="0"
                          value={newItem.reorderLevel}
                          onChange={(e) => setNewItem({ ...newItem, reorderLevel: parseInt(e.target.value) || 0 })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-white">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          value={newItem.priceInRupees}
                          onChange={(e) => setNewItem({ ...newItem, priceInRupees: parseInt(e.target.value) || 0 })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-white text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem} className="bg-[#ef5747] hover:bg-[#ef5747]/90 text-white">
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/10">
                <TableRow className="hover:bg-white/5 border-white/20">
                  <TableHead className="text-white">SKU</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Stock</TableHead>
                  <TableHead className="text-white">Velocity</TableHead>
                  <TableHead className="text-white">Days to Reorder</TableHead>
                  <TableHead className="text-white">Price (₹)</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-black/50">
                {filteredInventory.length === 0 ? (
                  <TableRow className="hover:bg-white/5 border-white/20">
                    <TableCell colSpan={8} className="h-32 text-center text-white">
                      No inventory items found. Add some items to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-white/5 border-white/20">
                      <TableCell className="font-mono text-white">{item.sku}</TableCell>
                      <TableCell className="text-white">{item.name}</TableCell>
                      <TableCell className="text-white">{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStockStatusColor(item)}`}></div>
                          <span className="text-white">{item.currentStock}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{item.salesVelocity.toFixed(1)}/day</TableCell>
                      <TableCell>
                        {item.daysUntilReorder < 0 ? (
                          <Badge variant="destructive">Reorder Now</Badge>
                        ) : item.daysUntilReorder < 5 ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            {item.daysUntilReorder} days
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                            {item.daysUntilReorder} days
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white">₹{item.priceInRupees}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:text-[#ef5747] hover:bg-white/5"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Auto Replenishment Explanation */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Auto Replenishment System</CardTitle>
            <CardDescription className="text-white/60">
              How our automated inventory management works
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white/80 space-y-4">
            <p>
              Our system continuously tracks sales velocity and automatically calculates when items will need to be reordered. 
              The system factors in:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Historical sales data and seasonal trends</li>
              <li>Current stock levels compared to your reorder thresholds</li>
              <li>Lead time from manufacturers</li>
              <li>Optimal order quantities to minimize costs</li>
            </ul>
            <p>
              When inventory approaches your reorder level, you'll receive notifications, and for items with auto-replenishment enabled, 
              purchase orders will be automatically generated.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
