const fs = require('fs');
const path = require('path');

const folder = 'c:\\Users\\Spark.DESKTOP-F75SGV0\\Desktop\\SatrixAi';
const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));

files.forEach(fname => {
    // Excluding login/register because they don't have bottom-nav typically, but safe to just regex all.
    const file = path.join(folder, fname);
    let content = fs.readFileSync(file, 'utf-8');
    
    if (content.includes('.bottom-nav {') && !content.includes('transform: translateX(-50%);')) {
        content = content.replace(
            /(.bottom-nav\s*{\s*[\s\S]*?z-index: 50;)/,
            '$1\n      left: 50%;\n      transform: translateX(-50%);\n      border-top-left-radius: 24px;\n      border-top-right-radius: 24px;'
        );
        fs.writeFileSync(file, content, 'utf-8');
    }
});

console.log("Bottom nav centering and border-radius fixed across all files.");
