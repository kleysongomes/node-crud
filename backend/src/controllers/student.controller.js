const StudentModel = require('../models/student.model');
const asyncHandler = require('express-async-handler');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const StudentController = {

    index: asyncHandler(async (req, res) => {
        const { search = '' } = req.query;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        
        const { students, total } = await StudentModel.getAll({ page, limit, search });
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: students,
            pagination: { totalItems: total, totalPages, currentPage: page, itemsPerPage: limit }
        });
    }),

    show: asyncHandler(async (req, res) => {
        const { ra } = req.params;
        const student = await StudentModel.getByRa(ra);
        
        if (!student) {
            return res.status(404).json({ status: "fail", message: 'Aluno não encontrado' });
        }
        res.json({ data: student });
    }),

    store: asyncHandler(async (req, res) => {
        const { cpf } = req.body;

        if (!cpfValidator.isValid(cpf)) {
            return res.status(400).json({ 
                error: 'Dados inválidos.',
                details: ['O CPF fornecido não é válido.'] 
            });
        }
        
        const student = await StudentModel.create(req.body);
        res.status(201).json({ data: student });
    }),

    update: asyncHandler(async (req, res) => {
        const { ra } = req.params;
        
        const existing = await StudentModel.getByRa(ra);
        if (!existing) {
            return res.status(404).json({ status: "fail", message: 'Aluno não encontrado' });
        }

        const updated = await StudentModel.update({ ra, ...req.body });
        res.json({ data: updated });
    }),

    destroy: asyncHandler(async (req, res) => {
        const { ra } = req.params;

        const existing = await StudentModel.getByRa(ra);
        if (!existing) {
            return res.status(404).json({ status: "fail", message: 'Aluno não encontrado' });
        }

        await StudentModel.delete(ra);
        res.status(204).send();
    })
};

module.exports = StudentController;