import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    use: {
        storageState: { cookies: [], origins: [] },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});