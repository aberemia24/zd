#!/usr/bin/env node

/**
 * Script: setup-branch-protection.js
 * Configurează branch protection rules pentru main și develop conform PRD Faza 6
 * 
 * Usage: node scripts/setup-branch-protection.js
 * Requires: GITHUB_TOKEN environment variable
 */

const { Octokit } = require('@octokit/rest');

console.log('🛡️ Setting up branch protection rules...\n');

// Check for GitHub token
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('❌ Error: GITHUB_TOKEN environment variable is required');
  console.log('💡 Create a personal access token with repo permissions:');
  console.log('   https://github.com/settings/tokens/new');
  console.log('   Then run: export GITHUB_TOKEN=your_token_here');
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

// Repository configuration (update these values)
const REPO_CONFIG = {
  owner: 'your-username', // Update this
  repo: 'zd', // Update this if different
  main_branch: 'main',
  develop_branch: 'develop'
};

/**
 * Branch protection configuration for main branch
 */
const MAIN_BRANCH_PROTECTION = {
  required_status_checks: {
    strict: true,
    contexts: [
      'Quick Check (≤5min)',
      'Integration Tests', 
      'Build Verification',
      'Quality Gate'
    ]
  },
  enforce_admins: false, // Allow admins to bypass for hotfixes
  required_pull_request_reviews: {
    required_approving_review_count: 1,
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    require_last_push_approval: false
  },
  restrictions: null, // No branch restrictions for solo developer
  allow_force_pushes: false,
  allow_deletions: false,
  block_creations: false
};

/**
 * Branch protection configuration for develop branch
 */
const DEVELOP_BRANCH_PROTECTION = {
  required_status_checks: {
    strict: true,
    contexts: [
      'Quick Check (≤5min)',
      'Integration Tests',
      'Build Verification'
    ]
  },
  enforce_admins: false,
  required_pull_request_reviews: {
    required_approving_review_count: 0, // More relaxed for development
    dismiss_stale_reviews: false,
    require_code_owner_reviews: false,
    require_last_push_approval: false
  },
  restrictions: null,
  allow_force_pushes: false,
  allow_deletions: false,
  block_creations: false
};

async function setupBranchProtection(branch, protection, description) {
  try {
    console.log(`🔒 Setting up protection for ${branch} branch...`);
    
    await octokit.rest.repos.updateBranchProtection({
      owner: REPO_CONFIG.owner,
      repo: REPO_CONFIG.repo,
      branch: branch,
      ...protection
    });
    
    console.log(`✅ ${description} protection configured successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to set up ${branch} protection:`, error.message);
    
    if (error.status === 404) {
      console.log(`💡 Branch '${branch}' doesn't exist yet. Create it first.`);
    } else if (error.status === 403) {
      console.log(`💡 Insufficient permissions. Ensure your token has 'repo' scope.`);
    }
    
    return false;
  }
}

async function createBranchIfNotExists(branch) {
  try {
    // Check if branch exists
    await octokit.rest.repos.getBranch({
      owner: REPO_CONFIG.owner,
      repo: REPO_CONFIG.repo,
      branch: branch
    });
    
    console.log(`✅ Branch '${branch}' already exists`);
    return true;
  } catch (error) {
    if (error.status === 404) {
      console.log(`🔄 Creating '${branch}' branch...`);
      
      try {
        // Get main branch reference
        const mainRef = await octokit.rest.git.getRef({
          owner: REPO_CONFIG.owner,
          repo: REPO_CONFIG.repo,
          ref: 'heads/main'
        });
        
        // Create new branch from main
        await octokit.rest.git.createRef({
          owner: REPO_CONFIG.owner,
          repo: REPO_CONFIG.repo,
          ref: `refs/heads/${branch}`,
          sha: mainRef.data.object.sha
        });
        
        console.log(`✅ Branch '${branch}' created successfully`);
        return true;
      } catch (createError) {
        console.error(`❌ Failed to create branch '${branch}':`, createError.message);
        return false;
      }
    } else {
      console.error(`❌ Error checking branch '${branch}':`, error.message);
      return false;
    }
  }
}

async function validateRepository() {
  try {
    const repo = await octokit.rest.repos.get({
      owner: REPO_CONFIG.owner,
      repo: REPO_CONFIG.repo
    });
    
    console.log(`✅ Repository found: ${repo.data.full_name}`);
    return true;
  } catch (error) {
    console.error(`❌ Repository validation failed:`, error.message);
    console.log(`💡 Update REPO_CONFIG in this script with correct owner/repo`);
    return false;
  }
}

async function main() {
  console.log('📋 Branch Protection Setup Configuration:');
  console.log(`   Repository: ${REPO_CONFIG.owner}/${REPO_CONFIG.repo}`);
  console.log(`   Main branch: ${REPO_CONFIG.main_branch}`);
  console.log(`   Develop branch: ${REPO_CONFIG.develop_branch}`);
  console.log('');
  
  // Validate repository access
  if (!(await validateRepository())) {
    process.exit(1);
  }
  
  // Create develop branch if it doesn't exist
  if (!(await createBranchIfNotExists(REPO_CONFIG.develop_branch))) {
    process.exit(1);
  }
  
  const results = [];
  
  // Setup main branch protection
  const mainSuccess = await setupBranchProtection(
    REPO_CONFIG.main_branch,
    MAIN_BRANCH_PROTECTION,
    'Production (main)'
  );
  results.push({ branch: 'main', success: mainSuccess });
  
  // Setup develop branch protection  
  const developSuccess = await setupBranchProtection(
    REPO_CONFIG.develop_branch,
    DEVELOP_BRANCH_PROTECTION,
    'Development (develop)'
  );
  results.push({ branch: 'develop', success: developSuccess });
  
  // Summary
  console.log('\n📊 Branch Protection Setup Summary:');
  results.forEach(result => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`   ${result.branch}: ${status}`);
  });
  
  const allSuccess = results.every(r => r.success);
  
  if (allSuccess) {
    console.log('\n🎉 All branch protections configured successfully!');
    console.log('\n📋 Quality Gates Active:');
    console.log('   • Main: Requires PR reviews + all CI checks');
    console.log('   • Develop: Requires CI checks (no review required)');
    console.log('   • Force pushes blocked on both branches');
    console.log('   • Deletions blocked on both branches');
  } else {
    console.log('\n⚠️  Some configurations failed. Check errors above.');
    process.exit(1);
  }
}

// Auto-run when called directly
if (require.main === module) {
  main().catch(error => {
    console.error('🚨 Setup failed with error:', error);
    process.exit(1);
  });
}

module.exports = { 
  setupBranchProtection, 
  createBranchIfNotExists,
  MAIN_BRANCH_PROTECTION,
  DEVELOP_BRANCH_PROTECTION 
}; 