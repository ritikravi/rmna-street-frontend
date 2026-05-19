import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { selectComparisonCount } from '../../store/slices/comparisonSlice';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const comparisonCount = useSelector(selectComparisonCount);
  
  // WhatsApp number (replace with your actual number)
  const phoneNumber = '919117328809'; // Format: country code + number (no + or spaces)
  const message = 'Hi! I need help with RMNA Street.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Adjust bottom position when comparison bar is visible
  const bottomClass = comparisonCount > 0 ? 'bottom-20 sm:bottom-24' : 'bottom-6';

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className={`fixed left-4 sm:left-6 z-50 transition-all duration-300 ${bottomClass}`}>
        {isOpen && (
          <div className="mb-4 bg-white rounded-lg shadow-2xl p-4 w-64 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-sm">RMNA Street</p>
                  <p className="text-xs text-gray-500">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Hi there! 👋 How can we help you today?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-medium transition-colors"
            >
              Start Chat
            </a>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="WhatsApp Support"
        >
          {isOpen ? (
            <FaTimes className="text-xl sm:text-2xl" />
          ) : (
            <FaWhatsapp className="text-2xl sm:text-3xl" />
          )}
        </button>
      </div>
    </>
  );
};

export default WhatsAppButton;
