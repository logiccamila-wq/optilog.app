import React from 'react';
import './SkeletonLoader.css'; // Import your CSS styles here

const SkeletonLoader = ({ type }) => {
  const skeletonClass = `skeleton ${type}`;

  return <div className={skeletonClass}></div>;
};

export default SkeletonLoader;

// CSS styles (SkeletonLoader.css)
// .skeleton {
//   background: #e0e0e0;
//   border-radius: 4px;
//   animation: pulse 1.5s infinite;
// }
// 
// @keyframes pulse {
//   0% {
//     opacity: 1;
//   }
//   50% {
//     opacity: 0.5;
//   }
//   100% {
//     opacity: 1;
//   }
// }

// Usage: 
// <SkeletonLoader type="card" />
// <SkeletonLoader type="table" />
// <SkeletonLoader type="list" />
// <SkeletonLoader type="text" />
