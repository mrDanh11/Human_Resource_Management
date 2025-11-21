/**
 * Logo.tsx - Logo component thống nhất cho toàn bộ ứng dụng
 * Sử dụng logo.png từ assets/images
 */

import logoImage from '../../assets/images/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only' | 'text-only';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: {
      logo: 'h-8',
      text: 'text-lg font-bold',
      container: 'gap-2'
    },
    md: {
      logo: 'h-10',
      text: 'text-xl font-bold',
      container: 'gap-2'
    },
    lg: {
      logo: 'h-16',
      text: 'text-3xl font-bold',
      container: 'gap-3'
    }
  };

  const sizeConfig = sizeClasses[size];

  const renderLogo = () => (
    <img 
      src={logoImage} 
      alt="HRMS Logo"
      className={`${sizeConfig.logo} w-auto object-contain`}
      onError={(e) => {
        // Fallback nếu không load được logo
        const target = e.currentTarget;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="bg-blue-600 text-white rounded-lg p-2 ${sizeConfig.logo.replace('h-', 'h-')} flex items-center justify-center font-bold">HR</div>`;
        }
      }}
    />
  );

  const renderText = () => (
    <div className="flex flex-col leading-tight">
      <span className={`${sizeConfig.text} text-blue-600`}>
        HRMS
      </span>
      {size === 'lg' && (
        <span className="text-xs text-gray-600 opacity-80 font-normal">
          Human Resource Management
        </span>
      )}
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div className={className}>
        {renderLogo()}
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={className}>
        {renderText()}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeConfig.container} ${className}`}>
      {renderLogo()}
      {renderText()}
    </div>
  );
};

export default Logo;