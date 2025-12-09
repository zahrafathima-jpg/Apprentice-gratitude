import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { INSPIRATIONAL_QUOTES } from './constants';

// Declaration for the confetti library loaded via CDN
declare global {
  interface Window {
    confetti: any;
    webkitAudioContext: typeof AudioContext;
  }
}

type Step = 'qr' | 'input' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('qr');
  const [name, setName] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  // --- Audio Logic ---
  const playAudio = (type: 'click' | 'success') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 987.77]; 
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const startTime = now + (i * 0.05);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0);
          osc.start(startTime);
          osc.stop(startTime + 2.0);
        });
      }
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    // 1. Pre-select a quote
    const randomQuote = INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);

    // 2. Initial URL detection with Smart Correction
    // Uses current window location so it works on any domain (GitHub Pages, Vercel, localhost, etc.)
    let baseUrl = window.location.href.split('?')[0];

    // HEURISTIC: Fix Vercel Preview URLs to avoid "Login to Vercel" on scan
    // Pattern: project-git-branch-user.vercel.app -> project.vercel.app
    if (baseUrl.includes('-git-') && baseUrl.includes('.vercel.app')) {
      try {
        const urlObj = new URL(baseUrl);
        const parts = urlObj.hostname.split('-git-');
        if (parts.length > 0) {
          // Reconstruct as https://projectname.vercel.app
          urlObj.hostname = `${parts[0]}.vercel.app`;
          baseUrl = urlObj.toString();
        }
      } catch (e) {
        console.warn("Could not auto-correct Vercel URL", e);
      }
    }

    setTargetUrl(baseUrl);

    // 3. Check if the user arrived via the QR code (has ?s=1)
    const params = new URLSearchParams(window.location.search);
    if (params.get('s') === '1') {
      setStep('input');
    }
  }, []);

  // Effect to regenerate QR whenever the targetUrl changes
  useEffect(() => {
    if (!targetUrl) return;
    
    // Ensure we append the start parameter so scanners go straight to input
    // Remove trailing slash if present for cleaner URL
    const cleanBase = targetUrl.endsWith('/') ? targetUrl.slice(0, -1) : targetUrl;
    const studentUrl = `${cleanBase}?s=1`;
    const encodedUrl = encodeURIComponent(studentUrl);
    
    setQrImageUrl(`https://quickchart.io/qr?text=${encodedUrl}&size=500&ecLevel=L&dark=000000&light=ffffff&margin=4`);
  }, [targetUrl]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playAudio('success');
    triggerConfetti();
    setStep('result');
  };

  const triggerConfetti = () => {
    if (typeof window.confetti === 'function') {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        const coolColors = ['#6366f1', '#06b6d4', '#a855f7'];
        
        window.confetti(Object.assign({}, defaults, { 
          particleCount, 
          colors: coolColors,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        window.confetti(Object.assign({}, defaults, { 
          particleCount, 
          colors: coolColors,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        
        {/* STEP 1: QR CODE DISPLAY */}
        {step === 'qr' && (
          <div className="print-card bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready for some inspiration?</h2>
            <p className="text-gray-600 mb-8">Scan to unlock your daily insight.</p>
            
            <div className="bg-white p-2 rounded-xl border-2 border-gray-100 inline-block mb-6 shadow-sm">
              <img 
                src={qrImageUrl} 
                alt="QR Code to scan and open this app on mobile" 
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
              />
            </div>

            <div className="no-print space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    playAudio('click');
                    setStep('input');
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors focus:ring-4 focus:ring-indigo-200 focus:outline-none shadow-md hover:shadow-lg"
                >
                  Start Manual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: NAME INPUT */}
        {step === 'input' && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
             <div className="mb-6 flex justify-center" aria-hidden="true">
               <span className="text-4xl">👋</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get started.</h2>
             
             <form onSubmit={handleUnlock} className="space-y-6">
               <label htmlFor="name-input" className="block text-gray-500 mb-8 text-sm">
                 Enter your name to unlock your quote.
               </label>
               
               <input 
                 id="name-input"
                 name="name"
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 onFocus={() => playAudio('click')}
                 placeholder="Your Name"
                 autoComplete="given-name"
                 className="w-full text-center text-xl p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:ring-offset-2 focus:outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg placeholder-gray-400 text-gray-900"
                 autoFocus
               />
               <button 
                 type="submit"
                 disabled={!name.trim()}
                 aria-label="Unlock my personalized message"
                 className={`
                   w-full py-4 rounded-xl text-lg font-bold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-offset-2
                   ${name.trim() 
                     ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-1 scale-100 focus:ring-indigo-500' 
                     : 'bg-gray-300 cursor-not-allowed scale-[0.98]'
                   }
                 `}
               >
                 Unlock Message
               </button>
             </form>
          </div>
        )}

        {/* STEP 3: THE REVEAL */}
        {step === 'result' && (
          <div 
            className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border-t-8 border-indigo-500 relative overflow-hidden animate-quote-reveal"
            aria-live="polite"
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple-100 opacity-50 blur-xl" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-teal-100 opacity-50 blur-xl" aria-hidden="true"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Hello, <span className="text-indigo-600">{name}</span>!
              </h2>
              
              <div className="my-8">
                 <div className="inline-block p-4 rounded-full bg-gray-50 mb-6" aria-hidden="true">
                    <span className="text-4xl">✨</span>
                 </div>
                 <blockquote className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed font-google-sans italic">
                   "{currentQuote}"
                 </blockquote>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Food for Thought
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;