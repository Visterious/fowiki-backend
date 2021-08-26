const Router = require('express');
    router = new Router();

const HeroController = require('../controllers/heroController');
const WeaponController = require('../controllers/weaponController');
const AccessoryController = require('../controllers/accessoryController');

router.get('/', (req, res) => {
    res.send('Home page');
});
router.get('/heroes', HeroController.getHeroes);
router.get('/heroes/:id', HeroController.getHero);

router.get('/weapons', WeaponController.getWeapons);
router.get('/weapons/:id', WeaponController.getWeapon);

router.get('/accessories', AccessoryController.getAccessories);
router.get('/accessories/:id', AccessoryController.getAccessory);

module.exports = router;
