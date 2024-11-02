import { Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-16">
          <section className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Save funds by locally exchanging energy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Reduce your energy bill by buying and selling sustainable energy locally. 
              We provide an automated peer-to-peer energy-trading platform to exchange 
              locally produced energy.
            </p>
            <div className="space-x-4">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                Talk to an Expert
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                Try out a Demo
              </button>
            </div>
          </section>
          
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src="/img/siphon-sketch.png" alt="Siphon Sketch" className="w-full" />
          </div>
        </div>

        <section className="py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Manifesto</h2>
          <p className="text-xl text-gray-600">
            Your commitment to sustainable energy starts here. We aim to empower 
            communities by enabling local energy exchanges that foster sustainability 
            and reduce costs.
          </p>
        </section>
      </main>
    </div>
  );
} 