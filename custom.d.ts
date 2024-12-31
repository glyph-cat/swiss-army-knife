declare global {

  namespace NodeJS {

    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      IS_INTERNAL_DEBUG_ENV?: 'false'
      CSS_CONTENT: {
        TemplateStyles: string
      }
    }

  }

}

export { }
