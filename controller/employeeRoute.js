const express = require("express");
const employeeRoute = express.Router();
const employeeSchema = require("../model/employeeSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

employeeRoute.post("/create-employee", (req, res) => {
    employeeSchema.create(req.body, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    });
});

employeeRoute.post("/employeeLoginVerification", async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await employeeSchema.findOne({ email });

        if (!employee) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = bcrypt.compare(password, employee.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ employeeId: employee.employeeId });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

employeeRoute.get("/employee-ids", async (req, res) => {
    try {
        const employeeIds = await employeeSchema.find({}, 'employeeId');
        res.json(employeeIds);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

employeeRoute.get("/", (req, res) => {
    employeeSchema.find((err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    });
});

employeeRoute.route("/update-employee/:id")
    .get((req, res) => {
        employeeSchema.findById(mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err)
                return err;
            else
                res.json(data);
        });
    })
    .put((req, res) => {
        employeeSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.params.id),
            { $set: req.body },
            (err, data) => {
                if (err)
                    return err;
                else
                    res.json(data);
            }
        );
    });


employeeRoute.delete("/delete-employee/:id", (req, res) => {
    employeeSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    });
});



module.exports = employeeRoute;