const fs = require('fs');
const path = require('path');

const modulesData = {};

// 1. Scan public/SignFiles (Direct files)
const signFilesDir = path.join(__dirname, 'public', 'SignFiles');
const directSigns = [];
if (fs.existsSync(signFilesDir)) {
    fs.readdirSync(signFilesDir).forEach((file) => {
        if (file.endsWith('.sigml')) {
            const fileName = file.replace('.sigml', '');
            const label = fileName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
            directSigns.push({ label, file: `SignFiles/${fileName}` });
        }
    });
    if (directSigns.length > 0) {
        modulesData['General SignFiles'] = directSigns;
    }
}

// 2. Scan public/DictionarySigns (Sub-folders wali categories)
const dictSignsDir = path.join(__dirname, 'public', 'DictionarySigns');
if (fs.existsSync(dictSignsDir)) {
    fs.readdirSync(dictSignsDir).forEach((category) => {
        const catPath = path.join(dictSignsDir, category);
        if (fs.statSync(catPath).isDirectory()) {
            const filesList = [];
            fs.readdirSync(catPath).forEach((file) => {
                if (file.endsWith('.sigml')) {
                    const fileName = file.replace('.sigml', '');
                    const label = fileName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                    filesList.push({ label, file: `DictionarySigns/${category}/${fileName}` });
                }
            });
            if (filesList.length > 0) {
                const moduleName = category.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                modulesData[moduleName] = filesList;
            }
        }
    });
}

// 3. Scan public/DictionaryMovies (MP4 videos wale folders)
const dictMoviesDir = path.join(__dirname, 'public', 'DictionaryMovies');
if (fs.existsSync(dictMoviesDir)) {
    fs.readdirSync(dictMoviesDir).forEach((category) => {
        const catPath = path.join(dictMoviesDir, category);
        if (fs.statSync(catPath).isDirectory()) {
            const videoList = [];
            fs.readdirSync(catPath).forEach((file) => {
                if (file.endsWith('.mp4')) {
                    const fileName = file.replace('.mp4', '');
                    const label = fileName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                    videoList.push({ label, file: `DictionaryMovies/${category}/${fileName}`, type: 'video' });
                }
            });
            if (videoList.length > 0) {
                const moduleName = `Movie: ${category.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}`;
                modulesData[moduleName] = videoList;
            }
        }
    });
}

// Save to src/modulesData.json
fs.writeFileSync('./src/modulesData.json', JSON.stringify(modulesData, null, 4), 'utf-8');
console.log("Success! Teeno locations ka data milakar modulesData.json mein save ho gaya hai!");