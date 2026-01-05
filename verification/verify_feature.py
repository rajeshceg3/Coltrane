from playwright.sync_api import sync_playwright

def verify_tactical_map():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        page.goto("http://localhost:3000")

        # Manually remove hidden class
        page.evaluate("document.getElementById('cmd-console').classList.remove('hidden')")

        # Deploy a friendly unit
        page.fill("#asset-name", "Alpha-Squad")
        page.fill("#asset-type", "Infantry")
        page.fill("#asset-x", "20")
        page.fill("#asset-y", "30")
        page.click("button[aria-label='Deploy Asset']")

        # Wait for update
        page.wait_for_timeout(2500)

        # Deploy another unit
        page.fill("#asset-name", "Bravo-Tank")
        page.fill("#asset-type", "Armor")
        page.fill("#asset-x", "70")
        page.fill("#asset-y", "80")
        page.click("button[aria-label='Deploy Asset']")

        # Wait for update
        page.wait_for_timeout(2500)

        # Take screenshot of the map and list
        page.screenshot(path="verification/map_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_tactical_map()
