const examplePlugin = () => {
  let config

  return {
    name: 'read-config',

    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },

    // 在其他钩子中使用存储的配置
    transform(code, id) {
      if (config.command === 'serve') {
        // dev: 由开发服务器调用的插件
      } else {
        // build: 由 Rollup 调用的插件
      }
    }
  }
}

export default examplePlugin
