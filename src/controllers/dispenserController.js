const Dispenser = require('../models/dispenserModel.js');

// Function to create a new dispenser
async function createDispenser(req, res) {
    const { flow_volume, tank_size, drink_name } = req.body;
    if (!flow_volume || typeof flow_volume !== 'number' || flow_volume <= 0) {
        return res.status(400).json({ error: 'Invalid flow_volume. It should be a positive number.' });
    }
    if (!tank_size || typeof tank_size !== 'number' || tank_size <= 0) {
        return res.status(400).json({ error: 'Invalid tank_size. It should be a positive number.' });
    }

    const newDispenser = {
        flow_volume: flow_volume,
        status: "closed",
        openTime: null,
        closeTime: null,
        drink_name: drink_name,
        tank_size: tank_size,
        remaining: tank_size,
    };

    await Dispenser.create(newDispenser)
    return res.json({ message: "Dispenser created" });

}

// Function to open a dispenser
async function openDispenser(req, res) {
    try {
        console.log("Opening Dispenser...")
        const dispenser = await Dispenser.findById(req.params.dispenserId);
        if (!dispenser) {
            return res.status(404).json({ error: 'Dispenser not found.' });
        }

        if (dispenser.status === 'open') {
            return res.json({ is_open: "already_open" });
        }

        dispenser.status = 'open';
        dispenser.openTime = new Date();
        await dispenser.save();
        res.json({ is_open: "open" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to open dispenser.' });
    }
};

// Function to close a dispenser
async function closeDispenser(req, res) {
    try {
        const dispenser = await Dispenser.findById(req.params.dispenserId);
        if (!dispenser) {
            console.log("Dispenser not found.")
            return res.status(404).json({ error: 'Dispenser not found.' });
        }

        if (dispenser.status === 'closed') {
            return res.status(200).json({ is_open: "already_close" });
        }
        const currentTime = new Date();
        dispenser.closeTime = currentTime;
        const timeDiffInSeconds = (dispenser.closeTime - dispenser.openTime) / 1000;
        const totalSpend = timeDiffInSeconds * dispenser.flow_volume;
        const remaining = dispenser.remaining
        dispenser.status = 'closed';
        dispenser.remaining = ((dispenser.remaining - totalSpend) < 0) ? 0 : (dispenser.remaining - totalSpend) 
        await dispenser.save();
        res.json({ is_open: "closed", spent: dispenser.remaining > 0 ? totalSpend : remaining });
    } catch (error) {
        res.status(500).json({ error: 'Failed to close dispenser.' });
    }
};

// Function to get dispenser information
async function getDispenserInfo(req, res) {
    const id = req.params.id;
    const dispenser = await Dispenser.findById(id);

    if (!dispenser) {
        return res.status(404).json({ error: 'Dispenser not found.' });
    }
    res.json({
        id: dispenser.id,
        flow_volume: dispenser.flow_volume,
        status: dispenser.status,
        openTime: dispenser.openTime,
        closeTime: dispenser.closeTime,
        drink_name: dispenser.drink_name,
        tank_size: dispenser.tank_size,
        remaining: dispenser.remaining,

    });
}

// Function to show all the dispensers with remaining > 0
async function getAllDispensers(req, res) { 
    try {
        const all_dispensers = await Dispenser.find()
        const available_dispensers = all_dispensers.filter(dispenser => dispenser.remaining > 0);
        res.status(200).json(available_dispensers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dispensers.' });
    }
};

module.exports = {
    createDispenser,
    getAllDispensers,
    openDispenser,
    closeDispenser,
    getDispenserInfo
};
