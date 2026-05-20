import fs from 'node:fs/promises';
import path from 'node:path';
import { handleSubmission } from '../services/submissionHandler.js';

const distAssetsPath = path.join(process.cwd(), 'dist', 'assets');
const maxMainJsKb = 330;
const maxHomeCssKb = 32;

const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

const assertFileExists = async (file) => {
  try {
    const stat = await fs.stat(file);
    pass(`${file} exists (${Math.round(stat.size / 1024)} KB)`);
  } catch {
    fail(`${file} is missing`);
  }
};

const assertBundleBudget = async () => {
  const files = await fs.readdir(distAssetsPath);
  const mainJs = files.find((file) => /^index-.*\.js$/.test(file));
  const homeCss = files.find((file) => /^Home-.*\.css$/.test(file));

  if (!mainJs || !homeCss) {
    fail('production bundle files were not found');
    return;
  }

  const mainJsKb = (await fs.stat(path.join(distAssetsPath, mainJs))).size / 1024;
  const homeCssKb = (await fs.stat(path.join(distAssetsPath, homeCss))).size / 1024;

  mainJsKb <= maxMainJsKb ? pass(`main JS budget ${mainJsKb.toFixed(1)} KB`) : fail(`main JS too large ${mainJsKb.toFixed(1)} KB`);
  homeCssKb <= maxHomeCssKb ? pass(`home CSS budget ${homeCssKb.toFixed(1)} KB`) : fail(`home CSS too large ${homeCssKb.toFixed(1)} KB`);
};

const assertSubmissionRules = async () => {
  process.env.EMAIL_PROVIDER = 'dry-run';

  const valid = await handleSubmission({
    type: 'contact',
    language: 'de',
    source: '/kontakt',
    data: {
      name: 'QA Tester',
      email: 'qa@example.com',
      message: 'Test message'
    }
  });

  valid.ok ? pass('contact submission dry-run') : fail('contact submission dry-run failed');

  try {
    await handleSubmission({
      type: 'contact',
      data: {
        name: 'QA Tester',
        email: 'bad-email',
        message: 'Test'
      }
    });
    fail('invalid email was accepted');
  } catch (error) {
    error.status === 400 ? pass('invalid email rejected') : fail(`unexpected invalid email error ${error.message}`);
  }
};

await assertFileExists('public/logo.png');
await assertFileExists('public/assets/viel/hero-front-screen.webp');
await assertFileExists('public/assets/viel/office-cleaning-pro.webp');
await assertFileExists('public/sitemap.xml');
await assertFileExists('public/robots.txt');
await assertBundleBudget();
await assertSubmissionRules();
