import { vi } from "vitest";

vi.mock("../prisma", () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    perfilCliente: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    perfilDeveloper: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    idea: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    postulacion: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    transaccion: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    calificacion: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    notificacion: {
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    conversacion: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    mensaje: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    equpo: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn((fns: unknown[]) => Promise.all(fns)),
  },
}));
