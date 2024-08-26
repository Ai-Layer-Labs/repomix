import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { loadFileConfig, mergeConfigs } from '../../src/config/configLoader.js';
import type { RepopackConfigFile, RepopackConfigMerged, RepopackOutputStyle } from '../../src/config/configTypes.js';
import { pack } from '../../src/core/packager.js';
import { isWindows } from '../testing/testUtils.js';

const fixturesDir = path.join(__dirname, 'fixtures', 'packager');
const inputsDir = path.join(fixturesDir, 'inputs');
const outputsDir = path.join(fixturesDir, 'outputs');

describe.runIf(!isWindows)('packager integration', () => {
  const testCases = [
    { desc: 'simple plain style', input: 'simple-project', output: 'simple-project-output.txt', config: {} },
    {
      desc: 'simple xml style',
      input: 'simple-project',
      output: 'simple-project-output.xml',
      config: { output: { style: 'xml', filePath: 'simple-project-output.xml' } },
    },
  ];

  let tempDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repopack-test-'));
  });

  afterEach(async () => {
    // Clean up the temporary directory after each test
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  for (const { desc, input, output, config } of testCases) {
    test(`should correctly pack ${desc}`, async () => {
      const inputDir = path.join(inputsDir, input);
      const expectedOutputPath = path.join(outputsDir, output);
      const actualOutputPath = path.join(tempDir, output);

      const fileConfig: RepopackConfigFile = await loadFileConfig(inputDir, null);
      const mergedConfig: RepopackConfigMerged = mergeConfigs(process.cwd(), fileConfig, {
        output: {
          filePath: actualOutputPath,
          style: (config.output?.style || 'plain') as RepopackOutputStyle,
        },
      });

      // Run the pack function
      await pack(inputDir, mergedConfig);

      // Read the actual and expected outputs
      let actualOutput = await fs.readFile(actualOutputPath, 'utf-8');
      let expectedOutput = await fs.readFile(expectedOutputPath, 'utf-8');

      actualOutput = actualOutput.replace(/^This file was generated by Repopack on:.*\n/gm, '');
      expectedOutput = expectedOutput.replace(/^This file was generated by Repopack on:.*\n/gm, '');

      // Compare the outputs
      expect(actualOutput).toBe(expectedOutput);

      // Optionally, update the expected output if explicitly requested
      if (process.env.UPDATE_EXPECTED_OUTPUT) {
        await fs.writeFile(expectedOutputPath, actualOutput);
        console.log(`Updated expected output for ${desc}`);
      }
    });
  }
});
