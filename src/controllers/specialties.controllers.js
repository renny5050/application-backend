import Specialty from '../models/specialties.models.js';

export const createSpecialty = async (res) => {
    try {
        const { name } = req.body;
        const newSpecialty = await Specialty.create(name);
        res.status(201).json(newSpecialty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating specialty' });
    }
};

export const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await Specilty.findAll();
        res.json(specialties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving specialties' });
    }
};

export const getSpecialtyById = async (req, res) => {
    try {
        const specialty = await Specialty.findById(req.params.id);
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
        const { id } = req.params;
        const { name } = req.body;
        
        const updatedSpecialty = await Specialty.update(id, name);
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
        const { id } = req.params;
        const result = await Specialty.delete(id);
        if (!result) {
            return res.status(404).json({ error: 'Specialty not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting specialty' });
    }
};