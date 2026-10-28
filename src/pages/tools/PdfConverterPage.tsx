import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentToolsPage } from '../DocumentToolsPage';
import { PageView } from '../../types';

interface PdfConverterPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const PdfConverterPage: React.FC<PdfConverterPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <DocumentToolsPage 
      setCurrentPage={setCurrentPage} 
      showToast={showToast} 
      initialTab="pdf-to-word" 
    />
  );
};
