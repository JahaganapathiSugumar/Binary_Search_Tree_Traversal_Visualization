import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Binary, BrainCircuit, Code, BookOpen, Zap, Users, Github } from 'lucide-react';

export default function Home() {
  const GITHUB_REPO = "https://github.com/JahaganapathiSugumar/Binary_Search_Tree_Traversal_Visualization.git";

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Binary Search Tree Traversal Visualization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-200">
            Master Binary Search Tree operations through our interactive visualization platform. 
            Perfect for students, developers, and anyone interested in understanding tree data structures.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/simulation"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Try the Simulation
              <TreePine className="w-5 h-5 ml-2" />
            </Link>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105"
            >
              View on GitHub
              <Github className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Learning</h3>
            <p className="text-gray-600">
              Watch how binary search trees grow and transform with each operation in real-time
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Binary className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tree Traversal</h3>
            <p className="text-gray-600">
              Understand different traversal methods: inorder, preorder, and postorder with step-by-step visualization
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Learn by doing with our interactive BST operations and animations
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              Technical Features
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                <span>Real-time visualization of tree operations</span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-green-500 mt-1" />
                <span>Comprehensive coverage of BST concepts</span>
              </li>
              <li className="flex items-start gap-3">
                <Binary className="w-5 h-5 text-blue-500 mt-1" />
                <span>Multiple traversal algorithms visualization</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Perfect For
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-indigo-500 mt-1" />
                <span>Computer Science Students learning data structures</span>
              </li>
              <li className="flex items-start gap-3">
                <Code className="w-5 h-5 text-pink-500 mt-1" />
                <span>Developers preparing for technical interviews</span>
              </li>
              <li className="flex items-start gap-3">
                <BrainCircuit className="w-5 h-5 text-emerald-500 mt-1" />
                <span>Anyone interested in algorithmic visualization</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Jump into our interactive BST visualization and enhance your understanding of tree data structures.
          </p>
          <Link
            to="/simulation"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            Start Visualizing
            <TreePine className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Developer Credits */}
        <div className="mt-16 text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Developed By
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <p className="font-semibold text-gray-900">INDHUJA T</p>
                <p className="text-gray-600 text-sm">22CSR072</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <p className="font-semibold text-gray-900">JAHAGANAPATHI S</p>
                <p className="text-gray-600 text-sm">22CSR075</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <p className="font-semibold text-gray-900">KOKILA DEVI P</p>
                <p className="text-gray-600 text-sm">22CSR102</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-bold text-gray-900">KONGU ENGINEERING COLLEGE</p>
              <p className="text-gray-600">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}