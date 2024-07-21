import { RepopackConfigMerged } from '../types/index.js';
import * as fs from 'fs/promises';
import path from 'path';

const SEPARATOR = '='.repeat(16);
const LONG_SEPARATOR = '='.repeat(64);

export async function generateOutput(
  rootDir: string,
  config: RepopackConfigMerged,
  packedFiles: { path: string; content: string }[],
  fsModule = fs,
): Promise<void> {
  const output: string[] = [];

  // Generate and add the header
  const header = generateFileHeader(config);
  output.push(header);

  // Add packed files
  for (const file of packedFiles) {
    output.push(SEPARATOR);
    output.push(`File: ${file.path}`);
    output.push(SEPARATOR);
    output.push(file.content);
    output.push(''); // Add an empty line after each file content
  }

  const outputPath = path.resolve(rootDir, config.output.filePath);
  await fsModule.writeFile(outputPath, output.join('\n'));
}

export function generateFileHeader(config: RepopackConfigMerged): string {
  const defaultHeader = `${LONG_SEPARATOR}
REPOPACK OUTPUT FILE
${LONG_SEPARATOR}

This file was generated by Repopack on: ${new Date().toISOString()}

Purpose:
--------
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

File Format:
------------
The content is organized as follows:
1. This header section
2. Multiple file entries, each consisting of:
   a. A separator line (${SEPARATOR})
   b. The file path (File: path/to/file)
   c. Another separator line
   d. The full contents of the file
   e. A blank line

Usage Guidelines:
-----------------
1. This file should be treated as read-only. Any changes should be made to the
   original repository files, not this packed version.
2. When processing this file, use the separators and "File:" markers to
   distinguish between different files in the repository.
3. Be aware that this file may contain sensitive information. Handle it with
   the same level of security as you would the original repository.

Notes:
------
- Some files may have been excluded based on .gitignore rules and Repopack's
  configuration.
- Binary files are not included in this packed representation.
${config.output.removeComments ? '- Code comments have been removed.\n' : ''}

For more information about Repopack, visit: https://github.com/yamadashy/repopack
`;

  let headerText = defaultHeader;

  if (config.output?.headerText) {
    headerText += `
Additional User-Provided Header:
--------------------------------
${config.output.headerText}
`;
  }

  headerText += `
${LONG_SEPARATOR}
Repository Files
${LONG_SEPARATOR}
`;

  return headerText;
}
