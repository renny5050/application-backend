// controllers/attendance.controller.js
import AttendanceModel from '../models/attendance.model.js';
import {
  attendanceSchema,
  partialAttendanceSchema,
  attendanceIdSchema,
  studentClassSchema,
  classDateSchema,
  studentIdSchema,
  classIdSchema,
  handleValidationError
} from '../validations/attendance.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores


export const createAttendance = async (req, res) => {
  try {
    console.log('Creando nuevo registro de asistencia...', req.body);
    const validation = attendanceSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('Error de validación:', validation.error);
      return handleValidationError(validation.error, res);
    }

    const newAttendance = await AttendanceModel.create(validation.data);
    res.status(201).json(newAttendance);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await AttendanceModel.findAll();
    res.json(attendances);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const validation = attendanceIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const attendance = await AttendanceModel.findById(validation.data.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }
    res.json(attendance);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const idValidation = attendanceIdSchema.safeParse(req.params);
    const bodyValidation = partialAttendanceSchema.safeParse(req.body);

    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }
    if (Object.keys(bodyValidation.data).length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
    }

    const updatedAttendance = await AttendanceModel.update(
      idValidation.data.id,
      bodyValidation.data
    );

    if (!updatedAttendance) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }

    res.json(updatedAttendance);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const validation = attendanceIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await AttendanceModel.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAttendanceByStudentAndClass = async (req, res) => {
  try {
    const validation = studentClassSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { student_id, class_id } = validation.data;
    const attendances = await AttendanceModel.findByStudentAndClass(student_id, class_id);
    res.json(attendances);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const validation = classDateSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { class_id, date } = validation.data;
    const attendances = await AttendanceModel.findByClassAndDate(class_id, date);
    res.json(attendances);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const validation = studentIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { student_id } = validation.data;
    const attendances = await AttendanceModel.findByStudent(student_id);
    res.json(attendances);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAttendanceByClass = async (req, res) => {
  try {
    const validation = classIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { class_id } = validation.data;
    const attendances = await AttendanceModel.findByClass(class_id);
    res.json(attendances);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};