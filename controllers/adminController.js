const Admins = require('../models/admins');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require("../config");

const generateAccessToken = (id) => {
    const payload = { id };
    return jwt.sign(payload, secret, {expiresIn: '24h'});
};

class AdminController {
    async getAdmins(req, res) {
        try {
            await Admins.getAdmins((err, admins) => {
                if (err) return res.status(500).send({err});
                res.send(admins);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getAdmin(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Admins.getAdmin(id ,(err, admin) => {
                if (err) return res.status(500).send({err});
                res.send(admin);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async createAdmin(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors});
            }
            const {username, password} = req.body;
            await Admins.findAdmin(username, async (err, admin) => {
                if (err) return res.status(500).send({err});
                if (admin) {
                    return res.status(400).json({message: `Admin exists`});
                }
                const hashPassword = bcrypt.hashSync(password, 7);
                await Admins.createAdmin({username, password: hashPassword}, async (err, admin) => {
                    if (err) return res.status(500).send({err});
                    return res.json({massage: 'Admin created'});
                });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            await Admins.findAdmin(username, (err, admin) => {
                if (err) return res.status(500).send({err});
                if (!admin) {
                    return res.status(400).json({message: `User ${username} not found`});
                }
                const validPassword = bcrypt.compareSync(password, admin.password);
                if (!validPassword) {
                    return res.status(400).json({message: `Incorrect password`});
                }
                const token = generateAccessToken(admin.id);
                return res.status(200).send({ token, username });
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async deleteAdmin(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ massege: "ID not specified"});
        }
        try {
            await Admins.deleteAdmin(id, async (err, admin) => {
                if (err) return res.status(500).send({err});
                await Admins.getAdmins((err, admins) => {
                    if (err) return res.status(500).send({err});
                    res.send(admins);
                });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new AdminController();
