import React from 'react';
import { Bell } from 'react-feather';

function NotificationIcon({ count = 0 }) {
    return (
        <div className="notification-icon">
            <Bell size={20} />
            {count > 0 && <span className="badge">{count > 9 ? '9+' : count}</span>}
        </div>
    );
}

export default NotificationIcon;
