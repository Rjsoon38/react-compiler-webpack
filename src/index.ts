export const reactCompilerLoader = require.resolve('./react-compiler-loader');

export type { ReactCompilerConfig } from './types';
export type { ReactCompilerLoaderOption } from './react-compiler-loader';

import type { ReactCompilerLoaderOption } from './react-compiler-loader';
import type { NextConfig } from 'next/dist/server/config-shared';
import type { RuleSetRule } from 'webpack';

type RuleOptions = Omit<RuleSetRule, 'use'>;

export const defineReactCompilerLoaderOption = (options: ReactCompilerLoaderOption) => options;

export function withNext(pluginOptions?: ReactCompilerLoaderOption, ruleOptions: RuleOptions = {}) {
  return (nextConfig: NextConfig = {}) => {
    const $ruleOptions: RuleOptions = {
      test: /\.(mtsx|mjsx|tsx|jsx)$/,
      exclude: /node_modules/,
      ...ruleOptions
    };

    return {
      ...nextConfig,
      webpack(config, ctx) {
        if (typeof nextConfig.webpack === 'function') {
          config = nextConfig.webpack(config, ctx);
        }

        config.module.rules.push({
          ...$ruleOptions,
          use: [
            {
              loader: reactCompilerLoader,
              options: pluginOptions
            }
          ]
        } as RuleSetRule);

        return config;
      }
    } as NextConfig;
  };
}
