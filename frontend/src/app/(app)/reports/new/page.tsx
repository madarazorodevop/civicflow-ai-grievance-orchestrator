"use client";

import React, { useState } from "react";
import { Camera, MapPin, Send, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const requestLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        setLocationError("Location unavailable. You can enter it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Report submitted successfully! (Simulation)");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4 lg:mt-8">
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-blue-100 mt-1">Help us improve your city by reporting civic issues.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        
        {/* Photo Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-900">1. Provide a Photo</label>
          <div className="relative">
            {imagePreview ? (
              <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                <button 
                  type="button" 
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <Camera className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Take a photo or upload</span>
                <span className="text-xs text-gray-500 mt-1">JPEG, PNG up to 10MB</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageCapture}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold text-gray-900">2. Describe the Issue</label>
          <textarea 
            id="description"
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
            placeholder="E.g., Large pothole in the right lane causing vehicles to swerve."
          />
        </div>

        {/* Location Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-900">3. Issue Location</label>
          
          <div className="flex flex-col gap-3">
            {!location ? (
              <button 
                type="button"
                onClick={requestLocation}
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-blue-200 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Detect My Location
              </button>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium text-green-900">Location detected</span>
                  <span className="text-sm text-green-700 font-mono mt-1">
                    Lat: {location.lat.toFixed(6)}<br/>
                    Lng: {location.lng.toFixed(6)}
                  </span>
                  <span className="text-xs text-green-600 mt-1">Accuracy: {Math.round(location.accuracy)} meters</span>
                </div>
                <button 
                  type="button" 
                  onClick={requestLocation}
                  className="ml-auto text-xs font-medium text-green-800 underline"
                >
                  Update
                </button>
              </div>
            )}

            {locationError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <div className="flex flex-col">
                  <span className="font-medium">{locationError}</span>
                  <button type="button" className="text-left font-medium underline mt-1">Enter location manually</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-6 h-6" /> Submit Report</>
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">
            By submitting, you agree to the public disclosure of this report.
          </p>
        </div>

      </form>
    </div>
  );
}
