const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idlength = 15;

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The booking of customer name
 *         email:
 *           type: string
 *           description: The booking ofcustomer email
 *       example:
 *         id: "9"
 *         name: A Veerappan
 *         email: mailtomeveera@gmail.com
 */

/**
 * @swagger
 * tags:
 *   name: Hotelbooking
 *   description: The booking managing API
 */

/**
 * @swagger
 * /Hotelbooking:
 *   get:
 *     summary: View list of all the bookings
 *     tags: [Hotelbooking]
 *     responses:
 *       200:
 *         description: The list of the bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */

router.get("/", (req, res) => {
  const Hotelbooking = req.app.db.get("Hotelbooking");

  res.send(Hotelbooking);
});

/**
 * @swagger
 * /Hotelbooking/{id}:
 *   get:
 *     summary: Get the booking by id
 *     tags: [Hotelbooking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: The booking was not found
 */

router.get("/:id", (req, res) => {
  const Hotelbookings = req.app.db
    .get("Hotelbooking")
    .find({ id: req.params.id })
    .value();
  if (!Hotelbookings) {
    res.sendStatus(404);
  }
  res.send(Hotelbookings);
});

/**
 * @swagger
 * /Hotelbooking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Hotelbooking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: The booking was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
  try {
    const Hotelbookings = {
      id: nanoid(idlength),
      ...req.body,
    };

    req.app.db.get("Hotelbooking").push(Hotelbookings).write();
    res.send(Hotelbookings);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /Hotelbooking/{id}:
 *  put:
 *    summary: Update the booking by the id
 *    tags: [Hotelbooking]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The booking id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Booking'
 *    responses:
 *      200:
 *        description: The booking was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Booking'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
  try {
    req.app.db
      .get(Hotelbooking)
      .find({ id: req.params.id })
      .assign(req.body)
      .write();
    res.send(req.app.db.get("Hotelbooking").find({ id: req.params.id }));
  } catch (error) {
    return req.status(500).send(error);
  }
});

/**
 * @swagger
 * /Hotelbooking/{id}:
 *   delete:
 *     summary: Remove the booking by id
 *     tags: [Hotebooking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *
 *     responses:
 *       200:
 *         description: The booking was deleted
 *       404:
 *         description: The booking was not found
 */

router.delete("/:id", (req, res) => {
  res.app.db.get("Hotelbooking").remove({ id: req.params.id }).write();
  res.sendStatus(200);
});

module.exports = router;
