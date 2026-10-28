import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DocumentToolsPage } from '../DocumentToolsPage';
import { PageView } from '../../types';

interface ImageEnhancerPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const ImageEnhancerPage: React.FC<ImageEnhancerPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <DocumentToolsPage 
      setCurrentPage={setCurrentPage} 
      showToast={showToast} 
      initialTab="image-enhancer" 
    />
  );
};
