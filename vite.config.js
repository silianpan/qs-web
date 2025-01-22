import path from 'path-browserify'
import fs from 'fs'
import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { createHtmlPlugin } from 'vite-plugin-html'
import styleImport from 'vite-plugin-style-import'
import replace from '@rollup/plugin-replace'
import eslintPlugin from 'vite-plugin-eslint'
import cesium from 'vite-plugin-cesium'
// import resolveExternalsPlugin from 'vite-plugin-resolve-externals'

export const hash = Math.floor(Math.random() * 90000) + 10000
// 参考vite-plugin-antdv1-momentjs-resolver插件，修改正则表达式，兼容Windows路径
// https://github.com/carl-jin/vite-plugin-antdv1-momentjs-resolver/blob/main/src/index.js
// 将moment_util.js中import * as moment from moment修改import moment from moment
// 原正则表达式
// const antdvDefaultReg = /ant-design-vue\/[\w-\\\/]*\.js$/
// 修改后正则表达式
// const antdvDefaultReg = /ant-design-vue[\/|\\][\w-\\\/]*\.js$/
const AntdMomentResolver = (reg = /ant-design-vue[\/|\\][\w-\\\/]*\.js$/) => {
  return {
    name: 'vite-plugin-antdv1-momentjs-resolver',
    configResolved(config) {
      //  以来预构建时候替换 esbuild
      config.optimizeDeps.esbuildOptions.plugins = config.optimizeDeps.esbuildOptions.plugins ? config.optimizeDeps.esbuildOptions.plugins : []
      config.optimizeDeps.esbuildOptions.plugins.push({
        name: 'replace-code',
        setup(build) {
          build.onLoad(
            {
              filter: reg
            },
            args => {
              // 首先获取源代码内容
              let source = fs.readFileSync(args.path, 'utf8')
              if (source.indexOf('import * as moment from')) {
                source = source.replace(/import\s\*\sas\smoment\sfrom/g, 'import moment from')
              }
              // 替换List组件代码，List.Item为undefined
              //if (source.indexOf('Vue.component(List.Item.name, List.Item);')) {
              //  source = source.replace(
              //    'Vue.component(List.Item.name, List.Item);',
              //    'Vue.component("AListItem", Item);'
              //  )
              //}
              //if (source.indexOf('Vue.component(List.Item.Meta.name, List.Item.Meta);')) {
              //  source = source.replace(
              //    'Vue.component(List.Item.Meta.name, List.Item.Meta);',
              //    'Vue.component("AListItemMeta", Item.Meta);'
              //  )
              //}
              return {
                contents: source
              }
            }
          )
        }
      })

      //  添加打包时的替换 rollup
      config.plugins.push(
        replace({
          values: {
            'import * as moment from': id => {
              return 'import moment from'
            }
          },
          include: [reg],
          preventAssignment: true
        })
      )
    }
  }
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    define: {
      'process.env': { ...env }
    },
    plugins: [
      // resolveExternalsPlugin({
      //   Cesium: 'Cesium'
      // }),
      cesium(),
      createVuePlugin({
        jsx: true
      }),
      AntdMomentResolver(),
      eslintPlugin(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: '啓思',
            cdn: {
              css: [],
              js: [
                'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
                'https://cdn.staticfile.org/vue-router/3.1.3/vue-router.min.js',
                'https://cdn.staticfile.org/vuex/3.1.1/vuex.min.js',
                'https://cdn.staticfile.org/axios/0.19.0/axios.min.js',
                'https://cdn.staticfile.org/xlsx/0.17.0/xlsx.full.min.js'
              ]
            }
          }
        }
      }),
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: name => {
              return `ant-design-vue/es/${name}/style/index`
            }
          },
          {
            libraryName: 'element-ui',
            //styleLibraryName: 'theme-chalk',
            esModule: true,
            resolveStyle: name => {
              return `theme-chalk/${name}.css`
            }
          }
        ]
      })
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: [
        {
          find: /@\/.+/,
          replacement: val => {
            return val.replace(/^@/, path.resolve(__dirname, './src/'))
          }
        }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // additionalData: `@import "./node_modules/ant-design-vue/lib/style/index.less";
          //     @import "./node_modules/ant-design-vue/es/style/themes/default.less";`,
          // additionalData: `@import "${path.resolve(__dirname, 'src/assets/style/global.less')}";`,
          modifyVars: {
            'ant-prefix': 'ant',
            'ant-pro-prefix': 'ant-pro',
            'ant-pro-page-header-wrap': 'ant-pro-page-header-wrap',
            'sider-menu-prefix-cls': 'ant-pro-sider-menu',
            'basicLayout-prefix-cls': 'ant-pro-basicLayout',
            'footer-toolbar-prefix-cls': 'ant-pro-footer-toolbar',
            'multi-tab-prefix-cls': 'ant-pro-multi-tab',
            'multi-tab-wrapper-prefix-cls': 'ant-pro-multi-tab-wrapper',
            'top-nav-header-prefix-cls': 'ant-pro-top-nav-header',
            'pro-layout-fixed-header-prefix-cls': 'ant-pro-fixed-header',
            'global-footer-prefix-cls': 'ant-pro-global-footer',
            'global-header-prefix-cls': 'ant-pro-global-header',
            'pro-header-bg': '#fff',
            'grid-content-prefix-cls': 'ant-pro-grid-content',
            'ant-pro-setting-drawer': 'ant-pro-setting-drawer',
            'layout-header-height': '64px',
            'ant-global-sider-zindex': 106,
            'ant-global-header-zindex': 105,
            'primary-color': '#348ee4',
            hack: `true; @import (reference) "${path.resolve('src/assets/style/global.less')}";`
          }
        },
        styl: {
          additionalData: `@import "${path.resolve(__dirname, 'src/assets/style/global.styl')}";`
        }
      }
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      commonjsOptions: {
        //  改为 ture 后就会转化 require 语法
        transformMixedEsModules: true
      },
      rollupOptions: {
        // // 确保外部化处理那些你不想打包进库的依赖
        // external: ['vue', 'vue-router', 'vuex', 'axios', 'xlsx'],
        // output: {
        //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        //   globals: {
        //     vue: 'Vue',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     axios: 'axios',
        //     xlsx: 'XLSX'
        //   }
        // }
        output: {
          entryFileNames: `[name]` + hash + `.js`,
          chunkFileNames: `[name]` + hash + `.js`,
          assetFileNames: `[name]` + hash + `.[ext]`
        }
      }
    },
    server: {
      proxy: {
        '/api-qs': {
          target: `http://127.0.0.1:8080`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\-qs/, '')
        },
        // 流程设计
        '/flow-api': {
          target: `http://127.0.0.1:8080`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/flow\-api/, '')
        },
        // 文档资源访问
        '/profile': {
          target: `http://127.0.0.1:8080`,
          changeOrigin: true
        },
        // websocket
        '/websocket': {
          target: `ws://127.0.0.1:8087`,
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(/^\/websocket/, '')
        },
        // pdfjs-viewer
        '/pdfjs': {
          target: `http://127.0.0.1:8008`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/pdfjs/, '')
        },
        // 百度OCR
        '/baidu-api': {
          target: `https://aip.baidubce.com`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/baidu\-api/, '')
        },
        // #region
        // lool start
        '/loleaflet': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        },
        '/hosting/discovery': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        },
        '/hosting/capabilities': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        },
        '^/lool/(.*)/ws$': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        },
        '^/lool': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        },
        '/lool/adminws': {
          target: `http://127.0.0.1:9980`,
          changeOrigin: true
        }
        // lool end
        // #endregion
      }
    }
  })
}
