export interface CybranceeConfig {
    /**
   * If true, the bot will restart when a new commit is pushed to the repository (default branch).
   */
  restartOnPush?: boolean;

  /**
   * If true, the bot will deploy the latest config changes to the server when a new commit is pushed to the repository (default branch).
   * This is useful for automatically deploying changes without manual intervention.
   */
  deployOnPush?: boolean;

  /**
   * The server ID of your Cybrancee service.
   * This is required if you want to use the restart functionality.
   */
  serverId?: string;

  /**
   * If true, the server will install npm packages when it starts.
   */
  npmInstall?: boolean;

  /**
   * If true, the server will install node packages when it starts.
   * This is useful for installing specific Node.js packages required by your application.
   */
  nodePackages?: string[];

  /**
   * The entry file of your application.
   * This is the main file that will be executed when the server starts.
   */
  entryFile?: string;

  /**
   * The username of the Github account that owns the repository.
   * This is required for Cybrancee to access the repository and fetch the latest commits.
   */
  username?: string;

  /**
   * The url of the Github repository.
   * This is required for Cybrancee to access the repository and fetch the latest commits.
   */
  repositoryUrl?: string;

  /**
   * Additional configuration options.
   * You can add any custom properties you need.
   */
  [key: string]: any;
}