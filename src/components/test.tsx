import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const TestComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Button>{t('clickMe')}</Button>
    </div>
  );
};

export default TestComponent;
