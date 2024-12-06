import fs from 'fs';
import * as glob from 'glob';
import chalk from 'chalk';

const { log } = console;
const globOpts = { cwd: 'src/locales' };
const defaultLocaleFile = 'en/translation.json';
const files = glob.sync('**/translation.json', globOpts);
const normalizedFiles = {};
const errors = {};

/**
 * Return a new copy of the array lowercased and sorted
 */
function lowerCaseSortedArray(arr) {
  return arr.slice().map(v => v.toLowerCase()).sort();
}

/**
 * Return the keys in an array that are not sorted (not considering case in sort)
 */
function unsortedKeys(arr) {
  const sortedArray = lowerCaseSortedArray(arr);
  return arr.filter((v, i) => v.toLowerCase() !== sortedArray[i]);
}

/**
 * Return any keys in array 2 that are not in array 1
 * (values will be sorted and downcased for comparison)
 */
function missingKeys(arr1, arr2) {
  const sortedDowncasedLeftHandArray = lowerCaseSortedArray(arr1);
  const sortedDowncasedRightHandArray = lowerCaseSortedArray(arr2);

  return sortedDowncasedLeftHandArray.filter((v, i) => !sortedDowncasedRightHandArray.includes(v));
}

files.forEach((fileName) => {
  const fileContent = fs.readFileSync(`src/locales/${fileName}`);
  normalizedFiles[fileName] = Object.keys(JSON.parse(fileContent.toString()).translation);
});

const completeKeys = normalizedFiles[defaultLocaleFile].slice().sort();

Object.keys(normalizedFiles).forEach((fileName) => {
  const unsorted = unsortedKeys(normalizedFiles[fileName]);
  const missing = missingKeys(completeKeys, normalizedFiles[fileName]);

  if (unsorted.length) {
    errors[fileName] = errors[fileName] || [];
    errors[fileName].push('Keys are not sorted properly');
    errors[fileName].push(
      `\tSorting starts to be incorrect around: ${unsorted[0]}`,
    );
  }

  if (missing.length) {
    errors[fileName] = errors[fileName] || [];
    errors[fileName].push('Some keys from the default locale file are missing');
    errors[fileName].push(
      `\tMissing keys: ${missing.join(', ')}`,
    );
  }
});

Object.keys(errors).forEach((errorFileName) => {
  log(chalk.red(`${chalk.inverse.bold(errorFileName)} has ${chalk.underline.bold('internationalization')} errors`));
  errors[errorFileName].forEach((error) => {
    log(`\t${chalk.yellow(error)}`);
  });
});
