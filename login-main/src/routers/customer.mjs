import express from 'express';
const router = express.Router();

import customerController from '../controllers/customerController.mjs'

router.get('/', (req, res) => {
    res.render('../views/login', { messages: {} });
});

router.get('/login', (req, res) => {
    const message = req.query.message || '';
    res.render('../views/login', { messages: { info: message } });
});

router.get('/register', (req, res) => {
    res.render('../views/register', { siteKey: '6Lc-FOopAAAAAO3fAv_3wyUbP2nmHwRpkOJtd2-A' });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/dashboard');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/dashboard', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        let query = `
            SELECT 
                Sex AS sex,
                sobrevivio,
                Pclass,
                COUNT(*) as count
            FROM pasajeros
            GROUP BY sex, sobrevivio, Pclass
        `;

        connection.query(query, (err, results) => {
            if (err) return res.status(500).send(err);

            let data = {
                muerenHombres: 0,
                vivenHombres: 0,
                muerenMujeres: 0,
                vivenMujeres: 0,
                totalMueren: 0,
                totalViven: 0,
                clase3Viven: 0,
                clase2Viven: 0,
                clase1Viven: 0,
                clase3Mueren: 0,
                clase2Mueren: 0,
                clase1Mueren: 0,
                totalMujeres: 0,
                totalHombres: 0
            };

            results.forEach(row => {
                if (row.sobrevivio === 1) {
                    if (row.sex === 'male') {
                        data.vivenHombres += row.count;
                    } else if (row.sex === 'female') {
                        data.vivenMujeres += row.count;
                    }
                    if (row.Pclass === 1) {
                        data.clase1Viven += row.count;
                    } else if (row.Pclass === 2) {
                        data.clase2Viven += row.count;
                    } else if (row.Pclass === 3) {
                        data.clase3Viven += row.count;
                    }
                    data.totalViven += row.count;
                } else if (row.sobrevivio === 0) {
                    if (row.sex === 'male') {
                        data.muerenHombres += row.count;
                    } else if (row.sex === 'female') {
                        data.muerenMujeres += row.count;
                    }
                    if (row.Pclass === 1) {
                        data.clase1Mueren += row.count;
                    } else if (row.Pclass === 2) {
                        data.clase2Mueren += row.count;
                    } else if (row.Pclass === 3) {
                        data.clase3Mueren += row.count;
                    }
                    data.totalMueren += row.count;
                }
                if (row.sex === 'male') {
                    data.totalHombres += row.count;
                } else if (row.sex === 'female') {
                    data.totalMujeres += row.count;
                }
            });

            res.render('dashboard', {
                data: data
            });
        });
    });
});

router.post('/add', customerController.register);
router.post('/request', customerController.login);
export default router;
