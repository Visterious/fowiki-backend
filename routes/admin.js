const Router = require('express');
    router = new Router();

const {check} = require('express-validator');

const HeroController = require('../controllers/heroController');
const WeaponController = require('../controllers/weaponController');
const AccessoryController = require('../controllers/accessoryController');
const AdminController = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');


router.post('/login', [
    check('username', 'Username can\'t be empty.').notEmpty(),
    check('password', 'Must have more than 4 and less than 20 symbols').isLength({min: 4, max: 20})
], AdminController.login);
router.post('/registration', [
    check('username', 'Username can\'t be empty.').notEmpty(),
    check('password', 'Must have more than 4 and less than 20 symbols').isLength({min: 4, max: 20})
], AdminController.createAdmin);
router.get('/admins', authMiddleware, AdminController.getAdmins);
router.get('/admin/:id', authMiddleware, AdminController.getAdmin);

router.post('/heroes', authMiddleware, HeroController.createHero);
router.post('/heroes/uploadImage', authMiddleware, HeroController.uploadImage);
router.put('/heroes/:id', authMiddleware, HeroController.updateHero);
router.delete('/heroes/:id', authMiddleware, HeroController.deleteHero);

router.post('/weapons', authMiddleware, WeaponController.createWeapon);
router.post('/weapons/uploadImage', authMiddleware, WeaponController.uploadImage);
router.put('/weapons/:id', authMiddleware, WeaponController.updateWeapon);
router.delete('/weapons/:id', authMiddleware, WeaponController.deleteWeapon);

router.post('/accessories', authMiddleware, AccessoryController.createAccessory);
router.post('/accessories/uploadImage', authMiddleware, AccessoryController.uploadImage);
router.put('/accessories/:id', authMiddleware, AccessoryController.updateAccessory);
router.delete('/accessories/:id', authMiddleware, AccessoryController.deleteAccessory);

module.exports = router;
