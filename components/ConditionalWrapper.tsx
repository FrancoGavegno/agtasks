import React from 'react';

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({ 
  condition, 
  wrapper, 
  children 
}) => {
  return condition ? <>{wrapper(children)}</> : <>{children}</>;
};

export default ConditionalWrapper;
