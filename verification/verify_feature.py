from playwright.sync_api import sync_playwright, expect
import time

def verify_predictive_telemetry(page):
    # Listen for console logs
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Browser error: {err}"))

    page.goto("http://localhost:3000")

    # Wait for initial load
    expect(page.locator("h1")).to_contain_text("Sentinel Status Board")

    # Toggle Command Console
    print("Clicking toggle button...")
    page.get_by_label("Toggle Command Console").click()

    # Wait for console to appear
    print("Waiting for console to appear...")
    expect(page.locator("#cmd-console")).to_be_visible()

    # Fill out asset details with heading and speed
    page.get_by_label("Asset Name").fill("TestVector")
    page.get_by_label("Asset Type").fill("Drone")
    page.get_by_label("X Coordinate").fill("50")
    page.get_by_label("Y Coordinate").fill("50")
    page.get_by_label("Heading").fill("90") # East
    page.get_by_label("Speed").fill("5")

    # Deploy
    page.get_by_label("Deploy Asset").click()

    # Wait for update
    time.sleep(2)

    # Check Telemetry Panel for Prediction
    expect(page.locator("#telemetry-panel")).to_be_visible()
    # Ensure prediction is calculated
    expect(page.locator("#pred-posture-val")).not_to_have_text("...")

    # Take screenshot of the whole page, including map
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_predictive_telemetry(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
