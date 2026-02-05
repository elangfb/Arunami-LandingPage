const fs = require('fs');
const path = require('path');

// CONFIGURATION
const SEARCH_DIR = '.'; // Change this to your HTML folder path
const OUTPUT_FILE = 'project_summary.txt';

function extractNavigation(htmlContent) {
    const navItems = [];
    
    // 1. Regex to find Anchor tags <a href="...">Label</a>
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
        // Clean up the label (remove nested HTML tags if any)
        const label = match[3].replace(/<[^>]*>/g, '').trim() || 'No Text';
        const destination = match[2];
        navItems.push(`[Link] "${label}" goes to -> ${destination}`);
    }

    // 2. Regex to find Buttons <button...>Label</button>
    // Note: Buttons often use JS for navigation, so we just capture the text.
    const btnRegex = /<button[^>]*?>(.*?)<\/button>/gi;
    while ((match = btnRegex.exec(htmlContent)) !== null) {
        const label = match[1].replace(/<[^>]*>/g, '').trim() || 'Icon/No Text';
        navItems.push(`[Button] "${label}"`);
    }

    return navItems.length > 0 ? navItems.join('\n') : "No navigation links found.";
}

function generateReport() {
    // Check if directory exists
    if (!fs.existsSync(SEARCH_DIR)) {
        console.error(`Error: Directory "${SEARCH_DIR}" not found.`);
        return;
    }

    const files = fs.readdirSync(SEARCH_DIR);
    let fullOutput = "";

    files.forEach(file => {
        if (path.extname(file) === '.html') {
            const filePath = path.join(SEARCH_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const navInfo = extractNavigation(content);

            // Create the "Border" format you requested
            const fileBlock = `
================================================================================
-- FILE NAME: ${file} --
================================================================================
-- NAVIGATION SUMMARY --
${navInfo}

--------------------------------------------------------------------------------
-- HTML CONTENT --
--------------------------------------------------------------------------------
${content}

\n\n`;
            
            fullOutput += fileBlock;
        }
    });

    fs.writeFileSync(OUTPUT_FILE, fullOutput);
    console.log(`Success! All HTML code combined into ${OUTPUT_FILE}`);
}

generateReport();