import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './Breadcrumbs.css';

// Map route segments to readable labels
const routeLabels = {
  'startups': 'Startups',
  'incubated': 'Incubated',
  'applications': 'Applications',
  'info': 'Overview',
  'awards': 'Awards',
  'funding': 'Funding',
  'team': 'Team',
  'properties': 'Intellectual Properties',
  'updates': 'Updates',
  'fee': 'Fee',
};

const Breadcrumbs = ({ getStartupName }) => {
  const location = useLocation();
  const { startupId } = useParams();

  // Remove empty segments and 'startups' from the beginning if present
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'startups');

  // Build up the paths for each breadcrumb
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Build the path up to this point
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Get the display label
    let label = routeLabels[segment] || segment;
    
    // If this segment is a startup ID, replace it with the startup name
    if (segment === startupId && getStartupName) {
      label = getStartupName();
    }

    return {
      label,
      path: path.startsWith('/incubated') || path.startsWith('/applications') 
        ? `/startups${path}` 
        : path
    };
  });

  // Add Home as the first breadcrumb
  const allBreadcrumbs = [
    { label: 'Home', path: '/startups' },
    ...breadcrumbs
  ];

  return (
    <nav className="breadcrumbs">
      {allBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {index === allBreadcrumbs.length - 1 ? (
            <span className="breadcrumb-current">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-link">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 