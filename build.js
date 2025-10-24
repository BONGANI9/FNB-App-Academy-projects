const fs = require('fs');
const path = require('path');

const sourceDir = 'pine city zoo';
const distDir = 'dist';

// Remove dist folder if it exists
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}

// Create dist folder
fs.mkdirSync(distDir, { recursive: true });

// Copy all files from source to dist
function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyRecursive(sourceDir, distDir);
console.log('Build completed! Files copied to dist folder.');
