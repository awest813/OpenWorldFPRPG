import fs from 'node:fs';
import path from 'node:path';

const unresolvedImportRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow unresolved relative imports'
        },
        schema: [],
        messages: {
            unresolved: "Unable to resolve import '{{importPath}}'."
        }
    },
    create(context) {
        function isResolvable(importPath, filename) {
            if (!importPath || (!importPath.startsWith('.') && !importPath.startsWith('/'))) {
                return true;
            }

            const sanitizedPath = importPath.split('?')[0].split('#')[0];
            const resolvedPath = path.resolve(path.dirname(filename), sanitizedPath);
            const candidates = [
                resolvedPath,
                `${resolvedPath}.js`,
                `${resolvedPath}.mjs`,
                `${resolvedPath}.cjs`,
                path.join(resolvedPath, 'index.js'),
                path.join(resolvedPath, 'index.mjs')
            ];

            return candidates.some((candidate) => fs.existsSync(candidate));
        }

        return {
            ImportDeclaration(node) {
                const importPath = node.source?.value;
                const filename = context.filename;

                if (typeof importPath !== 'string' || isResolvable(importPath, filename)) {
                    return;
                }

                context.report({
                    node: node.source,
                    messageId: 'unresolved',
                    data: { importPath }
                });
            }
        };
    }
};

export default [
    {
        ignores: ['lib/**', 'assets/**', 'node_modules/**']
    },
    {
        files: ['game.js', 'src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                URLSearchParams: 'readonly',
                URL: 'readonly',
                Blob: 'readonly',
                fetch: 'readonly',
                FileReader: 'readonly',
                TextEncoder: 'readonly',
                navigator: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                requestAnimationFrame: 'readonly',
                localStorage: 'readonly',
                performance: 'readonly',
                BABYLON: 'readonly',
                GUI: 'readonly',
                HavokPhysics: 'readonly',
                SCENE_MANAGER: 'readonly',
                DEBUG: 'readonly',
                PLAYER: 'readonly',
                DUMMY: 'readonly',
                DMGPOP: 'writable',
                HPBAR: 'writable',
                VFX: 'writable',
                SHADERS: 'writable',
                GRID: 'writable',
                GRIDS: 'writable',
                TOOLS: 'writable',
                MESH_LIBRARY: 'writable',
                targetBaseOnCameraView: 'writable',
                ON_MOBILE: 'readonly',
                CANVASES: 'writable',
                inputMap: 'readonly',
                terrain: 'writable',
                terrainHeightData: 'writable',
                terrainSubdivisions: 'writable',
                terrainBody: 'writable',
                terrainShape: 'writable',
                anim: 'writable',
                box: 'writable',
                lil: 'readonly',
            }
        },
        plugins: {
            local: {
                rules: {
                    'no-unresolved-imports': unresolvedImportRule
                }
            }
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'local/no-unresolved-imports': 'error'
        }
    }
];
