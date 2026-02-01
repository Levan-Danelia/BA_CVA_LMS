/**
 * SCORM Package Builder
 * Creates a SCORM 2004 4th Edition compliant ZIP package
 * with dynamically generated manifest containing all asset files
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DIST_DIR = path.join(__dirname, '../dist');
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_PATH = path.join(__dirname, '../ba-cva-scorm-package.zip');

// Files to exclude from dist (we add them separately with correct content)
const EXCLUDE_FILES = [
    'imsmanifest.xml',
    'metadata.xml',
    'schemas'
];

/**
 * Recursively get all files in a directory, excluding specified files/folders
 */
function getAllFiles(dirPath, arrayOfFiles = [], basePath = '', excludeList = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        // Skip excluded files/folders
        if (excludeList.includes(file)) {
            return;
        }

        const fullPath = path.join(dirPath, file);
        const relativePath = basePath ? `${basePath}/${file}` : file;

        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles, relativePath, excludeList);
        } else {
            arrayOfFiles.push(relativePath);
        }
    });

    return arrayOfFiles;
}

/**
 * Generate imsmanifest.xml with all files enumerated
 */
function generateManifest(files, schemaFiles) {
    // Generate file entries for the resource
    const fileEntries = files
        .map(file => `            <file href="${file}"/>`)
        .join('\n');

    // Add schema files to manifest
    const schemaEntries = schemaFiles
        .map(file => `            <file href="${file}"/>`)
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="BA_CVA_LMS_Course"
          version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">

    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>2004 4th Edition</schemaversion>
        <adlcp:location>metadata.xml</adlcp:location>
    </metadata>

    <organizations default="BA_CVA_ORG">
        <organization identifier="BA_CVA_ORG">
            <title>BA-CVA Capital Framework Training</title>

            <!-- Single SCO - all navigation is handled internally by the application -->
            <item identifier="MODULE_ROOT" identifierref="RESOURCE_SCO">
                <title>BA-CVA Learning Module</title>
                <imsss:sequencing>
                    <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true"/>
                </imsss:sequencing>
            </item>
        </organization>
    </organizations>

    <resources>
        <resource identifier="RESOURCE_SCO"
                  type="webcontent"
                  adlcp:scormType="sco"
                  href="index.html">
${fileEntries}
            <file href="metadata.xml"/>
${schemaEntries}
        </resource>
    </resources>
</manifest>`;
}

async function buildScormPackage() {
    console.log('Building SCORM 2004 4th Edition Package...\n');

    // Check if dist folder exists
    if (!fs.existsSync(DIST_DIR)) {
        console.error('Error: dist folder not found.');
        console.error('Please run "npm run build" first.');
        process.exit(1);
    }

    // Check if metadata.xml exists
    const metadataPath = path.join(PUBLIC_DIR, 'metadata.xml');
    if (!fs.existsSync(metadataPath)) {
        console.error('Error: metadata.xml not found in public folder.');
        process.exit(1);
    }

    // Remove existing package if it exists
    if (fs.existsSync(OUTPUT_PATH)) {
        fs.unlinkSync(OUTPUT_PATH);
        console.log('Removed existing package.');
    }

    // Get all files from dist directory (excluding SCORM-specific files that Vite copies from public)
    console.log('Scanning dist folder for files...');
    const distFiles = getAllFiles(DIST_DIR, [], '', EXCLUDE_FILES);
    console.log(`Found ${distFiles.length} application files in dist folder.`);

    // Get schema files
    const schemasDir = path.join(PUBLIC_DIR, 'schemas');
    let schemaFiles = [];
    if (fs.existsSync(schemasDir)) {
        schemaFiles = fs.readdirSync(schemasDir)
            .filter(file => file.endsWith('.xsd'));
        console.log(`Found ${schemaFiles.length} XSD schema files.`);
    }

    // Generate manifest with all files
    console.log('Generating imsmanifest.xml...');
    const manifestContent = generateManifest(distFiles, schemaFiles);

    // Create output stream
    const output = fs.createWriteStream(OUTPUT_PATH);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    // Track total files for summary
    let totalFiles = 0;

    // Handle events
    output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log('\n========================================');
        console.log('SCORM Package Created Successfully!');
        console.log('========================================');
        console.log(`File: ${OUTPUT_PATH}`);
        console.log(`Size: ${sizeMB} MB`);
        console.log(`Total files: ${totalFiles}`);
        console.log('\nPackage Contents:');
        console.log('  - imsmanifest.xml (SCORM manifest)');
        console.log('  - metadata.xml (LOM metadata)');
        console.log(`  - ${schemaFiles.length} XSD schema files`);
        console.log(`  - ${distFiles.length} application files`);
        console.log('\nSCORM Compliance:');
        console.log('  - Standard: SCORM 2004 4th Edition');
        console.log('  - Schema: ADL SCORM CAM 1.3');
        console.log('  - Metadata: IEEE LOM');
        console.log('\nData Model Support:');
        console.log('  - cmi.completion_status');
        console.log('  - cmi.success_status');
        console.log('  - cmi.score.* (raw, scaled, min, max)');
        console.log('  - cmi.progress_measure');
        console.log('  - cmi.location (bookmarking)');
        console.log('  - cmi.suspend_data (state persistence)');
        console.log('  - cmi.interactions.* (assessment tracking)');
        console.log('  - cmi.session_time');
        console.log('\nTesting:');
        console.log('  1. Upload to SCORM Cloud (https://cloud.scorm.com)');
        console.log('  2. Run the Debug launch to verify API calls');
        console.log('  3. Check completion and score tracking');
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

    // Add dynamically generated imsmanifest.xml
    console.log('Adding: imsmanifest.xml (generated)');
    archive.append(manifestContent, { name: 'imsmanifest.xml' });
    totalFiles++;

    // Add metadata.xml from public folder (source of truth)
    console.log('Adding: metadata.xml');
    archive.file(metadataPath, { name: 'metadata.xml' });
    totalFiles++;

    // Add SCORM schema files (at root level for SCORM compliance)
    if (schemaFiles.length > 0) {
        console.log('Adding: XSD schema files');
        schemaFiles.forEach(file => {
            archive.file(path.join(schemasDir, file), { name: file });
            totalFiles++;
        });
    }

    // Add application files from dist folder (excluding SCORM files)
    console.log('Adding: dist/* (application files)');
    distFiles.forEach(file => {
        archive.file(path.join(DIST_DIR, file), { name: file });
        totalFiles++;
    });

    // Finalize the archive
    await archive.finalize();
}

// Run the builder
buildScormPackage().catch(err => {
    console.error('Error building SCORM package:', err);
    process.exit(1);
});
