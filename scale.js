const fs = require('fs');
const path = require('path');

const folder = 'c:\\Users\\Spark.DESKTOP-F75SGV0\\Desktop\\StakeWiseAi';
const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));

files.forEach(fname => {
    if (['index.html', 'plans.html', 'login.html', 'register.html', 'signup.html'].includes(fname)) {
        return;
    }
    
    const file = path.join(folder, fname);
    let content = fs.readFileSync(file, 'utf-8');
    
    // Hard replaces for tighter paddings missed by missing space
    content = content.replace(/"p-5"/g, '"p-3"');
    content = content.replace(/"px-5"/g, '"px-3"');
    content = content.replace(/"p-6"/g, '"p-4"');
    content = content.replace(/"p-4"/g, '"p-3"');
    
    // Typography scaling for huge text blocks
    content = content.replace(/"text-sm/g, '"text-xs');
    content = content.replace(/"text-lg/g, '"text-sm');
    content = content.replace(/"text-xl/g, '"text-base');
    content = content.replace(/"text-2xl/g, '"text-lg');
    content = content.replace(/"text-3xl/g, '"text-xl');

    // Make sure header has the curved bottom
    if (!content.includes('rounded-b-[30px]')) {
        content = content.replace(/pt-5 pb-8 px-5 shadow-md sticky top-0 z-40/g, 'pt-5 pb-8 px-5 rounded-b-[30px] shadow-md sticky top-0 z-40');
    }
    
    fs.writeFileSync(file, content, 'utf-8');
});

console.log("Deep typography scale-down completed via Node.");
