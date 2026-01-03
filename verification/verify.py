from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:3000")

        # Wait for initial load
        page.wait_for_selector("#status-indicator")

        # Manually reveal the console using JS execution, to bypass any potential click issue
        # Just to verify the UI.
        page.evaluate("document.getElementById('cmd-console').className = 'block mt-4 bg-gray-100 p-4 rounded-lg'")

        page.wait_for_selector("#cmd-console", state="visible")

        # Interact with inputs
        page.fill("#cmd-threat", "CRITICAL")
        page.fill("#cmd-directive", "ENGAGE")

        # Submit
        page.click("text=UPDATE")

        # Wait for update (polling is 2s)
        page.wait_for_timeout(3000)

        # Take updated screenshot
        page.screenshot(path="verification/updated_state.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
