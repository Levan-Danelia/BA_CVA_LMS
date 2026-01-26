/**
 * SCORM Package Builder
 * Creates a SCORM 2004 4th Edition compliant ZIP package
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DIST_DIR = path.join(__dirname, '../dist');
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_PATH = path.join(__dirname, '../ba-cva-scorm-package.zip');

async function buildScormPackage() {
    console.log('Building SCORM package...\n');

    // Check if dist folder exists
    if (!fs.existsSync(DIST_DIR)) {
        console.error('Error: dist folder not found.');
        console.error('Please run "npm run build" first.');
        process.exit(1);
    }

    // Check if imsmanifest.xml exists
    const manifestPath = path.join(PUBLIC_DIR, 'imsmanifest.xml');
    if (!fs.existsSync(manifestPath)) {
        console.error('Error: imsmanifest.xml not found in public folder.');
        process.exit(1);
    }

    // Remove existing package if it exists
    if (fs.existsSync(OUTPUT_PATH)) {
        fs.unlinkSync(OUTPUT_PATH);
        console.log('Removed existing package.');
    }

    // Create output stream
    const output = fs.createWriteStream(OUTPUT_PATH);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    // Handle events
    output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log('\n========================================');
        console.log('SCORM Package Created Successfully!');
        console.log('========================================');
        console.log(`File: ${OUTPUT_PATH}`);
        console.log(`Size: ${sizeMB} MB`);
        console.log('\nNext steps:');
        console.log('1. Upload to SCORM Cloud (https://cloud.scorm.com) for testing');
        console.log('2. Or upload directly to your LMS');
        console.log('========================================\n');
    });

    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.warn('Warning:', err.message);
        } else {
            throw err;
        }
    });

    archive.on('error', (err) => {
        throw err;
    });

    // Pipe archive to output file
    archive.pipe(output);

    // Add imsmanifest.xml to root of package
    console.log('Adding: imsmanifest.xml');
    archive.file(manifestPath, { name: 'imsmanifest.xml' });

    // Add all files from dist folder
    console.log('Adding: dist/* (built application)');
    archive.directory(DIST_DIR, false);

    // Finalize the archive
    await archive.finalize();
}

// Run the builder
buildScormPackage().catch(err => {
    console.error('Error building SCORM package:', err);
    process.exit(1);
});
