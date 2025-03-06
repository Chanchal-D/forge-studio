
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  userType: z.enum(["brand", "manufacturer"], {
    required_error: "Please select your account type",
  }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "brand",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, this would call an authentication API
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      
      // Log the user in
      login(values.userType);
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      
      // Redirect to the appropriate dashboard
      navigate(values.userType === "brand" ? "/brands" : "/manufacturers");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto pt-28 pb-12 px-4">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-sm border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Login to forge studio</h1>
            <p className="text-white/80 mt-2">
              Access your account to manage your orders
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-white">Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="brand" className="border-white text-[#ef5747]" />
                          </FormControl>
                          <FormLabel className="text-white font-normal cursor-pointer">Brand</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="manufacturer" className="border-white text-[#ef5747]" />
                          </FormControl>
                          <FormLabel className="text-white font-normal cursor-pointer">Manufacturer</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-[#ef5747]" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        className="bg-black/50 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#ef5747]"
                      />
                    </FormControl>
                    <FormMessage className="text-[#ef5747]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-black/50 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#ef5747]"
                      />
                    </FormControl>
                    <FormMessage className="text-[#ef5747]" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-[#ef5747] hover:bg-[#ef5747]/90 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#ef5747] font-medium hover:underline">
                Sign up
              </Link>
            </p>
            <Link to="/forgot-password" className="text-sm text-[#ef5747] font-medium hover:underline mt-2 inline-block">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
