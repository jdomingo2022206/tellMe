import mongoose from 'mongoose';

const PublicSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  userName: {
    type: String,
    required: [true, "El nombre del user es obligarorio"]
  },
  categorieId: {
    type: String,
    required: [true, "La categoria es obligaroria"],
    unique: true,
  },
  categorieName: {
    type: String,
    required: [true, "El nombre de la categoria es obligaroria"],
    unique: true,
  },
  text: {
    type: String,
    required: [true, "El texto es obligarorio"],
  },
  img: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

// PublicSchema.methods.toJSON = function(){
//   const { __v, userId, userName, _id, ...public} = this.toObject();
//   public.uid = _id;
//   return usuario;
// }

export default mongoose.model('Public', PublicSchema);