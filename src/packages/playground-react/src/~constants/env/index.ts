import {
  __SCRIPTED_APP_DESC__,
  __SCRIPTED_APP_NAME__,
  __SCRIPTED_APP_VERSION__,
  __SCRIPTED_GIT_COMMIT_SHA__,
  __SCRIPTED_GIT_REPO_URL__,
  __SCRIPTED_PACKAGE_NAME__,
} from './data.scripted'

export const ENV = {

  // #region App Variables
  PACKAGE_NAME: __SCRIPTED_PACKAGE_NAME__,
  APP_NAME: __SCRIPTED_APP_NAME__,
  APP_VERSION: __SCRIPTED_APP_VERSION__,
  APP_DESCRIPTION: __SCRIPTED_APP_DESC__,
  APP_API_KEY: process.env.NEXT_PUBLIC_APP_API_KEY as string,
  MAIN_ACCESS_CODE: process.env.MAIN_ACCESS_CODE as string,
  // #endregion App Variables

  // #region Other metadata
  GIT_COMMIT_SHA: __SCRIPTED_GIT_COMMIT_SHA__,
  GITHUB_REPO_URL: __SCRIPTED_GIT_REPO_URL__,
  // #endregion Other metadata

}
