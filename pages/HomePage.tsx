import React from 'react';
import { Link } from 'react-router-dom';
import { IconZap, IconImage, IconBot, IconSend, IconLogo, IconShield, IconUsers, IconGraph, IconLock, IconCrown } from '../components/Icons';
import { APP_NAME } from '../constants';

export const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gray-950 font-sans selection:bg-green-500/30">
      {/* --- Global Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-green-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
      
        {/* --- Hero Section --- */}
        <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/80 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-lg shadow-green-900/20 backdrop-blur-md animate-fade-in">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                v2.5 Now Live • Powered by Openyhool
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-[1.1]">
                Intelligence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 animate-pulse-slow">
                    Reimagined
                </span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-2xl text-gray-400 mb-10 md:mb-12 leading-relaxed font-light px-2">
                Experience the next evolution of AI. <strong className="text-white font-semibold">{APP_NAME}</strong> combines ultra-low latency with multimodal understanding to solve complex problems in milliseconds.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 md:mb-20 px-4">
                <Link to="/chat" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-full overflow-hidden transition-all hover:bg-green-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] w-full sm:w-auto">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                    <span className="relative flex items-center gap-2 justify-center">Start Chatting Free <IconSend className="w-5 h-5" /></span>
                </Link>
                <Link to="/about" className="px-8 py-4 text-lg font-bold text-gray-300 bg-gray-900 border border-gray-700 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all w-full sm:w-auto">
                    View Documentation
                </Link>
            </div>

            {/* --- Hero Visual / Terminal --- */}
            <div className="relative max-w-5xl mx-auto px-2 md:px-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border-b border-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        <div className="ml-4 text-xs text-gray-500 font-mono hidden sm:block">openyhool-ai-terminal — -zsh — 80x24</div>
                    </div>
                    <div className="p-6 md:p-10 text-left font-mono text-xs sm:text-sm md:text-base bg-gray-950/90 backdrop-blur">
                        <div className="text-gray-400 mb-2">$ openyhool analyze --image ./blueprint.png</div>
                        <div className="text-green-400 mb-4 animate-pulse">
                            Processing image data... Done (0.4s)
                        </div>
                        <div className="text-gray-300 mb-2">
                            <span className="text-blue-400">Analysis:</span> The image appears to be a technical architectural blueprint for a scalable React application.
                        </div>
                        <div className="pl-4 border-l-2 border-gray-700 text-gray-400 mb-4 space-y-1">
                            <p>• Frontend: React + Tailwind + Vite</p>
                            <p>• Backend: Firebase / Node.js</p>
                            <p>• AI Model: Gemini 2.5 Flash</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">➜</span>
                            <span className="w-2 h-5 bg-gray-500 animate-pulse"></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- Stats / Social Proof --- */}
        <div className="py-10 border-y border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Trusted by developers from next-gen companies</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><div className="w-6 h-6 bg-white rounded-full"></div> ACME Corp</div>
                    <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><div className="w-6 h-6 bg-white rounded-sm rotate-45"></div> GlobalTech</div>
                    <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><div className="w-6 h-6 bg-white rounded-lg"></div> Nebula</div>
                    <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><div className="w-6 h-6 bg-white rounded-tr-xl"></div> Vertex</div>
                </div>
            </div>
        </div>

        {/* --- Bento Grid Features --- */}
        <section className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 md:text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Engineered for Performance</h2>
                <p className="text-gray-400 text-lg">We didn't just build a chatbot. We built a comprehensive AI infrastructure designed to handle your most demanding tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min lg:h-[800px]">
                
                {/* Box 1: Large Graph - Spans 2 cols, 2 rows on Desktop */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 min-h-[400px] bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-gray-600 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <IconGraph className="w-24 h-24 md:w-32 md:h-32 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Live Token Throughput</h3>
                    <p className="text-gray-400 mb-8 text-sm">Real-time processing power scaling dynamically.</p>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-green-900/20 to-transparent">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0,100 Q50,50 100,80 T200,60 T300,90 T400,40 T500,70 V200 H0 Z" fill="none" stroke="#22c55e" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <path d="M0,100 Q50,50 100,80 T200,60 T300,90 T400,40 T500,70 V200 H0 Z" fill="url(#grad1)" opacity="0.2" />
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{stopColor: '#22c55e', stopOpacity: 1}} />
                                    <stop offset="100%" style={{stopColor: '#22c55e', stopOpacity: 0}} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 flex gap-4 md:gap-8">
                         <div>
                             <div className="text-xs text-gray-500 uppercase">Requests/Sec</div>
                             <div className="text-2xl md:text-3xl font-mono font-bold text-white">4,291</div>
                         </div>
                         <div>
                             <div className="text-xs text-gray-500 uppercase">Avg Latency</div>
                             <div className="text-2xl md:text-3xl font-mono font-bold text-green-400">42ms</div>
                         </div>
                    </div>
                </div>

                {/* Box 2: Latency Comparison */}
                <div className="col-span-1 md:col-span-1 bg-gray-900/60 border border-gray-800 rounded-3xl p-6 flex flex-col justify-between group hover:border-gray-600 transition-colors min-h-[250px]">
                    <div>
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                            <IconZap className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Speed Comparison</h3>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div>
                            <div className="flex justify-between text-xs text-white mb-1">
                                <span>Openyhool AI</span>
                                <span className="text-green-400">0.4s</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%] animate-pulse"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Competitor A</span>
                                <span>1.2s</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-600 w-[40%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Box 3: Security */}
                <div className="col-span-1 md:col-span-1 bg-gray-900/60 border border-gray-800 rounded-3xl p-6 group hover:border-gray-600 transition-colors min-h-[250px]">
                     <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <IconShield className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                    <p className="text-gray-400 text-sm mb-4">SOC2 Compliant encryption for all user data.</p>
                    <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-900/50 w-fit">
                        <IconLock className="w-3 h-3" /> Encrypted
                    </div>
                </div>

                {/* Box 4: Models - Spans 2 cols on Desktop */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-3xl p-6 md:p-8 flex items-center justify-between group hover:border-green-500/30 transition-colors min-h-[250px]">
                     <div>
                         <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Multi-Model Support</h3>
                         <p className="text-gray-400 text-sm max-w-sm">Seamlessly switch between Flash for speed and Pro for complex reasoning. Image generation included.</p>
                         <div className="flex flex-wrap gap-2 mt-6">
                             <div className="px-3 py-1 rounded bg-gray-950 border border-gray-700 text-xs text-gray-300">Gemini 2.5</div>
                             <div className="px-3 py-1 rounded bg-gray-950 border border-gray-700 text-xs text-gray-300">GPT-4 Style</div>
                         </div>
                     </div>
                     <div className="hidden sm:block">
                         <div className="relative w-24 h-24 md:w-32 md:h-32">
                             <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                             <IconBot className="relative w-full h-full text-green-500 drop-shadow-2xl" />
                         </div>
                     </div>
                </div>
            </div>
        </section>

        {/* --- Text Content / Grid --- */}
        <section className="py-20 md:py-24 bg-black border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white border-l-4 border-green-500 pl-4">Creative Writing</h4>
                         <p className="text-gray-400 leading-relaxed">
                             Unlock your creativity with an AI that understands nuance, tone, and style. From marketing copy to storytelling, Openyhool adapts to your voice.
                         </p>
                     </div>
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white border-l-4 border-purple-500 pl-4">Code Generation</h4>
                         <p className="text-gray-400 leading-relaxed">
                             Write clean, efficient code in Python, JavaScript, Rust, and more. Debug errors instantly and refactor legacy codebases with context awareness.
                         </p>
                     </div>
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white border-l-4 border-blue-500 pl-4">Data Analysis</h4>
                         <p className="text-gray-400 leading-relaxed">
                             Upload spreadsheets or raw data. Get instant summaries, trend analysis, and actionable insights without writing a single formula.
                         </p>
                     </div>
                 </div>
            </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-green-900/10 z-0"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <IconCrown className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">Ready to upgrade your workflow?</h2>
                <p className="text-lg md:text-xl text-gray-400 mb-10">Join thousands of users who are working smarter, not harder.</p>
                <Link to="/pricing" className="inline-block bg-white text-gray-900 px-8 md:px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-xl w-full sm:w-auto">
                    Get Started for Free
                </Link>
                <p className="mt-6 text-sm text-gray-500">No credit card required • Cancel anytime</p>
            </div>
        </section>

      </div>
    </div>
  );
};