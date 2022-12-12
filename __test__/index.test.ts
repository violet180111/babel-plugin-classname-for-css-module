import path from 'path';
import fse from 'fs-extra';
import { transformSync } from '@babel/core';
import classnameForCssModule from '../src/index';
import type { BabelFileResult } from '@babel/core';

function newlineTrimmingSerializer(val: string) {
  const trimReg = /[\s\r\n]+/g;
  return val.replace(trimReg, ' ');
}

function readeFileWithTrim(dir: string): { sourceCode: string; expectOutput: string } {
  const codePath = path.resolve(dir, 'code.js');
  const outputPath = path.resolve(dir, 'output.js');
  const sourceCode = fse.readFileSync(codePath, {
    encoding: 'utf-8',
  });
  const expectOutput = fse.readFileSync(outputPath, {
    encoding: 'utf-8',
  });
  return {
    sourceCode,
    expectOutput,
  };
}

const testDirRoot = path.resolve(__dirname, '__fixtures__');

function getOutput(testPathname: string): {
  actualOutput: string;
  actualTrimOutput: string;
  expectOutput: string;
} {
  const { sourceCode, expectOutput } = readeFileWithTrim(path.resolve(testDirRoot, testPathname));

  const { code: actualOutput } = <BabelFileResult>transformSync(sourceCode, {
    sourceType: 'unambiguous',
    configFile: false,
    babelrc: false,
    plugins: [classnameForCssModule, '@babel/plugin-syntax-jsx'],
    // compact: true,
  });

  return {
    actualOutput: <string>actualOutput,
    actualTrimOutput: newlineTrimmingSerializer(<string>actualOutput),
    expectOutput: newlineTrimmingSerializer(expectOutput),
  };
}

describe('🧪 babel-plugin-classname-for-css-module 🧪', () => {
  const testDirs = fse.readdirSync(testDirRoot);

  test('jsx', () => {
    const { actualOutput, actualTrimOutput, expectOutput } = getOutput(testDirs[0]);

    fse.writeFileSync(path.resolve(__dirname, '../output.js'), actualOutput);

    expect(actualTrimOutput).toBe(expectOutput);
  });
});
