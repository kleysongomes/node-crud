const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user.model');

// Função para gerar o token JWT
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    });
};

const AuthController = {
    register: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
        }

        const userExists = await UserModel.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com este e-mail.' });
        }

        // Encriptar a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({ email, password: hashedPassword });

        const token = generateToken(newUser.id, newUser.email);
        res.status(201).json({
            message: "Usuário registado com sucesso!",
            token
        });
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.id, user.email);
            res.status(200).json({
                message: "Login bem-sucedido!",
                token
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas.' });
        }
    })
};

module.exports = AuthController;