import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  const existeUsuario = await Veterinario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya existente");
    return res.status(400).json({ message: error.message });
  }

  try {
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar Email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error.message);
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ message: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = null;
    await usuarioConfirmar.save();
    return res.json({ message: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si existe el usuario
  const usuario = await Veterinario.findOne({ email });
  if (!usuario) {
    const error = new Error("Usuario no existe");
    return res.status(403).json({ message: error.message });
  }

  //Comprobar si confirmo la cuenta el usuario
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ message: error.message });
  }

  //Revisar el password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("Password incorrecto");
    return res.status(400).json({ message: error.message });
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json({ veterinario });
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ message: error.message });
  }

  try {
    existeVeterinario.token = Date.now().toString(32);
    await existeVeterinario.save();

    //Enviar Email
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ message: "Hemos enviado un correo con instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });
  if (tokenValido) {
    //Token valido
    res.json({ message: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ message: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ message: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ message: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un Error");
    return res.satus(400).json({ message: error.message });
  }

  const { email } = req.body;
  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
      const error = new Error("Ese Email ya esta en uso");
      return res.status(400).json({ message: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();
    res.json({ veterinarioActualizado });
  } catch (error) {
    res.json({ error });
  }
};

const actualizarPassword = async (req, res) => {
  //Leer datos
  const { id } = req.veterinario;
  const { pw_actual, pw_nuevo } = req.body;

  //Comprobar veterinario existe
  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ message: error.message });
  }

  //Comprobar PW
  if (!(await veterinario.comprobarPassword(pw_actual))) {
    const error = new Error("Compruebe su Password actual");
    return res.status(400).json({ message: error.message });
  }

  //Almacenar nuevo PW
  veterinario.password = pw_nuevo;
  await veterinario.save();
  res.json({message: 'Password almacenado correctamente'})
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
