const Service = require("../models/Service");
const Helpline = require("../models/Helpline");

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("IftiAdmin getServices error:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("IftiAdmin createService error:", error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("IftiAdmin updateService error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("IftiAdmin deleteService error:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

exports.getHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ createdAt: -1 });
    res.json(helplines);
  } catch (error) {
    console.error("IftiAdmin getHelplines error:", error);
    res.status(500).json({ message: "Failed to fetch helplines" });
  }
};

exports.createHelpline = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      numbers: (req.body.numbers || []).filter((num) => String(num).trim() !== ""),
    };

    const helpline = new Helpline(payload);
    await helpline.save();
    res.status(201).json(helpline);
  } catch (error) {
    console.error("IftiAdmin createHelpline error:", error);
    res.status(500).json({ message: "Failed to create helpline" });
  }
};

exports.updateHelpline = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      numbers: (req.body.numbers || []).filter((num) => String(num).trim() !== ""),
    };

    const helpline = await Helpline.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!helpline) {
      return res.status(404).json({ message: "Helpline not found" });
    }

    res.json(helpline);
  } catch (error) {
    console.error("IftiAdmin updateHelpline error:", error);
    res.status(500).json({ message: "Failed to update helpline" });
  }
};

exports.deleteHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.findByIdAndDelete(req.params.id);

    if (!helpline) {
      return res.status(404).json({ message: "Helpline not found" });
    }

    res.json({ message: "Helpline deleted successfully" });
  } catch (error) {
    console.error("IftiAdmin deleteHelpline error:", error);
    res.status(500).json({ message: "Failed to delete helpline" });
  }
};
