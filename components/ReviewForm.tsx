
import React, { useState } from 'react';
import { Star, Send, ThumbsUp } from 'lucide-react';

interface Props {
  onSubmit: (rating: number, text: string) => void;
}

const ReviewForm: React.FC<Props> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, text);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
          <ThumbsUp className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
        <p className="text-gray-400">Your review helps us improve.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          <h2 className="text-xl font-bold text-white">Rate your experience</h2>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={36} 
                fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"} 
                className={(hoverRating || rating) >= star ? "text-sushi-gold" : "text-gray-600"}
              />
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share details of your own experience at this place..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            rating > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
          Post Review
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
