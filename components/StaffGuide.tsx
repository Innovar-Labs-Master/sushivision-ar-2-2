
import React from 'react';
import { StaffGuide as StaffGuideType } from '../types';
import { ClipboardList, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  guide: StaffGuideType;
}

const StaffGuide: React.FC<Props> = ({ guide }) => {
  return (
    <div className="h-full bg-white text-gray-900 rounded-xl overflow-hidden flex flex-col font-sans animate-in fade-in duration-500">
      <div className="bg-gray-900 text-white p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-sushi-gold" />
          <h3 className="font-bold uppercase tracking-wider">Staff Training Mode</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          guide.difficulty === 'Easy' ? 'bg-green-500' :
          guide.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
        } text-black`}>
          {guide.difficulty}
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center gap-2 mb-6 text-gray-600 bg-gray-100 p-3 rounded-lg">
          <Clock size={18} />
          <span className="font-medium">Prep Time: {guide.prepTime}</span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-3 border-b pb-2 border-gray-200">Assembly Steps</h4>
            <div className="space-y-3">
              {guide.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Critical Safety & Presentation
            </h4>
            <ul className="space-y-2">
              {guide.safetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-orange-900">
                  <CheckCircle2 size={14} className="mt-1 text-orange-500 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffGuide;
