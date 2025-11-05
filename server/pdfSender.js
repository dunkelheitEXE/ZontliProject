const puppeteer = require('puppeteer');
const fs = require('fs');

async function savePageAsPdf(url, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle0' }); // Wait until network activity is minimal
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true, // Include background colors and images
        });
        console.log(`PDF saved successfully to ${outputPath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}


export function sendUser(user) {
    const pageUrl = `http://localhost:4200/session/com/${user}`; // Replace with your target URL
    const outputFileName = '/home/alangrajeda/coding/gitrepos/ZontliProject/server/files/example_page.pdf';

    savePageAsPdf(pageUrl, outputFileName);
}
