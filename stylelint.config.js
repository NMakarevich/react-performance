/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
    'stylelint-config-recess-order',
  ],
  rules: {
    'block-no-empty': true,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'color-no-invalid-hex': true,
  },
};
