import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface SymptomCheckerProps {
  onSubmitSymptoms: (symptoms: string, severity: 'mild' | 'moderate' | 'severe') => void;
}

export function SymptomChecker({ onSubmitSymptoms }: SymptomCheckerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you describe your symptoms. Please tell me what you're experiencing.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [step, setStep] = useState<'collecting' | 'severity'>('collecting');
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    addMessage(input, false);
    const userInput = input;
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      if (step === 'collecting') {
        setCurrentSymptoms((prev) => [...prev, userInput]);

        const responses = [
          "I understand. Are you experiencing any other symptoms?",
          "Thank you for sharing. Do you have any additional symptoms to report?",
          "Noted. Is there anything else you'd like to mention?",
        ];
        addMessage(responses[Math.floor(Math.random() * responses.length)], true);
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleDone = () => {
    if (currentSymptoms.length === 0) return;

    setStep('severity');
    addMessage("Thank you. How would you rate the overall severity of your symptoms?", true);
  };

  const handleSeveritySelect = (severity: 'mild' | 'moderate' | 'severe') => {
    const symptomsText = currentSymptoms.join('. ');
    onSubmitSymptoms(symptomsText, severity);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-semibold">AI Health Assistant</h2>
            <p className="text-blue-100 text-sm">Describe your symptoms</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.isBot
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {step === 'collecting' && (
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {currentSymptoms.length > 0 && (
            <button
              onClick={handleDone}
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              I'm done describing symptoms
            </button>
          )}
        </div>
      )}

      {step === 'severity' && (
        <div className="border-t p-6 space-y-3">
          <p className="text-sm text-gray-600 mb-4">Select severity level:</p>
          <button
            onClick={() => handleSeveritySelect('mild')}
            className="w-full bg-green-100 text-green-800 py-3 rounded-lg hover:bg-green-200 transition-colors font-medium"
          >
            Mild - Minor discomfort
          </button>
          <button
            onClick={() => handleSeveritySelect('moderate')}
            className="w-full bg-yellow-100 text-yellow-800 py-3 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
          >
            Moderate - Noticeable symptoms
          </button>
          <button
            onClick={() => handleSeveritySelect('severe')}
            className="w-full bg-red-100 text-red-800 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Severe - Significant discomfort
          </button>
        </div>
      )}
    </div>
  );
}
