import { useEffect, useRef } from 'react';

interface KonfHubButtonProps {
  buttonId: string;
}

const KonfHubButton = ({ buttonId }: KonfHubButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create and append the script
    const script = document.createElement('script');
    script.src = 'https://widget.konfhub.com/widget.js';
    script.setAttribute('button_id', buttonId);
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [buttonId]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
};

export default KonfHubButton;
