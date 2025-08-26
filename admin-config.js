// Admin Security Configuration
// This file should be kept secure and not committed to public repositories

const ADMIN_CONFIG = {
  // Admin site access control
  allowedDomains: ['localhost', '127.0.0.1'], // Restrict to local development only
  adminPath: '/admin-secure', // Hidden admin path
  
  // Rate limiting
  maxLoginAttempts: 3,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  
  // Session security
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  requireReauth: true,
  
  // Content protection
  preventInspect: true,
  disableRightClick: true,
  disableDevTools: true,
  
  // API security
  maxRequestSize: '10mb',
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

// Export for use in admin files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ADMIN_CONFIG;
}
