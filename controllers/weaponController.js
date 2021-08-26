const Weapons = require('../models/weapons');
const fs = require('fs');

const validCheck = (data) => {
    if (!data.name) {
        return 'Name not specified';
    }
    if (!data.type) {
        return 'Type not specified';
    }
    if (!data.damage) {
        return 'Damage not specified';
    }
    if (!data.pumping_level) {
        return 'Pumping level not specified';
    }
    if (!data.description) {
        return 'Description not specified';
    }
    return true;
};

class WeaponController {
    async getWeapons(req, res) {
        try {
            await Weapons.getWeapons((err, weapons) => {
                if (err) return res.status(500).send({err});
                res.send(weapons);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getWeapon(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Weapons.getWeapon(id ,(err, weapon) => {
                if (err) return res.status(500).send({err});
                res.send(weapon);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async createWeapon(req, res) {
        try {
            const data = req.body;
            const valid = validCheck(data);
            if (valid !== true) {
                return res.status(400).send({message: valid});
            }
            if (!data.image) {
                return res.status(400).send({message: 'Image not specified'});
            }
            await Weapons.createWeapon(data, async (err, hero) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Weapon created'});
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async uploadImage(req, res) {
        try {
            if (!req.files) {
                return res.json({massage: 'No files'});
            }
            else{
                const file = req.files.image;
                const filename = file.name;

                file.mv('./public/images/weapons/' + filename, (err) => {
                    if (err) return res.status(500).send({err});
                    return res.json({massage: 'File uploaded'});
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateWeapon(req, res) {
        try {
            const data = req.body;
            const valid = validCheck(data);
            if (valid !== true) {
                return res.status(400).send({message: valid});
            }
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            data.id = id;
            await Weapons.updateWeapon(data, (err) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Weapon updated'});
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteWeapon(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Weapons.getWeapon(id ,(err, hero) => {
                if (err) return res.status(500).send({err});
                fs.unlink('./public' + hero.image, (err) => {
                    if (err) return res.status(500).send({err});
                });
            });
            await Weapons.deleteWeapon(id, async (err) => {
                if (err) return res.status(500).send({err});
                await Weapons.getWeapons((err, heroes) => {
                    if (err) return res.status(500).send({err});
                    res.send(heroes);
                });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new WeaponController();
