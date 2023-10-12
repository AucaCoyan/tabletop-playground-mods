export interface projectConfig {
  defaultVariant: defaultVariant;
  assets: Array<Record<string, string>>;
  variants: Record<string, Variant>;
}

export interface Variant {
  name: string;
  version: string;
  guid: { dev: string; prd: string };
  slug: string;
  lang: string[];
}

export type defaultVariant = string;
