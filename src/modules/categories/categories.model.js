import mongoose from 'mongoose';

const CategorieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true
  },
  desc: {
    type: String,
    required: [true, "La descripcion es obligatoria"]
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Categorie', CategorieSchema);