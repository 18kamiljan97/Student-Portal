import React from 'react';
import { User } from 'react-feather';

function UserAvatar({ src, alt, size = 32 }) {
    const [hasError, setHasError] = React.useState(false);
    
    const handleError = () => {
        setHasError(true);
    };
    
    return (
        <div 
            className="user-avatar"
            style={{ 
                width: `${size}px`, 
                height: `${size}px` 
            }}
        >
            {!hasError && src ? (
                <img 
                    src={src} 
                    alt={alt || "User"} 
                    onError={handleError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <User size={size * 0.6} />
            )}
        </div>
    );
}

export default UserAvatar;

// Usage in Header.js:
// <UserAvatar src="https://example.com/avatar.jpg" alt="John Doe" size={32} />
// Or with fallback:
// <UserAvatar />