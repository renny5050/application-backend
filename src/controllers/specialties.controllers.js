import Specialty from '../models/specialties.models.js';
import { 
  idSchema, 
  nameSchema, 
  specialtyIdSchema, 
  handleValidationError 
} from '../validations/specialties.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores

export const createSpecialty = async (req, res) => {
  try {
    // Validar el cuerpo completo de la solicitud
    const validation = nameSchema.safeParse(req.body.name);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newSpecialty = await Specialty.create(validation.data);
    res.status(201).json(newSpecialty);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    res.json(specialties);
  } catch (error) {
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    const nameValidation = nameSchema.safeParse(req.body);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
  }
};