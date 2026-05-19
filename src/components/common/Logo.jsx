export default function Logo({ variant = 'dark', size = 'md', className = '' }) {
  const logoSrc = variant === 'light' ? '/logo-white.svg' : '/logo.svg';
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <img 
      src={logoSrc} 
      alt="RMNA Street" 
      className={`${sizeClasses[size] || sizeClasses.md} w-auto ${className}`}
    />
  );
}
