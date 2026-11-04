import { type Config } from "prettier";

const config: Config = {
  trailingComma: "none",
  semi: false,
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  proseWrap: "preserve",
};

export default config;
