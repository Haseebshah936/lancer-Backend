const gig = require('../controllers/gig');
const router = require('express').Router();

router.post('/createGig', gig.createGig);
router.get('/getAllGigsByEmail/:email', gig.getAllGigsByEmail);
router.get('/getSingleGigById/:id', gig.getSingleGigById);
router.delete('/deleteGigById/:id', gig.deleteGigById);
router.put('/gigStatusChangeById/:id', gig.gigStatusChangeById);



module.exports = router;