import { Factory, Package, FileCheck } from 'lucide-react';
const features = [{
  icon: FileCheck,
  title: 'Smart Inventory Management',
  description: 'Automated inventory tracking with auto reorder alerts to prevent stockouts.'
}, {
  icon: Factory,
  title: 'Local Manufacturing',
  description: 'Connect with verified local manufacturers for quality production.'
}, {
  icon: Package,
  title: 'Small Batch Production',
  description: 'Perfect for startups and brands looking to produce smaller quantities.'
}];
export const Features = () => {
  return <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-forge-900 mb-4">
            Streamlined Manufacturing Process
          </h2>
          <p className="text-forge-600">Simplify your man</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="p-6 rounded-lg border border-forge-200 hover:border-forge-300 transition-colors">
              <div className="w-12 h-12 bg-forge-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-forge-600" />
              </div>
              <h3 className="text-xl font-semibold text-forge-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-forge-600">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};