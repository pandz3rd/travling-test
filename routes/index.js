
const { checkCredentials } = require('../middlewares/Authentication.js')

const apiEndpoints = (app) => {
    // Create user review
    app.post('/create-review', checkCredentials, (req, res) => {
        let review_name = 'Bot'
        let destination = 0
        let user_id = req.user_id
        let review = 'No review'
        let created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let upload_img = null
        let rating = 0

        if (req.body) {
            review_name = req.body.reviewer_name
            destination = req.body.id_destination
            review = req.body.review
            upload_img = req.body.upload_img
            rating = req.body.rating
        }

        const query = `INSERT INTO review_user 
        (id_destination, id_user, reviewer_name, review, created, upload_img, rating)
        VALUES(${destination}, ${user_id}, '${review_name}', '${review}', '${created}', '${upload_img}', ${rating});`

        db.query(query, (err, result) => {
            if (err) {
                res.status(500).send({ message: err, status: 500 })
            } else {
                res.status(200).send({ message: 'Review created.', status: 200 })
            }
        })
    })

    // Get all reviews
    app.get('/reviews', (req, res) => {
        const query = `SELECT r.id, r.id_destination, r.id_user, u.name, r.reviewer_name, r.review,
        r.created, r.upload_img, r.rating
        FROM review_user AS r
        JOIN user AS u on u.id = r.id_user`

        db.query(query, (err, result) => {
            if (err) {
                res.status(500).send({ message: err, status: 500 })
            } else {
                res.status(200).send({ message: result, status: 200 })
            }
        })
    })

    // Get review by id
    app.get('/review/:id', (req, res) => {
        const id = req.params.id

        const query = `SELECT r.id, r.id_destination, r.id_user, u.name, r.reviewer_name, r.review,
        r.created, r.upload_img, r.rating
        FROM review_user AS r
        JOIN user AS u ON u.id = r.id_user
        WHERE r.id = ${id}`

        db.query(query, (err, result) => {
            if (err) {
                res.status(500).send({ message: err, status: 500 })
            } else {
                res.status(200).send({ message: result, status: 200 })
            }
        })
    })

    // Edit user review by id
    app.patch('/review/:id/edit', checkCredentials, (req, res) => {
        const id = req.params.id
        const id_user = req.user_id
        const review_name = req.body.reviewer_name
        const review = req.body.review
        const upload_img = req.body.upload_img
        const rating = req.body.rating

        // check review exist?
        const existQuery = `SELECT r.id, r.id_destination, r.id_user, u.name, r.reviewer_name, r.review,
        r.created, r.upload_img, r.rating
        FROM review_user AS r
        JOIN user AS u ON u.id = r.id_user
        WHERE r.id = ${id}`

        db.query(existQuery, (err, check) => {
            if (err) {
                res.status(500).send({ message: 'Error get review', status: 500 })
            } else {
                if (check.length > 0 && check.id_user === id_user) {
                    const query = `UPDATE review_user
                    SET reviewer_name = '${review_name}', review = '${review}',
                    upload_img = '${upload_img}', rating = ${rating}
                    WHERE id = ${id} AND id_user = ${id_user}`
            
                    db.query(query, (err, result) => {
                        if (err) {
                            res.status(500).send({ message: err, status: 500 })
                        } else {
                            res.status(200).send({ message: 'Review updated', status: 200 })
                        }
                    })
                } else {
                    res.status(400).send({ message: 'Vailed update review', status: 400 })
                }
            }
        })
    })

    // Delete user review by id
    app.post('/review/:id/delete', checkCredentials, (req, res) => {
        const id = req.params.id
        const id_user = req.user_id

        // check review exist?
        const existQuery = `SELECT r.id, r.id_destination, r.id_user, u.name, r.reviewer_name, r.review,
        r.created, r.upload_img, r.rating
        FROM review_user AS r
        JOIN user AS u ON u.id = r.id_user
        WHERE r.id = ${id}`

        db.query(existQuery, (err, check) => {
            if (err) {
                res.status(500).send({ message: 'Error get review', status: 500 })
            } else {
                if (check.length > 0 && check.id_user === id_user) {
                    const query = `DELETE FROM review_user
                    WHERE id = ${id} AND id_user = ${id_user}`
            
                    db.query(query, (err, result) => {
                        if (err) {
                            res.status(500).send({ message: err, status: 500 })
                        } else {
                            res.status(200).send({ message: 'Review deleted', status: 200 })
                        }
                    })
                } else {
                    res.status(400).send({ message: 'Vailed delete review', status: 400 })
                }
            }
        })
    })
}

module.exports = apiEndpoints