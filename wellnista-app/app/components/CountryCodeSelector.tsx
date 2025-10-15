'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { countryCodes, CountryCode } from '../../config/countryCodes';

interface CountryCodeSelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  className?: string;
}

export default function CountryCodeSelector({
  selectedCountry,
  onCountryChange,
  className = ''
}: CountryCodeSelectorProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCountryName = (country: CountryCode) => {
    return country.name[locale as keyof typeof country.name] || country.name.en;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-4 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-[56px]"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="text-base font-medium text-gray-900">
            {selectedCountry.dialCode}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {countryCodes.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onCountryChange(country);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 ${
                selectedCountry.code === country.code ? 'bg-primary text-white' : ''
              }`}
            >
              <span className="text-xl mr-3">{country.flag}</span>
              <div className="flex-1">
                <div className="text-base font-medium">
                  {country.dialCode}
                </div>
                <div className="text-sm text-gray-500">
                  {getCountryName(country)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 