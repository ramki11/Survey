import { test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });