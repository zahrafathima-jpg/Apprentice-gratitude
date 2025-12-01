import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { INSPIRATIONAL_QUOTES } from './constants';

// Declaration for the confetti library loaded via CDN
declare global {
  interface Window {
    confetti: any;
  }
}

type Step = 'qr' | 'input' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('qr');
  const [name, setName] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  useEffect(() => {
    // 1. Pre-select a quote so it's ready
    const randomQuote = INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);

    // 2. Determine URL for QR Code
    // We add ?s=1 to indicate "Start" mode for the student so they skip the QR page
    const baseUrl = window.location.href.split('?')[0];
    const studentUrl = `${baseUrl}?s=1`;
    const encodedUrl = encodeURIComponent(studentUrl);
    
    // 3. Generate High-Contrast, Low-Density QR Code via QuickChart
    // ecLevel=L (Low) makes the pattern less dense = easier to scan
    // margin=4 adds a white border (quiet zone)
    // dark=000000 ensures pure black for contrast
    setQrImageUrl(`https://quickchart.io/qr?text=${encodedUrl}&size=500&ecLevel=L&dark=000000&light=ffffff&margin=4`);

    // 4. Check if the user arrived via the QR code
    const params = new URLSearchParams(window.location.search);
    if (params.get('s') === '1') {
      setStep('input');
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Trigger Confetti
    triggerConfetti();
    setStep('result');
  };

  const triggerConfetti = () => {
    // Safety check for the confetti library
    if (typeof window.confetti === 'function') {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Since particles fall down, start a bit higher than random
        window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        
        {/* STEP 1: QR CODE DISPLAY (For the Organizer/Screen) */}
        {step === 'qr' && (
          <div className="print-card bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Apprentices!</h2>
            <p className="text-gray-600 mb-8">Scan to unlock your personalized message.</p>
            
            <div className="bg-white p-2 rounded-xl border-2 border-gray-100 inline-block mb-8 shadow-sm">
              <img 
                src={qrImageUrl} 
                alt="Scan this QR Code" 
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
              />
            </div>

            <div className="no-print space-y-4">
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                Note: If scanning leads to "localhost" and fails, you must deploy this app to the web first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setStep('input')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
                >
                  Start Manual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: NAME INPUT (For the Student) */}
        {step === 'input' && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
             <div className="mb-6 flex justify-center">
               <span className="text-4xl">👋</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Who is this awesome apprentice?</h2>
             <p className="text-gray-500 mb-8 text-sm">Enter your name to receive your message.</p>
             
             <form onSubmit={handleUnlock} className="space-y-6">
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Your Name"
                 className="w-full text-center text-xl p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg placeholder-gray-300"
                 autoFocus
               />
               <button 
                 type="submit"
                 disabled={!name.trim()}
                 className={`
                   w-full py-4 rounded-xl text-lg font-bold text-white transition-all duration-300 transform
                   ${name.trim() 
                     ? 'bg-blue-600 hover:bg-blue-700 shadow-lg scale-100' 
                     : 'bg-gray-300 cursor-not-allowed scale-[0.98]'
                   }
                 `}
               >
                 Start My Message
               </button>
             </form>
          </div>
        )}

        {/* STEP 3: THE REVEAL */}
        {step === 'result' && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border-t-8 border-blue-500 relative overflow-hidden animate-quote-reveal">
            
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-yellow-50 opacity-50 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-50 opacity-50 blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Hello, <span className="text-blue-600">{name}</span>!
              </h2>
              
              <div className="my-8">
                 <div className="inline-block p-4 rounded-full bg-gray-50 mb-6">
                    <span className="text-4xl">✨</span>
                 </div>
                 <blockquote className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed font-google-sans italic">
                   "{currentQuote}"
                 </blockquote>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Google Apprentice 2025
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Footer / Copyright */}
      <footer className="p-6 text-center text-gray-400 text-xs no-print">
        <p>© 2025 Google Apprentice Brand Studio</p>
      </footer>
    </div>
  );
};

export default App;