const puppeteer = require('puppeteer');

async function login() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the login page
        await page.goto('https://www.jumbo.cl/login');

        // Perform the necessary clicks and form filling to log in
        await page.focus('input[name="email"]');
        await page.keyboard.type('tradingb2bcl@yahoo.com');

        await page.focus('input[name="Clave"]');
        await page.keyboard.type('2#Zh2b@Fh+e2LK.');

        await page.click('.btn-span-enter');

        const page2 = await browser.newPage();
        // Wait for the URL to change to 'mis-datos' after login
        await page2.goto('https://www.jumbo.cl/mis-datos');

        const localStorageToken = await page.evaluate(() => {
            const token = window.localStorage.getItem('sessionId');
            return token;
        });

        // Get the session token from session storage
        const sessionStorageToken = await page.evaluate(() => {
            const token = window.sessionStorage.getItem('tt_sessionId');
            return token;
        });

        // Print the session tokens
        console.log('Local Storage Session Token:', localStorageToken);
        console.log('Session Storage Session Token:', sessionStorageToken);

        // Wait for the table to be visible
        await page2.waitForSelector('.user-info');

        // Get all the data from the elements with class 'info-row'
        const tableData = await page2.evaluate(() => {
            const userInfo = document.querySelector('.user-info');
            const infoRows = Array.from(userInfo.querySelectorAll('.info-row'));

            // Extract the data from each 'info-row'
            const data = infoRows.map((row) => {
                const labelText = row.querySelector('strong')?.textContent || '';
                const valueText = row.querySelector('span')?.textContent || '';

                return {
                    label: labelText.trim(),
                    value: valueText.trim(),
                };
            });

            return data;
        });

        // Print the table data
        console.log('User Data:', tableData);

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error('An error occurred during login:', error);
    }
}

login();
