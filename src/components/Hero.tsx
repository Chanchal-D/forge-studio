import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
export const Hero = () => {
  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with reduced opacity */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-center bg-cover opacity-5"></div>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            Putting the <span className="text-[#ef5747]">fast</span> in fast fashion manufacturing
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-50">Reimagine production with on-demand production - from design to delivery in days, not months.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[#ef5747] hover:bg-[#ef5747]/90 text-white text-lg py-6 px-8" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="border-white text-[#ef5747] hover:bg-white/10 hover:text-white text-lg py-6 px-8" asChild>
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80">
            <div>
              <p className="text-4xl font-bold text-white">10 days</p>
              <p className="mt-2">Average production time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">50+</p>
              <p className="mt-2">Manufacturing partners</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">94%</p>
              <p className="mt-2">On-time delivery rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">24/7</p>
              <p className="mt-2">Production monitoring</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
    </div>;
};