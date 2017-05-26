
export default (config:any) => {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "src/**/*.ts" },
            { pattern: "test/**/*.ts" }
        ],
        
        preprocessors: {
            "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx 
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"],
        karmaTypescriptConfig: {
            tsconfig: './karma.tsconfig.json'
        }
    });
};