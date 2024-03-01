import {Schema, model, now} from 'mongoose';

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  mail: {
    type: String,
    required: [true, "El correo es obligarorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligaroria"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  },
  date:{
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.toJSON = function(){
  const { __v, password, _id, ...usuario} = this.toObject();
  usuario.uid = _id;
  return usuario;
}

export default model('User', UserSchema);