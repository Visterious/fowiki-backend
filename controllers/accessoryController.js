const Accessories = require('../models/accessories');
const fs = require('fs');

const validCheck = (data) => {
    if (!data.name) {
        return 'Name not specified';
    }
    if (!data.description) {
        return 'Description not specified';
    }
    return true;
};

class AccessoryController {
    async getAccessories(req, res) {
        try {
            await Accessories.getAccessories((err, accessories) => {
                if (err) return res.status(500).send({err});
                res.send(accessories);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getAccessory(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Accessories.getAccessory(id ,(err, accessory) => {
                if (err) return res.status(500).send({err});
                res.send(accessory);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async createAccessory(req, res) {
        try {
            const data = req.body;
            const valid = validCheck(data);
            if (valid !== true) {
                return res.status(400).send({message: valid});
            }
            if (!data.image) {
                return res.status(400).send({message: 'Image not specified'});
            }
            await Accessories.createAccessory(data, async (err, hero) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Accessory created'});
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

                file.mv('./public/images/accessories/' + filename, (err) => {
                    if (err) return res.status(500).send({err});
                    return res.json({massage: 'File uploaded'});
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateAccessory(req, res) {
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
            await Accessories.updateAccessory(data, (err) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Accessory updated'});
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteAccessory(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Accessories.getAccessory(id ,(err, hero) => {
                if (err) return res.status(500).send({err});
                fs.unlink('./public' + hero.image, (err) => {
                    if (err) return res.status(500).send({err});
                });
            });
            await Accessories.deleteAccessory(id, async (err) => {
                if (err) return res.status(500).send({err});
                await Accessories.getAccessories((err, heroes) => {
                    if (err) return res.status(500).send({err});
                    res.send(heroes);
                });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new AccessoryController();
