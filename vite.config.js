import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

module.exports = defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/Plate.ts'),
            name: 'PlateJS',
            fileName: (format) => `plate.${format}.js`
        },
        rollupOptions: {
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    plate: 'PlateJS'
                }
            }
        }
    },
    plugins: [dts()]
});