// Test script to simulate GitHub Actions environment
process.env.INPUT_URL = 'https://97ffb600-derwa-dev.centrifuge-kf.workers.dev';
process.env.INPUT_GITHUB_TOKEN = 'test-token';
process.env.GITHUB_EVENT_NAME = 'pull_request';
process.env.GITHUB_REPOSITORY = 'test/test-repo';
process.env.GITHUB_ISSUE_NUMBER = '123';
process.env.GITHUB_WORKSPACE = '/Users/guille/Centrifuge/github/apps-invest-v3';

// Mock the core and github modules
const mockCore = {
  getInput: (name) => {
    const value = process.env[`INPUT_${name.toUpperCase()}`];
    console.log(`Getting input ${name}: ${value}`);
    return value;
  },
  setOutput: (name, value) => console.log(`Output ${name}: ${value}`),
  setFailed: (message) => console.error(`Failed: ${message}`)
};

const mockGithub = {
  getOctokit: (token) => ({
    rest: {
      issues: {
        createComment: async (params) => {
          console.log('Mock PR comment:', params.body);
          return { data: { id: 123 } };
        }
      }
    }
  }),
  context: {
    eventName: process.env.GITHUB_EVENT_NAME,
    repo: {
      owner: 'test',
      repo: 'test-repo'
    },
    issue: {
      number: parseInt(process.env.GITHUB_ISSUE_NUMBER)
    }
  }
};

// Mock the modules
require.cache[require.resolve('@actions/core')] = { exports: mockCore };
require.cache[require.resolve('@actions/github')] = { exports: mockGithub };

// Run the action
console.log('🧪 Testing Lighthouse Action...');
console.log('URL:', process.env.INPUT_URL);
console.log('Event:', process.env.GITHUB_EVENT_NAME);
console.log('Workspace:', process.env.GITHUB_WORKSPACE);

try {
  require('./index.js');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}
