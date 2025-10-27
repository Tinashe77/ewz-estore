from playwright.sync_api import sync_playwright
import sys

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Listen for console events and print them to stderr
    page.on("console", lambda msg: sys.stderr.write(f"BROWSER LOG: {msg.text}\\n"))

    page.goto("http://localhost:5173/login")
    page.get_by_placeholder("Enter your email").fill("admin@econet.co.zw")
    page.get_by_placeholder("Enter your password").fill("Admin@123456")
    page.get_by_role("button", name="Login").click()

    try:
        page.wait_for_url("http://localhost:5173/dashboard", timeout=60000)
        page.screenshot(path="jules-scratch/verification/dashboard.png")
    except Exception as e:
        sys.stderr.write(f"Error waiting for URL: {e}\\n")
        page.screenshot(path="jules-scratch/verification/login_error.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
