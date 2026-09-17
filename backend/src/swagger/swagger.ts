import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bridgely API",
      version: "1.0.0",
      description: "API para la plataforma Bridgely - Marketplace que conecta clientes con desarrolladores",
    },
    servers: [
      { url: "/", description: "API Server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: { type: "string" },
            nombre: { type: "string" },
            email: { type: "string" },
            rol: { type: "string", enum: ["cliente", "developer", "admin"] },
          },
        },
        Idea: {
          type: "object",
          properties: {
            id: { type: "string" },
            titulo: { type: "string" },
            descripcion: { type: "string" },
            categoria: { type: "string" },
            presupuesto: { type: "number" },
            plazoDias: { type: "integer" },
            dificultad: { type: "string", enum: ["basica", "intermedia", "avanzada"] },
            cliente: { $ref: "#/components/schemas/Usuario" },
          },
        },
        Postulacion: {
          type: "object",
          properties: {
            id: { type: "string" },
            mensaje: { type: "string" },
            precioPropuesto: { type: "number" },
            estado: { type: "string", enum: ["pendiente", "aceptada", "rechazada"] },
            developer: { $ref: "#/components/schemas/Usuario" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function configurarSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Bridgely API Docs",
  }));
  app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));
}
