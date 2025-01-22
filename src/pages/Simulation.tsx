import React, { useState, useRef, useEffect } from 'react';
import { TreePine, ArrowRight, RotateCcw, Play, FastForward, Info, Sun, Moon, Undo, Redo, Download, Shuffle, Gauge, ZoomIn, ZoomOut, Move, Clock } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height?: number;
  depth?: number;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Simulation() {
  const [bst, setBst] = useState<TreeNode | null>(null);
  const [traversalResults, setTraversalResults] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [viewBox, setViewBox] = useState<ViewBox>({ x: -400, y: -100, width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, 500 * speedMultiplier));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) * (viewBox.width / svgRef.current!.clientWidth);
    const dy = (e.clientY - dragStart.y) * (viewBox.height / svgRef.current!.clientHeight);

    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => {
      const newZoom = Math.max(0.5, Math.min(2, prev * factor));
      const scale = newZoom / prev;
      
      setViewBox(prev => ({
        x: prev.x + (prev.width * (1 - scale)) / 2,
        y: prev.y + (prev.height * (1 - scale)) / 2,
        width: prev.width * scale,
        height: prev.height * scale
      }));

      return newZoom;
    });
  };

  const resetView = () => {
    setViewBox({ x: -400, y: -100, width: 800, height: 600 });
    setZoom(1);
  };

  const exportAsPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'bst-visualization.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportAsJSON = () => {
    if (!bst) return;
    const jsonString = JSON.stringify(bst, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.download = 'bst-data.json';
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const insert = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { value, left: null, right: null };
    }

    if (value < root.value) {
      root.left = insert(root.left, value);
    } else if (value > root.value) {
      root.right = insert(root.right, value);
    }

    return updateHeightAndDepth(root);
  };

  const updateHeightAndDepth = (node: TreeNode, depth: number = 0): TreeNode => {
    node.depth = depth;
    
    const leftHeight = node.left ? updateHeightAndDepth(node.left, depth + 1).height! : -1;
    const rightHeight = node.right ? updateHeightAndDepth(node.right, depth + 1).height! : -1;
    
    node.height = Math.max(leftHeight, rightHeight) + 1;
    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newBst = insert(bst ? JSON.parse(JSON.stringify(bst)) : null, value);
    addToHistory(newBst);
    setBst(newBst);
    setInputValue('');
  };

  const generateRandomTree = () => {
    let newBst: TreeNode | null = null;
    const size = Math.floor(Math.random() * 7) + 4; // 4-10 nodes
    const values = new Set<number>();
    
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 100));
    }

    values.forEach(value => {
      newBst = insert(newBst, value);
    });

    addToHistory(newBst);
    setBst(newBst);
  };

  const addToHistory = (tree: TreeNode | null) => {
    const newHistory = [...history.slice(0, historyIndex + 1), tree];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBst(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBst(history[historyIndex + 1]);
    }
  };

  const inorderTraversal = async (node: TreeNode | null, results: number[] = []) => {
    if (node) {
      await inorderTraversal(node.left, results);
      setCurrentNode(node.value);
      setVisitedNodes(prev => new Set([...prev, node.value]));
      results.push(node.value);
      setTraversalResults([...results]);
      await sleep(500);
      await inorderTraversal(node.right, results);
    }
    return results;
  };

  const preorderTraversal = async (node: TreeNode | null, results: number[] = []) => {
    if (node) {
      setCurrentNode(node.value);
      setVisitedNodes(prev => new Set([...prev, node.value]));
      results.push(node.value);
      setTraversalResults([...results]);
      await sleep(500);
      await preorderTraversal(node.left, results);
      await preorderTraversal(node.right, results);
    }
    return results;
  };

  const postorderTraversal = async (node: TreeNode | null, results: number[] = []) => {
    if (node) {
      await postorderTraversal(node.left, results);
      await postorderTraversal(node.right, results);
      setCurrentNode(node.value);
      setVisitedNodes(prev => new Set([...prev, node.value]));
      results.push(node.value);
      setTraversalResults([...results]);
      await sleep(500);
    }
    return results;
  };

  const handleTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setTraversalResults([]);
    setVisitedNodes(new Set());
    setCurrentNode(null);

    if (!bst) return;

    switch (type) {
      case 'inorder':
        await inorderTraversal(bst);
        break;
      case 'preorder':
        await preorderTraversal(bst);
        break;
      case 'postorder':
        await postorderTraversal(bst);
        break;
    }

    setCurrentNode(null);
  };

  const getNodeColor = (value: number) => {
    if (currentNode === value) {
      return isDarkMode ? '#F472B6' : '#EC4899'; // Current node - Pink
    }
    if (visitedNodes.has(value)) {
      return isDarkMode ? '#60A5FA' : '#3B82F6'; // Visited node - Blue
    }
    return isDarkMode ? '#34D399' : '#10B981'; // Unvisited node - Green
  };

  const calculateNodePosition = (node: TreeNode, level: number, totalLevels: number, parentX: number = 0, isLeft: boolean = false, isRight: boolean = false) => {
    const verticalSpacing = 80;
    const horizontalSpacing = Math.max(60, 200 / (level + 1)); // Adjust spacing based on level
    
    let x = parentX;
    if (level === 0) {
      x = 0;
    } else {
      const offset = horizontalSpacing * Math.pow(1.5, totalLevels - level);
      x = parentX + (isLeft ? -offset : isRight ? offset : 0);
    }
    
    const y = level * verticalSpacing;
    
    return { x, y };
  };

  const getTreeHeight = (node: TreeNode | null): number => {
    if (!node) return -1;
    return Math.max(getTreeHeight(node.left), getTreeHeight(node.right)) + 1;
  };

  const renderNode = (node: TreeNode, parentX: number = 0, parentY: number = 0, level: number = 0, isLeft: boolean = false, isRight: boolean = false) => {
    const totalLevels = getTreeHeight(bst) + 1;
    const { x, y } = calculateNodePosition(node, level, totalLevels, parentX, isLeft, isRight);
    const radius = 25;

    return (
      <g key={node.value}>
        {level > 0 && (
          <line
            x1={parentX}
            y1={parentY}
            x2={x}
            y2={y}
            stroke={isDarkMode ? '#4B5563' : '#9CA3AF'}
            strokeWidth="2"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={getNodeColor(node.value)}
          stroke={isDarkMode ? '#4B5563' : '#D1D5DB'}
          strokeWidth="2"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isDarkMode ? '#111827' : '#FFFFFF'}
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>
        <text
          x={x}
          y={y - radius - 5}
          textAnchor="middle"
          fill={isDarkMode ? '#9CA3AF' : '#4B5563'}
          fontSize="12"
        >
          h:{node.height} d:{node.depth}
        </text>
        {node.left && renderNode(node.left, x, y, level + 1, true, false)}
        {node.right && renderNode(node.right, x, y, level + 1, false, true)}
      </g>
    );
  };

  return (
    <div className={`min-h-screen p-8 relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Animated background blobs with more vibrant colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-40">
          <div 
            className={`absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-blob ${
              isDarkMode ? 'bg-pink-500' : 'bg-pink-300'
            }`}
          />
          <div 
            className={`absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 ${
              isDarkMode ? 'bg-purple-500' : 'bg-purple-300'
            }`}
          />
          <div 
            className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 ${
              isDarkMode ? 'bg-teal-500' : 'bg-teal-300'
            }`}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TreePine className="w-8 h-8 text-emerald-500" />
            BST Visualization
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 border rounded-lg p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleZoom(1.2)}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleZoom(0.8)}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportAsPNG}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export PNG
                </button>
                <button
                  onClick={exportAsJSON}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>
            
            {/* SVG Container */}
            <div className="relative overflow-hidden border rounded-lg" style={{ height: '500px' }}>
              <div className="absolute inset-0 cursor-move">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                  className="mx-auto"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {bst && renderNode(bst)}
                </svg>
              </div>
            </div>

            {/* Animation Speed Control */}
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-medium">Animation Speed</h3>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  {speedMultiplier.toFixed(1)}x
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Controls Section */}
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-500" />
                Controls
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all`}
                  />
                  <button
                    onClick={handleInsert}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
                  >
                    Insert
                  </button>
                </div>
                <button
                  onClick={generateRandomTree}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Random Tree
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Undo className="w-4 h-4" />
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Redo className="w-4 h-4" />
                    Redo
                  </button>
                </div>
              </div>
            </div>

            {/* Traversal Section */}
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-500" />
                Traversal
              </h2>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleTraversal('inorder')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Inorder
                </button>
                <button
                  onClick={() => handleTraversal('preorder')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <FastForward className="w-4 h-4" />
                  Preorder
                </button>
                <button
                  onClick={() => handleTraversal('postorder')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Postorder
                </button>
              </div>
            </div>

            {/* Traversal Result Section */}
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-pink-500" />
                Traversal Result
              </h2>
              <div className="flex flex-wrap gap-2">
                {traversalResults.map((value, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-white ${
                      currentNode === value
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    } transition-all duration-300`}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Credits */}
      <div className="mt-16 text-center">
        <div className={`max-w-2xl mx-auto p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm shadow-xl`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Developed By
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>INDHUJA T</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>22CSR072</p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>JAHAGANAPATHI S</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>22CSR075</p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>KOKILA DEVI P</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>22CSR102</p>
            </div>
          </div>
          <div className="mt-4">
            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>KONGU ENGINEERING COLLEGE</p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</p>
          </div>
        </div>
      </div>
    </div>
  );
}