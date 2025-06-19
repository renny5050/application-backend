import { z } from 'zod';
import Specialty from '../models/specialties.models.js';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const nameSchema = z.string()
  .min(1, 'El nombre no puede estar vacío')
  .max(100, 'El nombre no puede exceder los 100 caracteres');

// Esquemas para parámetros de ruta
const specialtyIdSchema = z.object({ id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const createSpecialty = async (req, res) => {
  try {
    // Validar el cuerpo de la solicitud
    const validation = nameSchema.safeParse(req.body.name);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newSpecialty = await Specialty.create(validation.data);
    res.status(201).json(newSpecialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating specialty' });
  }
};

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    res.json(specialties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving specialties' });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = specialtyIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const specialty = await Specialty.findById(validation.data.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    res.json(specialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving specialty' });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const idValidation = specialtyIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    
    // Validar cuerpo de la solicitud
    const nameValidation = nameSchema.safeParse(req.body.name);
    if (!nameValidation.success) {
      return handleValidationError(nameValidation.error, res);
    }

    const updatedSpecialty = await Specialty.update(
      idValidation.data.id, 
      nameValidation.data
    );
    
    if (!updatedSpecialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    res.json(updatedSpecialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating specialty' });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = specialtyIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await Specialty.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting specialty' });
  }
};