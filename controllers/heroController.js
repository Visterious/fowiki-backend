const Heroes = require('../models/heroes');
const fs = require('fs');

const validCheck = (data) => {
    if (!data.name) {
        return 'Name not specified';
    }
    if (!data.gender) {
        return 'Gender not specified';
    }
    if (!data.weapon) {
        return 'Weapon not specified';
    }
    if (!data.class) {
        return 'Class not specified';
    }
    if (!data.quality) {
        return 'Quality not specified';
    }
    if (!data.fraction) {
        return 'Fraction not specified';
    }
    if (!data.description) {
        return 'Description not specified';
    }
    return true;
};

class HeroController {
    async getHeroes(req, res) {
        try {
            await Heroes.getHeroes((err, heroes) => {
                if (err) return res.status(500).send({err});
                res.send(heroes);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getHero(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Heroes.getHero(id ,(err, hero) => {
                if (err) return res.status(500).send({err});
                res.send(hero);
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async createHero(req, res) {
        try {
            const data = req.body;
            const valid = validCheck(data);
            if (valid !== true) {
                return res.status(400).send({message: valid});
            }
            if (!data.image) {
                return res.status(400).send({message: 'Image not specified'});
            }
            await Heroes.createHero(data, async (err, hero) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Hero created'});
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

                file.mv('./public/images/heroes/' + filename, (err) => {
                    if (err) return res.status(500).send({err});
                    return res.json({massage: 'File uploaded'});
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateHero(req, res) {
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
            await Heroes.updateHero(data, (err) => {
                if (err) return res.status(500).send({err});
                return res.json({massage: 'Hero updated'});
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteHero(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ massege: "ID not specified"});
            }
            await Heroes.getHero(id ,(err, hero) => {
                if (err) return res.status(500).send({err});
                fs.unlink('./public' + hero.image, (err) => {
                    if (err) return res.status(500).send({err});
                });
            });
            await Heroes.deleteHero(id, async (err) => {
                if (err) return res.status(500).send({err});
                await Heroes.getHeroes((err, heroes) => {
                    if (err) return res.status(500).send({err});
                    res.send(heroes);
                });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new HeroController();
