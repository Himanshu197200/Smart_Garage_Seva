import app from './app';
import DatabaseConnection from './patterns/singleton/DatabaseConnection';
import ConfigManager from './patterns/singleton/ConfigManager';
import Logger from './patterns/singleton/Logger';
import { MaintenanceScanJob } from './jobs/MaintenanceScanJob';
import { InventoryAlertJob } from './jobs/InventoryAlertJob';

const config = ConfigManager.getInstance();
const port = config.get('port');
const mongoUri = config.get('mongoUri');

async function startServer() {
  try {
    await DatabaseConnection.getInstance().connect(mongoUri);

    const maintenanceJob = new MaintenanceScanJob();
    maintenanceJob.start();

    const inventoryJob = new InventoryAlertJob();
    inventoryJob.start();

    app.listen(port, () => {
      Logger.getInstance().info(`Server running on port ${port}`);
    });
  } catch (error) {
    Logger.getInstance().error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  Logger.getInstance().error(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.getInstance().error(`Uncaught exception: ${error.message}`, error);
  process.exit(1);
});

startServer();
