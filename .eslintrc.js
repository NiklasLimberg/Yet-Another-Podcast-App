module.exports = {
    plugins: [
        'react',
    ],
    extends: [
        'eslint:all',
        '@remix-run/eslint-config',
        'airbnb/base',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
    },
    parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
            jsx: true,
        },
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
};
