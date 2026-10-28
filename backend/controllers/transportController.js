import transportModel from '../models/transportModel.js';

const addTransport = async (req, res) => {
  try {
    const { name, fee } = req.body;
    const transport = new transportModel({ name, fee });
    await transport.save();
    res.json({ success: true, message: 'Transport option added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listTransport = async (req, res) => {
  try {
    const transports = await transportModel.find({});
    res.json({ success: true, transports });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeTransport = async (req, res) => {
  try {
    await transportModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Transport option removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addTransport, listTransport, removeTransport };
