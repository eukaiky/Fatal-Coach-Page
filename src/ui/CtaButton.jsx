import React from 'react';

const variants = {
  primary:
    'bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/40',
  outline:
    'border border-gray-700 hover:border-gray-600 bg-black/30 hover:bg-gray-900/50 text-gray-300 hover:text-white font-medium',
  secondary: 'bg-gray-700 hover:bg-gray-800 text-white font-medium',
};

export function CtaButton({
  href,
  children,
  icon,
  variant = 'primary',
  className = '',
  ...props
}) {
  const styles = `
    inline-flex items-center justify-center gap-2
    px-6 py-3
    text-sm uppercase tracking-wider
    rounded-lg transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${className}
  `;

  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={styles}
        target={href.startsWith('#') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      type={props.type || "button"}
      className={styles}
      {...props}
    >
      {content}
    </button>
  );
}