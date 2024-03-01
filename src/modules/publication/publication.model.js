import {Schema, model, now} from 'mongoose';

const PublicationSchema = Schema({
  title: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  date:{
    type: Date,
    default: Date.now
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
    type: Schema.Types.ObjectId,
    ref: 'Catefories',
    required: [true, 'La cotegoria es obligatorio']
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
  comments: [{ 
    type: Schema.Types.ObjectId, ref: 'Comment' 
  }],
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

export default model('Publication', PublicationSchema);