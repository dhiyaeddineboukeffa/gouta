import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true }
});

const transportModel = mongoose.models.transport || mongoose.model('transport', transportSchema);
export default transportModel;
