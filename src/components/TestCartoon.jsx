import React from 'react';
import { Smile } from 'lucide-react';

const TestCartoon = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-500 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <Smile size={24} className="text-white" />
        <span className="text-white font-bold">Test Cartoon</span>
      </div>
    </div>
  );
};

export default TestCartoon; 