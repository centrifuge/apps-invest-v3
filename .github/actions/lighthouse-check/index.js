const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const githubToken = core.getInput('github-token', { required: true });

    console.log(`🎯 Running Lighthouse audit on ${url}...`);

    // Check if Lighthouse CI is already installed
    let lhciInstalled = false;
    try {
      execSync('lhci --version', { stdio: 'pipe' });
      lhciInstalled = true;
      console.log('✅ Lighthouse CI already installed, skipping installation');
    } catch (error) {
      console.log('📦 Lighthouse CI not found, installing...');
    }

    // Install Lighthouse CI only if not already installed
    if (!lhciInstalled) {
      try {
        execSync('npm install -g @lhci/cli', { stdio: 'pipe' });
        console.log('✅ Lighthouse CI installed successfully');
      } catch (error) {
        console.log('⚠️ Failed to install Lighthouse CI. Output:');
        console.log((error.stdout || '').toString());
        console.log((error.stderr || '').toString());
        throw error;
      }
    }
    
    // Check for config file in repository root
    const configPath = path.join(process.env.GITHUB_WORKSPACE || '.', 'lighthouserc.json');
    const configExists = fs.existsSync(configPath);
    
    if (configExists) {
      console.log('✅ Found lighthouserc.json in repository root');
    } else {
      console.log('⚠️ No lighthouserc.json found in repository root, using default config');
    }
    
    // Build lighthouse command
    const configArg = configExists ? `--config=${configPath}` : '';
    const lighthouseCmd = `lhci autorun ${configArg} --collect.url=${url} --collect.numberOfRuns=1 2>&1`;
    
    console.log(`🚀 Running: ${lighthouseCmd}`);
    
    try {
      execSync(lighthouseCmd, { 
        encoding: 'utf8',
        env: { ...process.env, LHCI_GITHUB_TOKEN: githubToken },
        stdio: 'inherit'
      });
      console.log('✅ Lighthouse completed successfully');
    } catch (error) {
      console.log('⚠️ Lighthouse completed with warnings/errors, but continuing to read results...');
    }
    
    // Read results from JSON files
    const lighthouseDir = path.join(process.env.GITHUB_WORKSPACE || '.', '.lighthouseci');
    const linksPath = path.join(lighthouseDir, 'links.json');
    
    let reportUrl = '';
    let performance = 0, accessibility = 0, bestPractices = 0, seo = 0;
    
    // Read report URL from links.json
    if (fs.existsSync(linksPath)) {
      try {
        const linksData = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
        reportUrl = linksData[url] || '';
        console.log(`📊 Report URL: ${reportUrl}`);
      } catch (error) {
        console.log('⚠️ Failed to read links.json:', error.message);
      }
    }
    
    // Read scores from the latest LHR JSON file
    if (fs.existsSync(lighthouseDir)) {
      const files = fs.readdirSync(lighthouseDir);
      const lhrFiles = files.filter(file => file.startsWith('lhr-') && file.endsWith('.json'));
      
      if (lhrFiles.length > 0) {
        // Get the most recent file
        const latestFile = lhrFiles.sort().pop();
        const lhrPath = path.join(lighthouseDir, latestFile);
        
        try {
          const lhrData = JSON.parse(fs.readFileSync(lhrPath, 'utf8'));
          
          // Extract scores from the JSON data
          // Look for category scores in the structure
          if (lhrData.categories) {
            // Try to find scores in different possible locations
            const categories = lhrData.categories;
            
            // Method 1: Look for direct score properties
            if (categories.performance && typeof categories.performance.score === 'number') {
              performance = Math.round(categories.performance.score * 100);
            }
            if (categories.accessibility && typeof categories.accessibility.score === 'number') {
              accessibility = Math.round(categories.accessibility.score * 100);
            }
            if (categories['best-practices'] && typeof categories['best-practices'].score === 'number') {
              bestPractices = Math.round(categories['best-practices'].score * 100);
            }
            if (categories.seo && typeof categories.seo.score === 'number') {
              seo = Math.round(categories.seo.score * 100);
            }
            
            // Method 2: If no direct scores, try to calculate from audit scores
            if (performance === 0 && accessibility === 0 && bestPractices === 0 && seo === 0) {
              console.log('🔍 Calculating scores from individual audits...');
              
              // This is a simplified calculation - in reality, you'd need the exact weights
              // For now, let's look for some key metrics
              if (lhrData.audits) {
                const audits = lhrData.audits;
                
                // Performance metrics
                const fcp = audits['first-contentful-paint']?.score || 0;
                const lcp = audits['largest-contentful-paint']?.score || 0;
                const tbt = audits['total-blocking-time']?.score || 0;
                const cls = audits['cumulative-layout-shift']?.score || 0;
                const si = audits['speed-index']?.score || 0;
                
                // Simple average for performance
                const perfScores = [fcp, lcp, tbt, cls, si].filter(s => s !== null && s !== undefined);
                if (perfScores.length > 0) {
                  performance = Math.round((perfScores.reduce((a, b) => a + b, 0) / perfScores.length) * 100);
                }
                
                // For other categories, we'd need to look at specific audits
                // This is a simplified approach
                accessibility = Math.round((audits['color-contrast']?.score || 0) * 100);
                bestPractices = Math.round((audits['errors-in-console']?.score || 0) * 100);
                seo = Math.round((audits['viewport']?.score || 0) * 100);
              }
            }
          }
          
          console.log(`📊 Read scores from ${latestFile}:`);
          console.log(`Performance: ${performance}/100`);
          console.log(`Accessibility: ${accessibility}/100`);
          console.log(`Best Practices: ${bestPractices}/100`);
          console.log(`SEO: ${seo}/100`);
          
        } catch (error) {
          console.log('⚠️ Failed to read LHR JSON file:', error.message);
        }
      }
    }
    
    // Set outputs
    core.setOutput('report-url', reportUrl);
    core.setOutput('performance', performance.toString());
    core.setOutput('accessibility', accessibility.toString());
    core.setOutput('best-practices', bestPractices.toString());
    core.setOutput('seo', seo.toString());
    
    // Display results
    console.log('\n🎯 Lighthouse Results:');
    console.log(`Performance: ${performance}/100`);
    console.log(`Accessibility: ${accessibility}/100`);
    console.log(`Best Practices: ${bestPractices}/100`);
    console.log(`SEO: ${seo}/100`);
    if (reportUrl) {
      console.log(`📊 Detailed Report: ${reportUrl}`);
    }
    
    // Post PR comment if this is a PR
    if (github.context.eventName === 'pull_request') {
      await postPRComment(url, reportUrl, performance, accessibility, bestPractices, seo, githubToken);
    }
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
  }
}

async function postPRComment(url, reportUrl, performance, accessibility, bestPractices, seo, githubToken) {
  try {
    const octokit = github.getOctokit(githubToken);
    
    // Create GitHub-style badges
    const createBadge = (label, score) => {
      let color = 'red';
      if (score >= 90) color = 'brightgreen';
      else if (score >= 50) color = 'orange';
      return `![${label}](https://img.shields.io/badge/${label}-${score}%2F100-${color}?style=flat-square)`;
    };
    
    const badges = [
      createBadge('Performance', performance),
      createBadge('Accessibility', accessibility),
      createBadge('Best%20Practices', bestPractices),
      createBadge('SEO', seo)
    ].join(' ');
    
    // Create comment body
    let body = `## 📊 Lighthouse Performance Report\n\n`;
    body += `${badges}\n\n`;
    body += `**URL tested:** ${url}\n`;
    
    if (reportUrl) {
      body += `**Full report:** ${reportUrl}`;
    }
    
    // Post comment
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      body: body
    });
    
    console.log('💬 PR comment posted successfully');
    
  } catch (error) {
    console.error('❌ Failed to post PR comment:', error.message);
  }
}

run();
