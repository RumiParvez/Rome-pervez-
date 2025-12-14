import React from 'react';
import { IconCrown, IconZap, IconBot, IconImage } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants';

export const PricingPage: React.FC = () => {
    const { user, subscribe } = useAuth();
    const navigate = useNavigate();

    const handleSubscribe = (plan: 'free' | 'pro' | 'lifetime') => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/pricing' } } });
            return;
        }

        // If already on this plan, go to chat
        if (user.subscriptionPlan === plan) {
            navigate('/chat');
            return;
        }
        
        // Payment logic bypassed: All plans are currently free
        subscribe(plan);
        navigate('/chat');
    };

    return (
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-950">
            <div className="text-center mb-16">
                <h2 className="text-base font-semibold text-green-400 tracking-wide uppercase">Pricing</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                    Choose your plan to start
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
                    All plans are currently <strong>FREE</strong> for a limited time!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Tier */}
                <div className={`bg-gray-900 border ${user?.subscriptionPlan === 'free' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-800'} rounded-2xl p-8 flex flex-col relative`}>
                    {user?.subscriptionPlan === 'free' && <div className="absolute top-4 right-4 text-green-500 text-xs font-bold uppercase bg-green-900/30 px-2 py-1 rounded">Current</div>}
                    <h3 className="text-xl font-semibold text-white">Free</h3>
                    <div className="mt-4 flex items-baseline text-white">
                        <span className="text-5xl font-extrabold tracking-tight">$0</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-6 space-y-4 flex-1">
                        <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center mr-3 text-green-400 text-xs">✓</div>
                             10,000 Tokens included
                        </li>
                        <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center mr-3 text-green-400 text-xs">✓</div>
                             Standard Response Speed
                        </li>
                         <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center mr-3 text-green-400 text-xs">✓</div>
                             Basic Chat History
                        </li>
                    </ul>
                    <button 
                        onClick={() => handleSubscribe('free')}
                        className={`mt-8 block w-full rounded-xl py-3 text-sm font-semibold text-white text-center transition-colors ${
                            user?.subscriptionPlan === 'free' 
                            ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/40' 
                            : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                        }`}
                    >
                        {user?.subscriptionPlan === 'free' ? 'Start Chat' : 'Get Started'}
                    </button>
                </div>

                {/* Pro Tier */}
                <div className={`bg-gradient-to-b from-green-900/20 to-gray-900 border ${user?.subscriptionPlan === 'pro' ? 'border-green-400 ring-2 ring-green-400' : 'border-green-500/50'} rounded-2xl p-8 flex flex-col relative transform scale-105 shadow-2xl shadow-green-900/20`}>
                     {user?.subscriptionPlan === 'pro' && <div className="absolute top-4 left-4 text-green-500 text-xs font-bold uppercase bg-green-900/30 px-2 py-1 rounded">Current</div>}
                    <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Popular
                    </div>
                    <h3 className="text-xl font-semibold text-white">Pro</h3>
                    <div className="mt-4 flex items-baseline text-white">
                        <span className="text-5xl font-extrabold tracking-tight">$0</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400 line-through decoration-red-500 decoration-2"> $19</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-6 space-y-4 flex-1">
                        <li className="flex items-center text-white">
                             <IconCrown className="w-5 h-5 text-yellow-400 mr-3" />
                             Unlimited Tokens
                        </li>
                        <li className="flex items-center text-white">
                             <IconZap className="w-5 h-5 text-green-400 mr-3" />
                             Fastest Response Time
                        </li>
                        <li className="flex items-center text-white">
                             <IconImage className="w-5 h-5 text-purple-400 mr-3" />
                             Priority Image Vision
                        </li>
                        <li className="flex items-center text-white">
                             <IconBot className="w-5 h-5 text-emerald-400 mr-3" />
                             Access to New Models
                        </li>
                    </ul>
                    <button 
                        onClick={() => handleSubscribe('pro')}
                        className={`mt-8 block w-full rounded-xl py-3 text-sm font-semibold text-white text-center transition-colors shadow-lg shadow-green-500/40 ${
                            user?.subscriptionPlan === 'pro' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                         {user?.subscriptionPlan === 'pro' ? 'Start Chat' : 'Upgrade for Free'}
                    </button>
                </div>

                {/* Lifetime Tier */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
                    <h3 className="text-xl font-semibold text-white">Lifetime</h3>
                    <div className="mt-4 flex items-baseline text-white">
                        <span className="text-5xl font-extrabold tracking-tight">$0</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400 line-through decoration-red-500 decoration-2"> $199</span>
                        <span className="ml-1 text-xl font-semibold text-gray-400">/once</span>
                    </div>
                    <ul className="mt-6 space-y-4 flex-1">
                        <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 text-purple-400 text-xs">✓</div>
                             One-time payment
                        </li>
                        <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 text-purple-400 text-xs">✓</div>
                             All Pro features included
                        </li>
                         <li className="flex items-center text-gray-300">
                             <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 text-purple-400 text-xs">✓</div>
                             Priority Support
                        </li>
                    </ul>
                    <button 
                        onClick={() => handleSubscribe('lifetime')}
                        className={`mt-8 block w-full rounded-xl py-3 text-sm font-semibold text-white text-center transition-colors ${
                            user?.subscriptionPlan === 'lifetime' 
                            ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/40' 
                            : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                        }`}
                    >
                         {user?.subscriptionPlan === 'lifetime' ? 'Start Chat' : 'Get Lifetime Free'}
                    </button>
                </div>
            </div>
        </div>
    );
};