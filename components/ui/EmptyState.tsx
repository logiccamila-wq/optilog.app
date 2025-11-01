import React from 'react';
import './EmptyState.css'; // Assuming you may want to style the empty state

interface EmptyStateProps {
    title: string;
    description?: string;
    onRetry?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onRetry }) => {
    return (
        <div className="empty-state">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {onRetry && <button onClick={onRetry}>Retry</button>}
        </div>
    );
};

export default EmptyState;