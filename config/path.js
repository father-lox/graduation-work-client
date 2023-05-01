const clientDirectory = './';
const outputDirectory = './pub/';

export const path = {
    source: {
        styles: `${clientDirectory}pages/*/*.scss`,
        templates: `${clientDirectory}pages/*/*.pug`,
        images: `${clientDirectory}img/**/*`,
        fonts: `${clientDirectory}fonts/**/*`,
    },

    build: {
        styles: `${outputDirectory}pages`,
        templates: `${outputDirectory}pages`,
        images: `${outputDirectory}img/`,
        fonts: `${outputDirectory}fonts/`,
    },

    watch: {
        styles: [
            `${clientDirectory}pages/**/*.scss`,
            `${clientDirectory}code/**/*.scss`, 
            `${clientDirectory}layouts/**/*.scss`,
            `${clientDirectory}styles/**/*.scss`,
        ],
        templates: [
            `${clientDirectory}pages/**/*.pug`,
            `${clientDirectory}code/**/*.pug`, 
            `${clientDirectory}layouts/**/*.pug`
        ]
    },

    clear: outputDirectory
}