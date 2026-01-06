import { z } from 'zod';


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export const reclamacionSchema = z.object({
    motivo: z.string()
        .min(10, { message: "El motivo debe tener al menos 10 caracteres." })
        .max(500, { message: "El motivo no puede exceder los 500 caracteres." }),
    idHistorialScore: z.number(),
    evidencia: z
        .any()
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true; // Es opcional
            return files[0]?.size <= MAX_FILE_SIZE;
        }, `El archivo debe pesar menos de 5MB.`)
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
        }, "Solo se aceptan formatos .jpg, .jpeg, .png y .pdf")
});