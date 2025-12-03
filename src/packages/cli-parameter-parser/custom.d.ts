declare global {

  namespace NodeJS {

    interface ProcessEnv {
      /**
       * The NodeJS environment.
       */
      NODE_ENV?: 'development' | 'production' | 'test'
      /**
       * Is current execution environment based on package source code?
       * This is a _**custom**_ environment variable available only at build-time.
       */
      IS_SOURCE_ENV?: 'false'
      /**
       * Is current execution target for a production bundle?
       * This is a _**custom**_ environment variable available only at build-time.
       */
      IS_PRODUCTION_TARGET?: 'false'
      /**
       * Git commit hash of which the package was built.
       * This is a _**custom**_ environment variable available only at build-time.
       */
      PACKAGE_BUILD_HASH?: string
      /**
       * The package build type.
       * This is a _**custom**_ environment variable available only at build-time.
       */
      PACKAGE_BUILD_TYPE?: string
      /**
       * The package version.
       * This is a _**custom**_ environment variable available only at build-time.
       */
      PACKAGE_VERSION?: string
    }

  }

}

export { }
