import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import middleware from "../middlewares/jwt-middleware";
const dashboardRouter = Router();

dashboardRouter.get(
  "/clientsPending",
  middleware,
  dashboardController.getClientsPendingDocuments
);

dashboardRouter.get(
  "/clientsValid",
  middleware,
  dashboardController.getClientsValidDocuments
);

dashboardRouter.get(
  "/clientsRejected",
  middleware,
  dashboardController.getClientsRejectedDocuments
);

dashboardRouter.get(
  "/providersPending",
  middleware,
  dashboardController.getProvidersPendingDocuments
);

dashboardRouter.get(
  "/providersValid",
  middleware,
  dashboardController.getProvidersValidDocuments
);

dashboardRouter.get(
  "/providersRejected",
  middleware,
  dashboardController.getProvidersRejectedDocuments
);

export default dashboardRouter;
