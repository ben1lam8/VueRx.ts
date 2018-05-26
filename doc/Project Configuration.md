# VueRx.ts - Project Configuration

# Table of Contents
1. [Installation]()
2. [Node dependencies](#node-dependencies)
3. [Webpack](#webpack)
4. [Typescript](#typescript)
5. [IDE](#ide)
6. [Starter app](#starter-app)

# Installation
* clone this repo
```  
git clone git@github.com:ben1lam8/VueRx.ts.git
```

* install dependencies
```
npm i
```

* start the dev server
```
npm run dev
```

* try the starter app in your web browser
```
http://localhost:8080
```

# Node dependencies

```
// package.json

{
  "name": "vuerx.ts",
  "version": "1.0.0",
  "description": "Sandbox project using VueJS, RxJS and Typescript",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --hot",
    "build": "cross-env NODE_ENV=production webpack"
  },
  "keywords": [
    "VueJS",
    "RxJS",
    "VueRx",
    "Typescript"
  ],
  "author": "Benoit LAMIT",
  "license": "ISC",
  "devDependencies": {
    "cross-env": "^5.1.6",
    "css-loader": "^0.28.11",
    "ts-loader": "^4.3.0",
    "typescript": "^2.8.3",
    "vue-loader": "^15.2.0",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^4.8.3",
    "webpack-cli": "^2.1.4",
    "webpack-dev-server": "^3.1.4"
  },
  "dependencies": {
    "rxjs": "^6.2.0",
    "vue": "^2.5.16"
  }
}
```

```
npm install
```

# Webpack

```
// webpack.config.js

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

let config = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/dist",
        filename: "main.js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
            ],
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = config;
```

# Typescript

```
// tsconfig.json

{
  "include": [ "./src/**/*" ],
  "compilerOptions": {
    "module": "es6",
    "strict": true,
    "target": "es5",
    "moduleResolution": "node",
    "sourceMap": true,
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

# IDE

## Webstorm

Webstorm uses its own typescript transpilator to the code check syntax on the fly. If it used our webpack/ts config, it could then see that *.vue files had to be seen as .ts files, but it didn't.
Therefore, Webstorm will display an annoying "TS2307: Cannot find module..." each time you import a .vue file from a ts script, even if out configurated Webpack succeed in transpilation.

I didn't found any solution elegant enough for this problem. I suggest to simply disable the IDE's Typescript service (File > Settings > Languages & Frameworks > Typescript > uncheck "Typescript Language Service").
If you did, I'd be happy to know it : PMs are welcome.

# Starter app

This starter (POC) app simply exposes a single Typescript class, decorated with the Vue @Component annotation. This Vue Component holds a reactive basic RxJS merged data flow (combining an interval and an event observable).
Note that every line of code concerning the component lies inside a single .vue file.

```
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VueRx.ts</title>
</head>
<body>

<div id="app"></div>

<script src="/dist/main.js"></script>
</body>
</html>
```

```
// src/main.ts

import Vue from 'vue';
import App from './App';

new Vue({
    el: document.querySelector("#app") as Element,
    components: { App },
    render(h) {
        return h('App');
    }
});
```

```
// src/App.vue

<template>
    <div id="app">
        <p>
            Clock count: {{ticksCount}}<br/>
            User clicks count: {{userClicksCount}}<br/>
            Merged stream total: {{total}}<br/>
        </p>

        <button id="button">Click !</button>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Observable, interval, fromEvent, merge } from 'rxjs';

    @Component
    export default class App extends Vue {

        ticksCount: number = 0;
        userClicksCount: number= 0;
        total: number = 0;

        clock$?: Observable<number>;

        created(): void {
            this.clock$ = interval(1000);

            this.clock$.subscribe(
                tick =>  {
                    this.ticksCount++;
                }
            );
        }

        mounted(): void {
            let button = document.querySelector("#button") as Element;

            const click$ = fromEvent(button, 'click');

            click$.subscribe(
                event =>  {
                    this.userClicksCount++;
                } );

            let total$ = merge(this.clock$, click$);

            total$.subscribe(
                next => {
                    this.total++;
                }
            )
        }

    }
</script >

<style scoped>

</style>

```

```
npm run dev
```