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
   * The API key for the Cybrancee Pterodactyl panel.
   * This is required if you want to use the restart functionality.
   */
  apiKey?: string;


  /**
   * If true, the server will install npm packages when it starts.
   */
  npmInstall?: boolean;

  /**
   * The entry file of your application.
   * This is the main file that will be executed when the server starts.
   */
  entryFile?: string;

  /**
   * Additional configuration options.
   * You can add any custom properties you need.
   */
  [key: string]: any;
}