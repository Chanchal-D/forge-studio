
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Image, Package, Printer, ShoppingCart, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface PODProduct {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  mockupUrl: string;
  printArea: string;
  printTechnique: string;
  orderCount: number;
}

// Simulated POD products data
const initialProducts: PODProduct[] = [
  {
    id: "POD-001",
    name: "Minimalist Logo T-Shirt",
    type: "T-Shirt",
    status: "live",
    createdAt: "2023-04-15",
    mockupUrl: "/placeholder.svg",
    printArea: "Front Center",
    printTechnique: "DTG",
    orderCount: 32
  },
  {
    id: "POD-002",
    name: "Custom Slogan Hoodie",
    type: "Hoodie",
    status: "draft",
    createdAt: "2023-04-22",
    mockupUrl: "/placeholder.svg",
    printArea: "Back Full",
    printTechnique: "Screen Printing",
    orderCount: 0
  },
  {
    id: "POD-003",
    name: "Graphic Art Tote Bag",
    type: "Bag",
    status: "live",
    createdAt: "2023-03-10",
    mockupUrl: "/placeholder.svg",
    printArea: "One Side",
    printTechnique: "DTG",
    orderCount: 47
  },
  {
    id: "POD-004",
    name: "Quote Canvas Print",
    type: "Wall Art",
    status: "live",
    createdAt: "2023-02-28",
    mockupUrl: "/placeholder.svg",
    printArea: "Full Surface",
    printTechnique: "Digital Print",
    orderCount: 15
  }
];

// Print techniques data
const printTechniques = [
  {
    id: "dtg",
    name: "Direct to Garment (DTG)",
    description: "Digital printing directly onto garments, best for detailed designs and small batches",
    products: ["T-Shirts", "Hoodies", "Tote Bags"],
    leadTime: "2-3 days",
    minOrder: 1,
    costEfficiency: 70,
  },
  {
    id: "screen",
    name: "Screen Printing",
    description: "Traditional method using mesh screens, ideal for simple designs and large batches",
    products: ["T-Shirts", "Hoodies", "Caps"],
    leadTime: "3-5 days",
    minOrder: 20,
    costEfficiency: 90,
  },
  {
    id: "sublimation",
    name: "Dye Sublimation",
    description: "Process that turns dye into gas, ideal for all-over prints on polyester garments",
    products: ["Athletic Wear", "Mugs", "Phone Cases"],
    leadTime: "2-4 days",
    minOrder: 1,
    costEfficiency: 65,
  },
  {
    id: "embroidery",
    name: "Embroidery",
    description: "Thread stitched directly into fabric, premium look for logos and small designs",
    products: ["Polos", "Caps", "Bags"],
    leadTime: "3-5 days",
    minOrder: 10,
    costEfficiency: 60,
  }
];

const POD = () => {
  const { isAuthenticated, userType } = useAuth();
  const [products, setProducts] = useState<PODProduct[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalProducts = products.length;
  const liveProducts = products.filter(p => p.status === "live").length;
  const totalOrders = products.reduce((sum, product) => sum + product.orderCount, 0);

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add new product after "upload" completes
          const newProduct: PODProduct = {
            id: `POD-00${products.length + 1}`,
            name: "New Uploaded Design",
            type: "T-Shirt",
            status: "draft",
            createdAt: new Date().toISOString().split('T')[0],
            mockupUrl: "/placeholder.svg",
            printArea: "Front Center",
            printTechnique: "DTG",
            orderCount: 0
          };
          
          setProducts([...products, newProduct]);
          
          toast({
            title: "Upload Complete",
            description: "Your design has been uploaded successfully and is ready for customization.",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-emerald-500">Live</Badge>;
      case "draft":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-white">Print On Demand</h1>
          <p className="text-white/80 mt-1">
            Create, upload, and manage your POD products with instant fulfillment
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Products</CardTitle>
              <Package className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProducts}</div>
              <p className="text-xs text-white/60">Products in catalog</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Live Products</CardTitle>
              <ShoppingCart className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{liveProducts}</div>
              <p className="text-xs text-white/60">Products available for sale</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalOrders}</div>
              <p className="text-xs text-white/60">Orders received</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Upload Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Upload New Design</CardTitle>
            <CardDescription className="text-white/60">
              Upload your artwork to create new POD products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border-2 border-dashed rounded-md border-white/20 p-6 flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80">Uploading design...</span>
                      <span className="text-sm text-white/80">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-white/60" />
                    <p className="text-white mt-2">Drag & drop your file here</p>
                    <p className="text-white/60 text-sm">Supports PNG, JPG, AI, PSD (Max 50MB)</p>
                    <Button 
                      onClick={handleUpload} 
                      className="mt-4 bg-[#ef5747] hover:bg-[#ef5747]/90 text-white"
                    >
                      Select File
                    </Button>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Design Guidelines</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li>• Minimum resolution: 300 DPI</li>
                    <li>• Transparent background preferred</li>
                    <li>• Keep important elements away from edges</li>
                    <li>• Use CMYK color space for best results</li>
                    <li>• Vector formats recommended for logos</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">What happens next?</h3>
                  <p className="text-white/80 text-sm">
                    After uploading, you'll be able to place your design on various products,
                    customize print areas, and create mockups before making them available for sale.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Products Management */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Your POD Products</h2>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/10">
                <TableRow className="hover:bg-white/5 border-white/20">
                  <TableHead className="text-white">Product</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Created</TableHead>
                  <TableHead className="text-white">Print Technique</TableHead>
                  <TableHead className="text-white">Orders</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-black/50">
                {filteredProducts.length === 0 ? (
                  <TableRow className="hover:bg-white/5 border-white/20">
                    <TableCell colSpan={7} className="h-32 text-center text-white">
                      No products found. Upload a design to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-white/5 border-white/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/5 w-10 h-10 rounded flex items-center justify-center">
                            <Image className="h-6 w-6 text-white/60" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-xs text-white/60">{product.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{product.type}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-white/80">{product.createdAt}</TableCell>
                      <TableCell className="text-white/80">{product.printTechnique}</TableCell>
                      <TableCell className="text-white">{product.orderCount}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Print Techniques */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Print Techniques</h2>
          <Tabs defaultValue="dtg">
            <TabsList className="bg-white/10">
              {printTechniques.map(tech => (
                <TabsTrigger 
                  key={tech.id} 
                  value={tech.id}
                  className="data-[state=active]:bg-[#ef5747] data-[state=active]:text-white"
                >
                  {tech.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {printTechniques.map(tech => (
              <TabsContent key={tech.id} value={tech.id} className="mt-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Printer className="h-6 w-6 text-[#ef5747]" />
                      <div>
                        <CardTitle className="text-white">{tech.name}</CardTitle>
                        <CardDescription className="text-white/80">
                          {tech.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Suitable Products</h3>
                      <ul className="text-white/80 space-y-1 text-sm">
                        {tech.products.map((product, i) => (
                          <li key={i}>• {product}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Production Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-white/60">Lead Time:</p>
                        <p className="text-white">{tech.leadTime}</p>
                        <p className="text-white/60">Min Order:</p>
                        <p className="text-white">{tech.minOrder} units</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Cost Efficiency</h3>
                      <div className="space-y-2">
                        <Progress value={tech.costEfficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Lower Cost</span>
                          <span>Higher Cost</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default POD;
