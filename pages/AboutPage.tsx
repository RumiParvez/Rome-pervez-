import React from 'react';
import { APP_NAME } from '../constants';
import { IconLogo, IconBot, IconImage, IconZap, IconSettings, IconCrown } from '../components/Icons';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white overflow-x-hidden">
       {/* Hero Section */}
       <div className="relative py-24 sm:py-32 text-center overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-600/20 rounded-full blur-[120px] -z-10"></div>
           <div className="max-w-4xl mx-auto px-4 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-medium mb-6 uppercase tracking-wider">
                   About Us
               </div>
               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                  The Future of <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Intelligent Conversations</span>
               </h1>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {APP_NAME} is a next-generation artificial intelligence platform built to redefine how humans interact with technology.
               </p>
           </div>
       </div>

       {/* Vision Section */}
       <div className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-green-500 font-bold tracking-widest uppercase text-sm">Our Vision</h2>
                 <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white">Making AI Limitless for Everyone</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                      <p>
                          We believe AI should not feel distant, robotic, or complicated. {APP_NAME} brings human-like intelligence directly to your hands — allowing you to think, create, learn, explore, and build faster than ever.
                      </p>
                      <p>
                          With a Google-like clean interface and ChatGPT-style intelligence, we transform the way people work:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {[
                              "Smarter conversations",
                              "Faster problem-solving",
                              "Creative assistance",
                              "Professional-grade tools",
                              "Seamless automation"
                          ].map((item, i) => (
                              <li key={i} className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">✓</div>
                                  <span className="text-gray-200 text-base">{item}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 blur-2xl opacity-20 rounded-3xl group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-black/50">
                              <IconLogo className="w-10 h-10 text-green-500" />
                          </div>
                          <blockquote className="text-center text-xl font-medium text-gray-200 italic">
                              "We’re building an ecosystem where AI becomes your everyday companion — intelligent, adaptive, and always ready."
                          </blockquote>
                      </div>
                  </div>
              </div>
          </div>
       </div>

       {/* What We Offer Grid */}
       <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">What We Offer</h2>
            <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
                {APP_NAME} is not just one tool — it’s a complete AI platform with everything you need.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        icon: IconBot,
                        title: "Advanced AI Chatbot",
                        desc: "Human-like responses, deep reasoning, code generation, creative writing, and multi-model support."
                    },
                    {
                        icon: IconImage,
                        title: "AI Image Generator",
                        desc: "Generate stunning images, artwork, logos, and visuals with simple text prompts."
                    },
                    {
                        icon: IconCrown,
                        title: "Prompt Library",
                        desc: "Carefully crafted prompts for productivity, business, study, entertainment, and creativity."
                    },
                    {
                        icon: IconSettings,
                        title: "AI Tools Hub",
                        desc: "A growing collection of utilities: Text-to-Speech, PDF analyzer, Coding tools, and Research assistant."
                    }
                ].map((card, idx) => (
                    <div key={idx} className="group relative p-1 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 hover:from-green-500/50 hover:to-emerald-600/50 transition-all duration-300">
                        <div className="bg-gray-950 h-full rounded-xl p-6 relative z-10 flex flex-col">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800 group-hover:border-green-500/30 group-hover:scale-110 transition-all duration-300">
                                <card.icon className="w-7 h-7 text-green-500 group-hover:text-green-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white">{card.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
       </div>

       {/* Why Choose & Mission */}
       <div className="py-20 bg-gray-900/50 border-y border-gray-800">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid lg:grid-cols-2 gap-20">
                   <div>
                       <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                           Why Choose {APP_NAME}?
                       </h2>
                       <div className="grid gap-8">
                           {[
                               { icon: IconZap, title: "Ultra Fast", desc: "Optimized server architecture ensures every response is instant and smooth." },
                               { icon: IconLogo, title: "Modern UI", desc: "Minimal, clean, glassmorphism interface designed for focus and creativity." },
                               { icon: IconCrown, title: "Privacy First", desc: "Your conversations, files, and history remain secure and encrypted." },
                               { icon: IconSettings, title: "Continuous Updates", desc: "Evolving constantly with new features, new models, and major improvements." }
                           ].map((item, i) => (
                               <div key={i} className="flex gap-5">
                                   <div className="w-12 h-12 rounded-xl bg-green-900/20 border border-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400">
                                       <item.icon className="w-6 h-6" />
                                   </div>
                                   <div>
                                       <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                                       <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="relative">
                       <div className="absolute -inset-4 bg-gradient-to-tr from-green-600/20 to-blue-600/20 rounded-[2rem] blur-xl"></div>
                       <div className="relative bg-gray-950 p-10 rounded-[2rem] border border-gray-800 h-full flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
                            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                                Our mission is to democratize AI — making advanced intelligence accessible to all, regardless of background or skill level.
                            </p>
                            
                            <div className="space-y-3">
                                <div className="group p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-green-500/50 transition-colors">
                                    <span className="text-green-400 font-bold block mb-1 text-sm uppercase tracking-wider">For Students</span>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">A personal tutor available 24/7.</span>
                                </div>
                                <div className="group p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-green-500/50 transition-colors">
                                    <span className="text-green-400 font-bold block mb-1 text-sm uppercase tracking-wider">For Creators</span>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">The ultimate brainstorming partner.</span>
                                </div>
                                <div className="group p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-green-500/50 transition-colors">
                                    <span className="text-green-400 font-bold block mb-1 text-sm uppercase tracking-wider">For Professionals</span>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Your daily productivity engine.</span>
                                </div>
                            </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Philosophy Footer */}
       <div className="py-24 text-center bg-black/40">
           <div className="max-w-5xl mx-auto px-4">
               <h2 className="text-sm font-bold text-green-500 mb-10 uppercase tracking-[0.2em]">{APP_NAME} Philosophy</h2>
               <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-2xl md:text-3xl font-bold text-gray-500">
                   <span className="text-white">Think Bigger</span>
                   <span className="hidden md:inline">•</span>
                   <span className="text-white">Build Smarter</span>
                   <span className="hidden md:inline">•</span>
                   <span className="text-white">Move Faster</span>
                   <span className="hidden md:inline">•</span>
                   <span className="text-white">Create Fearlessly</span>
               </div>
               <div className="mt-16 p-1 inline-block bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full">
                  <div className="bg-gray-950 rounded-full px-8 py-3">
                       <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                           Empower humanity with AI.
                       </p>
                  </div>
               </div>
           </div>
       </div>
    </div>
  );
};