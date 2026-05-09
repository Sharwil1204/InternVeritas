import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// 1. FormData Interface
export interface AnalyzerFormData {
  companyName: string;
  advertisement: string;
  advertisementFile: File | null;
  email: string;
  paymentRequired: boolean;
  linkedinUrl: string;
  linkedinChecks: any; // Can be refined based on specific needs
  linkedinObservations: string;
  interviewProcess: string;
  companyVerification: string;
}

// 2. AnalysisResult Interface
export interface AnalysisResult {
  trustScore: number;
  level: string; // e.g., 'Low Risk', 'High Risk'
  explanation: string;
  factorBreakdown: any; // Can be refined
  companyVerification: any; // Can be refined
  emailAnalysis: any; // Can be refined
}

// Context Type Definition
interface AnalyzerContextType {
  formData: AnalyzerFormData;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  updateFormData: (data: Partial<AnalyzerFormData>) => void;
  analyzeInternship: () => Promise<void>;
  clearData: () => void;
}

const initialFormData: AnalyzerFormData = {
  companyName: '',
  advertisement: '',
  advertisementFile: null,
  email: '',
  paymentRequired: false,
  linkedinUrl: '',
  linkedinChecks: null,
  linkedinObservations: '',
  interviewProcess: '',
  companyVerification: '',
};

const AnalyzerContext = createContext<AnalyzerContextType | undefined>(undefined);

export const AnalyzerProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<AnalyzerFormData>(initialFormData);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateFormData = (data: Partial<AnalyzerFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearData = () => {
    setFormData(initialFormData);
    setAnalysisResult(null);
  };

  const analyzeInternship = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const uploadData = new FormData();

      // Append basic fields
      uploadData.append('companyName', formData.companyName);
      uploadData.append('email', formData.email);
      uploadData.append('paymentRequired', String(formData.paymentRequired));
      uploadData.append('linkedinUrl', formData.linkedinUrl);
      uploadData.append('linkedinObservations', formData.linkedinObservations);
      uploadData.append('interviewProcess', formData.interviewProcess);
      uploadData.append('companyVerification', formData.companyVerification);

      if (formData.linkedinChecks) {
        uploadData.append('linkedinChecks', JSON.stringify(formData.linkedinChecks));
      }

      // Handle Advertisement File vs Text
      if (formData.advertisementFile) {
        uploadData.append('file', formData.advertisementFile);
      } else if (formData.advertisement) {
        // Fallback: If no file but text exists, convert text to Blob and send as file
        const blob = new Blob([formData.advertisement], { type: 'text/plain' });
        uploadData.append('file', blob, 'advertisement.txt');
      }

      const response = await axios.post<AnalysisResult>(`${apiUrl}/upload`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing internship:', error);
      // Optional: Handle error state here
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnalyzerContext.Provider
      value={{
        formData,
        analysisResult,
        isLoading,
        updateFormData,
        analyzeInternship,
        clearData,
      }}
    >
      {children}
    </AnalyzerContext.Provider>
  );
};

export const useAnalyzer = () => {
  const context = useContext(AnalyzerContext);
  if (context === undefined) {
    throw new Error('useAnalyzer must be used within an AnalyzerProvider');
  }
  return context;
};
