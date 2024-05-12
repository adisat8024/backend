const express = require('express');
const timeTrackingRoute = express.Router();
const timeTrackingSchema = require('../model/timeTrackingSchema');
const mongoose = require('mongoose');

timeTrackingRoute.post('/recordTimeEntries', async (req, res) => {
    try {
      const { employeeID, inTime, outTime, date } = req.body;
      
      const newTimeTracking = new timeTrackingSchema({
        employeeID,
        inTime,
        outTime,
        date,
      });
  
      await newTimeTracking.save();
  
      res.status(201).json({ message: 'Time recorded successfully' });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

timeTrackingRoute.get('/', (req, res) => {
  timeTrackingSchema.find((err, data) => {
    if (err) return err;
    else res.json(data);
  });
});


timeTrackingRoute.get('/get-time-by-date/:date', (req, res) => {
  const { date } = req.params;

  timeTrackingSchema.find({ date }, (err, data) => {
    if (err) return err;
    else res.json(data);
  });
});


timeTrackingRoute.get('/get-time/:id', (req, res) => {
  timeTrackingSchema.findById(mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return err;
    else res.json(data);
  });
});


timeTrackingRoute.put('/update-time/:id', (req, res) => {
  timeTrackingSchema.findByIdAndUpdate(
    mongoose.Types.ObjectId(req.params.id),
    { $set: req.body },
    (err, data) => {
      if (err) return err;
      else res.json(data);
    }
  );
});


timeTrackingRoute.delete('/delete-time/:id', (req, res) => {
  timeTrackingSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return err;
    else res.json(data);
  });
});


timeTrackingRoute.get('/get-time-by-employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date } = req.query;

    let query = { employeeID: employeeId };

    
    if (date) {
      
      const selectedDate = new Date(date);

      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDate,
      };
    }

    const data = await timeTrackingSchema.find(query);

    res.json(data);
  } catch (error) {
    console.error('Error fetching time records:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = timeTrackingRoute;
