const fs = require('fs');
const path = require('path');

const folder = 'c:\\Users\\Spark.DESKTOP-F75SGV0\\Desktop\\StakeWiseAi';
const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));

// The precise, correct CSS for the bottom nav
const correctNavCSS = `
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: white;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
      z-index: 50;
      border-top: 1px solid #f1f5f9;
      height: 64px;
    }`;

// Function to generate the correct HTML based on the active file
function processHTMLForActiveNav(filename) {
    const isHome = filename === 'index.html';
    const isStaking = filename === 'plans.html' || filename === 'miner.html';
    const isTeam = filename === 'teams.html';
    const isAccount = !isHome && !isStaking && !isTeam;

    const activeClass = 'text-[#4f8cff]';
    const inactiveClass = 'text-[#94a3b8]';

    return `<!-- BOTTOM NAV -->
    <div class="bottom-nav">
      <div class="w-full max-w-[28rem] mx-auto flex justify-around items-center h-full pt-1">
        <a href="/index.html" class="nav-item flex flex-col items-center w-1/4 ${isHome ? activeClass : inactiveClass} transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span class="text-[10px] font-medium translator" data-key="nav_home">Home</span>
        </a>
        <a href="/plans.html" class="nav-item flex flex-col items-center w-1/4 ${isStaking ? activeClass : inactiveClass} transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><path d="M14.531 12.469 6.619 20.381l-4-4 7.912-7.912" /><path d="M15.686 11.314c.839.839 2.158.888 3.037.125l2.313-2.313a2.673 2.673 0 0 0 0-3.776L18.65 3.015a2.673 2.673 0 0 0-3.776 0L12.56 5.33c-.763.879-.714 2.198.125 3.037Z" /></svg>
          <span class="text-[10px] font-medium translator" data-key="nav_staking">Staking Plans</span>
        </a>
        <a href="/teams.html" class="nav-item flex flex-col items-center w-1/4 ${isTeam ? activeClass : inactiveClass} transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="text-[10px] font-medium translator" data-key="nav_team">Team</span>
        </a>
        <a href="/account.html" class="nav-item flex flex-col items-center w-1/4 ${isAccount ? activeClass : inactiveClass} transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="text-[10px] font-medium translator" data-key="nav_account">Account</span>
        </a>
      </div>
    </div>`;
}

files.forEach(fname => {
    if (['login.html', 'register.html', 'signup.html'].includes(fname)) {
        return;
    }
    
    const file = path.join(folder, fname);
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace CSS Block
    const cssRegex = /\.bottom-nav\s*{[^}]*}/;
    if (cssRegex.test(content)) {
        content = content.replace(cssRegex, correctNavCSS.trim());
    }
    
    // Replace HTML Block 
    // We target the entire footer block including the container it sits in usually
    const htmlBlockRegex = /<!-- BOTTOM NAV -->[\s\S]*?<div class="bottom-nav[^>]*>[\s\S]*?<\/div>/;
    if (htmlBlockRegex.test(content)) {
        content = content.replace(htmlBlockRegex, processHTMLForActiveNav(fname));
    } else {
        // Fallback: search for just the div if comment is missing
        const divRegex = /<div class="bottom-nav">[\s\S]*?<\/div>/;
        if (divRegex.test(content)) {
            content = content.replace(divRegex, processHTMLForActiveNav(fname));
        }
    }
    
    fs.writeFileSync(file, content, 'utf-8');
});

console.log("Universal perfect footer updated to new design.");
