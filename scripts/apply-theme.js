const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const directoriesToProcess = [
  path.join(__dirname, '../app/admin'),
  path.join(__dirname, '../modules/admin')
];

let files = [];
directoriesToProcess.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = files.concat(walkSync(dir));
  }
});

const replaceMap = [
  { regex: /bg-\[#F5F6FA\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#EDEDED\]/g, replacement: 'bg-background' },
  { regex: /text-\[#1a1a2e\]/g, replacement: 'text-foreground' },
  { regex: /text-slate-800/g, replacement: 'text-foreground' },
  { regex: /bg-\[#1a1a2e\]/g, replacement: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]' },
  { regex: /bg-black/g, replacement: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]' },
  { regex: /text-\[#a0a8b2\]/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-\[#8a919e\]/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-slate-400/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-slate-300/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-slate-500/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /bg-white/g, replacement: 'bg-[var(--bg-card)]' },
  { regex: /border-\[#EBEBF0\]/g, replacement: 'border-[var(--border-default)]' },
  { regex: /border-[#f0f1f5]/g, replacement: 'border-[var(--border-default)]' },
  { regex: /border-slate-200/g, replacement: 'border-[var(--border-default)]' },
  { regex: /border-slate-100/g, replacement: 'border-[var(--border-default)]' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replaceMap.forEach(item => {
    content = content.replace(item.regex, item.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated theme in ${file}`);
  }
});
console.log('Done.');
