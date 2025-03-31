declare global {

  namespace NodeJS {

    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      /**
       * @deprecated Find alternatives and stop using this.
       * This adds code complexity and reduces maintainability.
       */
      IS_INTERNAL_DEBUG_ENV?: 'false'
    }

  }

}

export { }
