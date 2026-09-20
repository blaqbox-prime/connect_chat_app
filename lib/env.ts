const SUPABASE_URL_PATTERN = /^https?:\/\/.+/;
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

function readEnv() {
  return {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

function validateEnv(raw: ReturnType<typeof readEnv>): Env {
  const supabaseUrl = raw.supabaseUrl?.trim();
  const supabaseAnonKey = raw.supabaseAnonKey?.trim();

  const problems: string[] = [];

  if (!supabaseUrl) {
    problems.push('EXPO_PUBLIC_SUPABASE_URL is missing or empty');
  } else if (!SUPABASE_URL_PATTERN.test(supabaseUrl)) {
    problems.push(
      'EXPO_PUBLIC_SUPABASE_URL must be a valid http(s) URL, e.g. https://your-project-ref.supabase.co',
    );
  }

  if (!supabaseAnonKey) {
    problems.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing or empty');
  }

  if (problems.length > 0) {
    throw new Error(
      [
        'Invalid environment configuration',
        '',
        ...problems.map((problem) => `  - ${problem}`),
        '',
        'Create a `.env` file in the project root based on `.env.example`, then restart the dev server.',
      ].join('\n'),
    );
  }

  return {
    supabaseUrl: supabaseUrl ?? '',
    supabaseAnonKey: supabaseAnonKey ?? '',
  };
}

export const env: Readonly<Env> = validateEnv(readEnv());
export type { Env };