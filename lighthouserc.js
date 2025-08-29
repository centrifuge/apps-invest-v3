module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
    },
    assert: {
      // No assertions - just collect and upload for reporting
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
