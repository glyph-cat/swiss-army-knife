declare global {

  namespace NodeJS {

    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      IS_INTERNAL_DEBUG_ENV?: 'false'
    }

  }

}

declare module '*.module.css' {
  const content: { [className: string]: string }
  export default content
}
