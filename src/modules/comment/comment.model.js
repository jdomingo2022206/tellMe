import {Schema, model, now} from 'mongoose';

const CommentSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que comenta es obligatorio']
  },
  userName: {
    type: String,
    required: [true, "El nombre del user que comenta es obligarorio"]
  },
  date:{
    type: Date,
    default: Date.now
  },
  publicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Catefories',
    required: [true, 'La publicacion es obligatoria']
  },
  publicationName: {
    type: String,
    required: [true, "El nombre de la publicacion es obligaroria"],
    unique: true,
  },
  comment: {
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

export default model('Comment', CommentSchema);