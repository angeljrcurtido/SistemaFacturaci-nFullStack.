const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

//Habilitar CORS para todas las rutas
app.use(cors());
app.use(express.json({ limit: '50mb' }));// Añade esta línea
app.use(express.urlencoded({ limit: '50mb', extended: true }));


mongoose.connect('mongodb+srv://angeljrcurtido:curtidobenitez082@cluster0.j3h8cfj.mongodb.net/Sistema2?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error de conexión a MongoDB Atlas', err));

//Modelos
const cajaSchema = new mongoose.Schema({
  estado: { type: String, default: 'cerrado' },
  situacionCaja: { type: String, default: 'Activo' }, // Nuevo campo
  fechaApertura: { type: Date },
  fechaCierre: { type: Date },
  montoInicial: { type: Number, required: true },
  montoFinal: { type: Number },
  moneda: { type: Number }, // Monto en moneda
  billete: { type: Number }, // Monto en billetes
  cheque: { type: Number }, // Monto en cheques
  tarjeta: { type: Number }, // Monto en tarjetas
  gastos: { type: Number }, // Monto en gastos
  ingresos: { type: Number } // Monto en ingresos
});

const Caja = module.exports = mongoose.model('Caja', cajaSchema);

// Datos de Cliente
const DatosClienteSchema = new mongoose.Schema({
  nombreCliente: String,
  rucCliente: String,
  direccionCliente: String,
});
const DatosCliente = mongoose.model('DatosCliente', DatosClienteSchema);
//Datos de Empresa
const DatosEmpresaSchema = new mongoose.Schema({
  Comercial: String,
  Ruc: String,
  Telefono: String,
  Direccion: String,
  Timbrado: String,
});

const DatosEmpresa = mongoose.model('DatosEmpresa', DatosEmpresaSchema);

//Categoria General
const CategoriaGralSchema = new mongoose.Schema({
  nombre: { type: String},
  subCategorias: { type: [String]},
});
const CategoriaGral = mongoose.model('CategoriaGral', CategoriaGralSchema);

//Imagenes 
const ImagenesGralSchema = new mongoose.Schema({
  imagensuperior: {
    type: [String],  // Define como un array de cadenas para almacenar múltiples imágenes en base64
    required: true   // Se puede establecer como requerido si todas las imágenes deben tener este campo
  },
  stylebotonesdebajo: {
    type: [String],  // Define como un array de cadenas para múltiples textos
    required: false  // Opcional, pero puede ser requerido si es necesario
  }
});
const ImagenesGral = mongoose.model('ImagenesGral', ImagenesGralSchema)

//Categoria
const CategoriaSchema = new mongoose.Schema({
  nombre: String,
});
const Categoria = mongoose.model('Categoria', CategoriaSchema);
//Proveedor 
const ProveedorSchema = new mongoose.Schema({
  nombreEmpresa: String,
  ruc: String,
  direccion: String,
  telefono: String,

})
const Proveedor = mongoose.model('Proveedor', ProveedorSchema);

//Producto
const ProductoSchema = new mongoose.Schema({
  nombreProducto: String,
  categoria: String, // Nuevo campo
  precioCompra: Number,
  precioVenta: Number,
  fechaVencimiento: Date,
  stockMinimo: Number,
  Iva: String,
  stockActual: Number,
  ubicacion: String,
  proveedor: String,
  unidadMedida: String,
  codigoBarra: String, // Nuevo campo
});


const Producto = mongoose.model('Producto', ProductoSchema);

//Contador Numero Interno
const ContadorSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Contador = mongoose.model('Contador', ContadorSchema);

//Ventas al contado  
const VentaSchema = new mongoose.Schema({
  numeroInterno: Number,
  numeroFactura: String,
  numeroTimbrado: String,
  cliente: String,
  comercial: String,
  telefono: String,
  rucempresa: String,
  ruccliente: String,
  direccion: String,
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      nombreProducto: {  // Nuevo campo
        type: String
      },
      precioVenta: {  // Nuevo campo
        type: String
      },
      cantidad: Number
    }
  ],
  PrecioVentaTotal: Number,
  PrecioCostoTotal: Number,
  Ganancias: Number,
  Iva10: Number, // Nuevo campo para el IVA del 10%
  Iva5: Number, // Nuevo campo para el IVA del 5%
  estado: { type: String, default: 'activo' },
  fechaVenta: { type: Date, default: Date.now }
});
const Venta = mongoose.model('Venta', VentaSchema);


// Venta a credito 
const VentaCreditoSchema = new mongoose.Schema({
  numeroInterno: Number,
  numeroFactura: String,
  numeroTimbrado: String,
  cliente: String,
  comercial: String,
  telefono: String,
  rucempresa: String,
  ruccliente: String,
  direccion: String,
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      nombreProducto: String, // Nombre del producto
      precioVenta: String, // Precio de venta del producto
      cantidad: Number
    }
  ],
  PrecioVentaTotal: Number,
  PrecioCostoTotal: Number,
  Ganancias: Number,
  Iva10: Number,
  Iva5: Number,
  estado: { type: String, default: 'activo' },
  fechaVenta: { type: Date, default: Date.now },

  // Atributos adicionales para ventas a crédito
  estadoVenta: { type: String, default: 'credito' }, // Estado de la venta (por defecto crédito)
  cuotas: { type: Boolean, default: false }, // Indica si la venta tiene cuotas (por defecto no)
  cuotainicial: { type: Number, default: 0 }, // Cuota inicial (por defecto 0)
  cuotafinal: { type: Number, default: 0 }, // Cuota final (por defecto 0)
  cantidadCuotas: { type: Number, default: 0 },// Cantidad de cuotas (por defecto 0)
  montoCuota: { type: Number, default: 0 }, // Monto de la cuota (por defecto)
  montoPagado: { type: Number, default: 0 }, // Monto pagado (por defecto 0)
});
const VentaCredito = mongoose.model('VentaCredito', VentaCreditoSchema);
// ESQUEMA REGISTRO DE PAGOS CUOTAS  =================
const PagoCuotaSchema = new mongoose.Schema({
  ventaCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'VentaCredito' },
  montoPagado: Number,
  fechaPago: { type: Date, default: Date.now },
  estado: { type: String, default: 'activo' }, // Campo para el estado del pago
  cambio: { type: Number, default: 0 }, // Campo para registrar el cambio
  totalpago: { type: Number, default: 0 }
});

const PagoCuota = mongoose.model('PagoCuota', PagoCuotaSchema);
// ESQUEMA COMPRAS 
const compraSchema = new mongoose.Schema({
  proveedor: { type: String, required: true },
  producto: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      nombreProducto: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precioCompra: { type: Number, required: true },
    }
  ],

  precioCompraTotal: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  facturaNumero: { type: String },
  Telefono: { type: String },
  Direccion: { type: String }
});
const Compra = module.exports = mongoose.model('Compra', compraSchema);
//FIN ESQUEMA COMPRAS

//CONTROLLERS PARA CAJA
// Crear apertura de caja
app.post('/caja/abrir', async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const existingCaja = await Caja.findOne({
    estado: 'abierto',
    situacionCaja: 'Activo',
    fechaApertura: { $gte: start, $lt: end }
  });

  if (existingCaja) {
    return res.status(400).send('Ya existe una caja abierta y activa para hoy.');
  }

  const caja = new Caja({
    estado: 'abierto',
    situacionCaja: 'Activo',
    fechaApertura: new Date(),
    montoInicial: req.body.montoInicial,
    moneda: req.body.moneda,
    billete: req.body.billete,
    cheque: req.body.cheque,
    tarjeta: req.body.tarjeta,
    gastos: req.body.gastos,
    ingresos: req.body.ingresos
  });

  await caja.save();
  res.send(caja);
});

// Cerrar caja
app.put('/caja/cerrar/:id', async (req, res) => {
  const caja = await Caja.findByIdAndUpdate(req.params.id, {
    estado: 'cerrado',
    fechaCierre: new Date(),
    montoFinal: req.body.montoFinal,
    moneda: req.body.moneda,
    billete: req.body.billete,
    cheque: req.body.cheque,
    tarjeta: req.body.tarjeta,
    gastos: req.body.gastos,
    ingresos: req.body.ingresos
  }, { new: true });
  res.send(caja);
});

// Obtener todas las cajas
app.get('/caja', async (req, res) => {
  const cajas = await Caja.find();
  res.send(cajas);
});

// Obtener todas las cajas ordenadas por fecha de apertura
app.get('/caja/fechaapertura', async (req, res) => {
  const cajas = await Caja.find().sort({ fechaApertura: -1 });
  res.send(cajas);
});

// Obtener todas las cajas abiertas y activas
app.get('/caja/abiertas', async (req, res) => {
  const cajas = await Caja.find({ estado: 'abierto', situacionCaja: 'Activo' });
  res.send(cajas);
});

// Obtener todas las cajas activas
app.get('/caja/activas', async (req, res) => {
  try {
    let cajas = await Caja.find({ situacionCaja: 'Activo' });
    if (cajas.length === 0) {
      // Si no hay cajas activas, creamos una caja por defecto
      const nuevaCaja = new Caja({
        estado: 'abierto',
        situacionCaja: 'Activo',
        fechaApertura: new Date(),
        montoInicial: 0,
        moneda: 0,
        billete: 0,
        cheque: 0,
        tarjeta: 0,
        gastos: 0,
        ingresos: 0
      });
      await nuevaCaja.save();
      cajas = [nuevaCaja];
    }
    res.status(200).json(cajas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las cajas activas', error });
  }
});

// Anular caja
app.put('/caja/anular/:id', async (req, res) => {
  const caja = await Caja.findByIdAndUpdate(req.params.id, {
    situacionCaja: 'Anulado' // Establecer a 'Anulado'
  }, { new: true });
  res.send(caja);
});
//CONTROLLERS PARA PROVEEDOR
//Crear proveedor
app.post('/proveedor', async (req, res) => {
  console.log(req.body);
  const proveedor = new Proveedor(req.body);
  await proveedor.save();
  res.send(proveedor);
});
//Editar un proveedor
app.put('/proveedor/:id', async (req, res) => {
  const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(proveedor);
});
//Obtener todos los proveedores
app.get('/proveedor', async (req, res) => {
  const proveedores = await Proveedor.find();
  res.send(proveedores);
});
//Obtener un proveedor por id
app.get('/proveedor/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).send({ message: 'Proveedor no encontrado' });
    }
    res.send(proveedor);
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener el proveedor' });
  }
});
//Eliminar un proveedor
app.delete('/proveedor/:id', async (req, res) => {
  await Proveedor.findByIdAndDelete(req.params.id);
  res.send({ message: 'Proveedor eliminado' });
});
//FIN CONTROLLER PARA PROVEEDOR
//CONTROLLERS PARA CATEGORIAS
app.post('/categorias', async (req, res) => {
  console.log(req.body);
  const categoria = new Categoria(req.body);
  await categoria.save();
  res.send(categoria);
});

app.put('/categorias/:id', async (req, res) => {
  const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(categoria);
});

app.get('/categorias', async (req, res) => {
  const categorias = await Categoria.find();
  res.send(categorias);
});
//Visualizar una categoria por id 
app.get('/categorias/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).send({ message: 'Categoria no encontrada' });
    }
    res.send(categoria);
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener la categoria' });
  }
});

app.delete('/categorias/:id', async (req, res) => {
  await Categoria.findByIdAndDelete(req.params.id);
  res.send({ message: 'Categoria eliminada' });
});

// Crear una nueva categoría general
app.post('/categoriasgral', async (req, res) => {
  try {
    const { nombre, subCategorias } = req.body;
    const categoriaGral = new CategoriaGral({ nombre, subCategorias });
    await categoriaGral.save();
    res.status(201).send(categoriaGral);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Editar una categoría general por ID
app.put('/categoriasgral/:id', async (req, res) => {
  try {
    const { nombre, subCategorias } = req.body;
    const categoriaGral = await CategoriaGral.findByIdAndUpdate(
      req.params.id,
      { nombre, subCategorias },
      { new: true, runValidators: true }
    );
    if (!categoriaGral) {
      return res.status(404).send({ error: 'Categoría no encontrada' });
    }
    res.send(categoriaGral);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Eliminar una categoría general por ID
app.delete('/categoriasgral/:id', async (req, res) => {
  try {
    const categoriaGral = await CategoriaGral.findByIdAndDelete(req.params.id);
    if (!categoriaGral) {
      return res.status(404).send({ error: 'Categoría no encontrada' });
    }
    res.send({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Obtener todas las categorías generales
app.get('/categoriasgral', async (req, res) => {
  try {
    const categoriasGral = await CategoriaGral.find();
    res.send(categoriasGral);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Eliminar una categoría general por ID
app.delete('/imagenes/:id', async (req, res) => {
  try {
    const imagenesGral = await ImagenesGral.findByIdAndDelete(req.params.id);
    if (!imagenesGral) {
      return res.status(404).send({ error: 'Categoría no encontrada' });
    }
    res.send({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Ruta para crear un nuevo documento de ImagenesGral
app.get('/imagenes', async (req, res) => {
  try {
    const imagenesGral = await ImagenesGral.find(); // Crea una nueva instancia con los datos de la solicitud
    res.send(imagenesGral); // Envía el documento creado como respuesta
  } catch (error) {
    res.status(500).send({ error: error.message});
  }
});

// Ruta para crear un nuevo documento de ImagenesGral
app.post('/imagenes', async (req, res) => {
  try {
    const imagenesGral = new ImagenesGral(req.body); // Crea una nueva instancia con los datos de la solicitud
    await imagenesGral.save(); // Guarda el documento en la base de datos
    res.status(201).send(imagenesGral); // Envía el documento creado como respuesta
  } catch (error) {
    res.status(500).send({ message: 'Error al guardar ImagenesGral', error });
  }
});

// Ruta para mover un documento al final de la colección
app.put('/imagenes/move-to-end/:id', async (req, res) => {
  const { id } = req.params; // ID del documento ImagenesGral que deseas mover

  try {
    // Buscar el documento por _id
    const imagenesGral = await ImagenesGral.findById(id);

    if (!imagenesGral) {
      return res.status(404).send({ message: 'Documento no encontrado' });
    }

    // Remover el documento de la colección
    await ImagenesGral.deleteOne({ _id: id });

    // Crear un nuevo documento al final de la colección con el mismo contenido
    const newImagenesGral = new ImagenesGral(imagenesGral.toObject());
    await newImagenesGral.save();

    // Obtener la colección actualizada
    const updatedCollection = await ImagenesGral.find();

    res.status(200).send(updatedCollection); // Responder con la colección actualizada
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar ImagenesGral', error });
  }
});
// CONTROLLER FIN CATEGORIAS
// CONTROLLLER INICIO PRODUCTOS
// Crear un nuevo producto
app.post('/productos', async (req, res) => {
  const producto = new Producto(req.body);
  await producto.save();
  res.send(producto);
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.send(productos);
});
// Obtener un producto específico por su id
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.send(producto);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});
// Obtener el nombre de un producto específico por su id
app.get('/productos/:id/nombre', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.send(producto.nombreProducto);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// Actualizar un producto
app.put('/productos/:id', async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(producto);
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.send({ message: 'Producto eliminado' });
});

// Obtener un producto específico por su codigoBarra
app.get('/productos/codigo-barra/:codigoBarra', async (req, res) => {
  try {
    const producto = await Producto.findOne({ codigoBarra: req.params.codigoBarra });
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.send(producto);
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
});

// CONTROLLLER FIN PRODUCTOS
// CONTROLLER INICIO VENTAS 
// ======CREAR VENTAS==========
app.post('/ventas', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Crear una nueva venta
    const venta = new Venta(req.body);

    // Incrementar el contador y usar el valor actualizado como el número interno
    const contador = await Contador.findByIdAndUpdate({ _id: 'numeroFactura' }, { $inc: { seq: 1 } }, { new: true, upsert: true, session });
    venta.numeroInterno = contador.seq;

    // Generar el número de factura con el formato 001-001-0000001
    venta.numeroFactura = `001-001-${contador.seq.toString().padStart(7, '0')}`;

    // Inicializar los totales
    venta.PrecioVentaTotal = 0;
    venta.PrecioCostoTotal = 0;
    let iva10Total = 0;
    let iva5Total = 0;

    // Crear un nuevo array para los productos con los nombres y precios de venta incluidos
    let productosConNombresYPrecios = [];

    // Para cada producto vendido
    for (let item of req.body.productos) {
      // Buscar el producto
      const producto = await Producto.findById(item.producto);

      // Crear un nuevo objeto con el nombre del producto y el precio de venta incluidos
      let itemConNombreYPrecioVenta = { ...item, nombreProducto: producto.nombreProducto, precioVenta: producto.precioVenta };

      // Agregar el nuevo objeto al array
      productosConNombresYPrecios.push(itemConNombreYPrecioVenta);

      // Restar la cantidad vendida del stock actual
      producto.stockActual -= item.cantidad;

      // Actualizar los totales
      venta.PrecioVentaTotal += item.cantidad * producto.precioVenta;
      venta.PrecioCostoTotal += item.cantidad * producto.precioCompra;

      // Calcular el IVA
      if (producto.Iva === '10%') {
        iva10Total += item.cantidad * producto.precioVenta;
      } else if (producto.Iva === '5%') {
        iva5Total += item.cantidad * producto.precioVenta;
      }

      // Guardar el producto actualizado
      await producto.save({ session });
    }

    // Calcular las ganancias
    venta.Ganancias = venta.PrecioVentaTotal - venta.PrecioCostoTotal;

    // Calcular el IVA
    venta.Iva10 = iva10Total / 11;
    venta.Iva5 = iva5Total / 21;

    // Asignar el nuevo array a venta.productos
    venta.productos = productosConNombresYPrecios;
    // Guardar la venta
    await venta.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send(venta);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
// ======FIN CREAR VENTAS==========

//======CREAR VENTAS A CREDITO==========
// Endpoint para crear ventas a crédito
app.post('/ventas-credito', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Crear una nueva venta a crédito
    const ventaCredito = new VentaCredito(req.body);

    // Incrementar el contador y usar el valor actualizado como el número interno
    const contador = await Contador.findByIdAndUpdate({ _id: 'numeroFactura' }, { $inc: { seq: 1 } }, { new: true, upsert: true, session });
    ventaCredito.numeroInterno = contador.seq;

    // Generar el número de factura con el formato 001-001-0000001
    ventaCredito.numeroFactura = `001-001-${contador.seq.toString().padStart(7, '0')}`;

    // Inicializar los totales
    ventaCredito.PrecioVentaTotal = 0;
    ventaCredito.PrecioCostoTotal = 0;
    let iva10Total = 0;
    let iva5Total = 0;

    // Crear un nuevo array para los productos con los nombres y precios de venta incluidos
    let productosConNombresYPrecios = [];

    // Para cada producto vendido
    for (let item of req.body.productos) {
      // Buscar el producto
      const producto = await Producto.findById(item.producto);

      // Crear un nuevo objeto con el nombre del producto y el precio de venta incluidos
      let itemConNombreYPrecioVenta = { ...item, nombreProducto: producto.nombreProducto, precioVenta: producto.precioVenta };

      // Agregar el nuevo objeto al array
      productosConNombresYPrecios.push(itemConNombreYPrecioVenta);

      // Restar la cantidad vendida del stock actual
      producto.stockActual -= item.cantidad;

      // Actualizar los totales
      ventaCredito.PrecioVentaTotal += item.cantidad * producto.precioVenta;
      ventaCredito.PrecioCostoTotal += item.cantidad * producto.precioCompra;

      // Calcular el IVA
      if (producto.Iva === '10%') {
        iva10Total += item.cantidad * producto.precioVenta;
      } else if (producto.Iva === '5%') {
        iva5Total += item.cantidad * producto.precioVenta;
      }

      // Guardar el producto actualizado
      await producto.save({ session });
    }

    // Calcular las ganancias restando el monto pagado de las cuotas del PrecioVentaTotal
    ventaCredito.Ganancias = - ventaCredito.montoPagado - ventaCredito.PrecioCostoTotal;

    // Calcular el IVA
    ventaCredito.Iva10 = iva10Total / 11;
    ventaCredito.Iva5 = iva5Total / 21;

    // Asignar el nuevo array a ventaCredito.productos
    ventaCredito.productos = productosConNombresYPrecios;

    // Calcular el monto de la cuota, cuota inicial y cuota final basados en cantidadCuotas
    if (req.body.cantidadCuotas) {
      ventaCredito.cantidadCuotas = req.body.cantidadCuotas;
      ventaCredito.montoCuota = parseFloat((ventaCredito.PrecioVentaTotal / ventaCredito.cantidadCuotas).toFixed(2));
      ventaCredito.cuotainicial = 0;
      ventaCredito.cuotafinal = req.body.cantidadCuotas;
    }

    // Guardar la venta a crédito
    await ventaCredito.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send(ventaCredito);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
});
//======FIN CREAR VENTAS A CREDITO==========
//======INICIO PAGO CUOTA A CREDITO=======
app.put('/ventas-credito/:id/pago', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { montoPagado } = req.body;
    const ventaCredito = await VentaCredito.findById(req.params.id).session(session);

    if (!ventaCredito) {
      res.status(404).send({ error: 'Venta a crédito no encontrada' });
      return;
    }

    // Calcular el nuevo valor de la cuota inicial basado en el montoPagado
    const montoRestante = (ventaCredito.montoCuota * ventaCredito.cuotainicial) + montoPagado;
    const nuevaCuotainicial = Math.floor(montoRestante / ventaCredito.montoCuota);
    const restoMontoCuota = montoRestante % ventaCredito.montoCuota;

    // Variable para almacenar el cambio
    let cambio = 0;

    // Si la nueva cuota inicial es mayor o igual a la cuota final, calcular el cambio
    if (nuevaCuotainicial >= ventaCredito.cantidadCuotas) {
      const montoTotalCredito = ventaCredito.cantidadCuotas * ventaCredito.montoCuota;
      const montoPagadoTotal = ventaCredito.montoPagado + montoPagado;
      cambio = montoPagadoTotal - montoTotalCredito;

      // Calcular las ganancias restando el monto pagado de las cuotas del PrecioVentaTotal
      ventaCredito.Ganancias = ventaCredito.montoPagado - ventaCredito.PrecioCostoTotal;


      // Actualizar la cuota inicial y el monto pagado a los valores máximos permitidos
      ventaCredito.cuotainicial = ventaCredito.cantidadCuotas;
      ventaCredito.montoPagado = montoTotalCredito;

      // Crear un nuevo registro de pago de cuota
      const pagoCuota = new PagoCuota({
        ventaCredito: ventaCredito._id,
        montoPagado,
        estado: 'completado',
        cambio,
        totalpago: montoPagado - cambio // Calcular y asignar el valor de totalpago
      });

      await ventaCredito.save({ session });
      await pagoCuota.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.send({ message: `Crédito pagado en su totalidad. Su cambio es ${cambio}`, ventaCredito, pagoCuota });
      return;
    }

    // Actualizar la cuota inicial y el monto pagado
    ventaCredito.cuotainicial = nuevaCuotainicial + restoMontoCuota / ventaCredito.montoCuota;
    ventaCredito.montoPagado += montoPagado;

    // Calcular las ganancias restando el monto pagado de las cuotas del PrecioVentaTotal
    ventaCredito.Ganancias = ventaCredito.montoPagado - ventaCredito.PrecioCostoTotal;

    // Crear un nuevo registro de pago de cuota
    const pagoCuota = new PagoCuota({
      ventaCredito: ventaCredito._id,
      montoPagado,
      cambio,
      totalpago: montoPagado - cambio // Calcular y asignar el valor de totalpago
    });

    await ventaCredito.save({ session });
    await pagoCuota.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send({ ventaCredito, pagoCuota });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
});

//====FIN PAGO CUOTA DE VENTA CREDITO=======

//=====OBTENER TODAS LAS VENTAS A CRÉDITO=====
app.get('/ventas-credito', async (req, res) => {
  try {
    const ventasCredito = await VentaCredito.find();
    res.send(ventasCredito);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//====FIN OBTENER TODAS LAS VENTAS A CRÉDITO=====
app.get('/ventas-credito/total-ultimos-30-dias', async (req, res) => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const ventasCreditoAgrupadas = await VentaCredito.aggregate([
      {
        $match: {
          fechaVenta: { $gte: hace30Dias },
          estado: { $ne: "anulado" } // Excluye las ventas anuladas
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaVenta" } },
          totalVentaDia: { $sum: "$PrecioVentaTotal" },
          cantidadVentasDia: { $sum: 1 }, // Cuenta la cantidad de ventas por día
          totalGananciasDia: { $sum: "$Ganancias" } // Suma las ganancias por día
        }
      },
      {
        $sort: { "_id": 1 } // Ordena por fecha ascendente
      }
    ]);

    // Calcular el total de ventas de los últimos 30 días
    const totalVentas30 = ventasCreditoAgrupadas.reduce((acc, venta) => acc + venta.totalVentaDia, 0);

    // Calcular la cantidad total de ventas de los últimos 30 días
    const cantidadTotalVentas = ventasCreditoAgrupadas.reduce((acc, venta) => acc + venta.cantidadVentasDia, 0);

    // Calcular el total de ganancias de los últimos 30 días
    const totalGanancias30 = ventasCreditoAgrupadas.reduce((acc, venta) => acc + venta.totalGananciasDia, 0);

    // Transformar el array de ventas agrupadas en un objeto
    const ventasDiarias = ventasCreditoAgrupadas.reduce((acc, venta) => {
      acc[venta._id] = venta.totalVentaDia;
      return acc;
    }, {});

    res.json({
      totalVentas30,
      ventasDiarias,
      cantidadTotalVentas,
      totalGanancias30
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//=====ANULAR PAGO DE CUOTA DE VENTA CREDITO=====
app.put('/ventas-credito/:ventaId/anular-pago/:pagoId', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { ventaId, pagoId } = req.params;
    const ventaCredito = await VentaCredito.findById(ventaId).session(session);

    if (!ventaCredito) {
      res.status(404).send({ error: 'Venta a crédito no encontrada' });
      return;
    }

    const pagoCuota = await PagoCuota.findById(pagoId).session(session);

    if (!pagoCuota || pagoCuota.estado === 'anulado') {
      res.status(404).send({ error: 'Pago de cuota no encontrado o ya anulado' });
      return;
    }

    // Actualizar el estado del pago a 'anulado'
    pagoCuota.estado = 'anulado';
    await pagoCuota.save({ session });

    // Calcular el nuevo valor de la cuota inicial basado en el monto anulado
    const montoAnulado = pagoCuota.montoPagado;
    const montoRestante = (ventaCredito.montoCuota * ventaCredito.cuotainicial) - montoAnulado;
    const nuevaCuotainicial = Math.floor(montoRestante / ventaCredito.montoCuota);
    const restoMontoCuota = montoRestante % ventaCredito.montoCuota;

    // Actualizar la cuota inicial y el monto pagado
    ventaCredito.cuotainicial = nuevaCuotainicial + restoMontoCuota / ventaCredito.montoCuota;
    ventaCredito.montoPagado -= montoAnulado;

    await ventaCredito.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send({ ventaCredito, pagoCuota });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
});
//====FIN ANULAR PAGO DE CUOTA DE VENTA CREDITO=====
//=====OBTENER PAGO DE CUOTA POR SU ID=====
app.get('/pago-cuota/:pagoId', async (req, res) => {
  try {
    const { pagoId } = req.params;
    const pagoCuota = await PagoCuota.findById(pagoId);

    if (!pagoCuota) {
      res.status(404).send({ error: 'Pago de cuota no encontrado' });
      return;
    }

    res.send(pagoCuota);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//====FIN OBTENER PAGO DE CUOTA POR SU ID=====
//=====OBTENER TODOS LOS PAGOS DE CUOTAS=====
app.get('/pago-cuotas', async (req, res) => {
  try {
    const pagosCuotas = await PagoCuota.find();
    res.send(pagosCuotas);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//====FIN OBTENER TODOS LOS PAGOS DE CUOTAS=====
//====OBTENER TOTAL DE VENTAS REALIZADAS===========
// Obtener el monto total de las ventas del día
app.get('/ventas/total-del-dia', async (req, res) => {
  // Obtener la fecha actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Obtener la fecha del día siguiente
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  // Buscar todas las ventas realizadas hoy que no estén anuladas
  const ventas = await Venta.find({
    fechaVenta: {
      $gte: hoy,
      $lt: manana
    },
    estado: { $ne: 'anulado' } // Excluir ventas anuladas
  });

  // Sumar los totales de las ventas
  let total = 0;
  for (let venta of ventas) {
    total += venta.PrecioVentaTotal;
  }

  // Enviar el total
  res.send({ total });
});
//====ANULAR VENTAS===============
app.put('/ventas/anular/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Buscar la venta
    const venta = await Venta.findById(req.params.id);

    // Cambiar el estado de la venta a "anulado"
    venta.estado = 'anulado';

    // Para cada producto vendido
    for (let item of venta.productos) {
      // Buscar el producto
      const producto = await Producto.findById(item.producto);

      // Devolver la cantidad vendida al stock actual
      producto.stockActual += item.cantidad;

      // Guardar el producto actualizado
      await producto.save({ session });
    }

    // Guardar la venta actualizada
    await venta.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send({ message: 'Venta anulada', venta });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
//====FIN ANULAR VENTAS===============

// Obtener todas las ventas
app.get('/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find().populate('productos.producto');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener el total de PrecioVentaTotal de las ventas de los últimos 30 días excluyendo las anuladas,
// un resumen de las ventas diarias, la cantidad de ventas realizadas y las ganancias acumuladas.
app.get('/ventas/total-ultimos-30-dias', async (req, res) => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const ventasAgrupadas = await Venta.aggregate([
      {
        $match: {
          fechaVenta: { $gte: hace30Dias },
          estado: { $ne: "anulado" } // Excluye las ventas anuladas
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaVenta" } },
          totalVentaDia: { $sum: "$PrecioVentaTotal" },
          cantidadVentasDia: { $sum: 1 }, // Cuenta la cantidad de ventas por día
          totalGananciasDia: { $sum: "$Ganancias" } // Suma las ganancias por día
        }
      },
      {
        $sort: { "_id": 1 } // Ordena por fecha ascendente
      }
    ]);

    // Calcular el total de ventas de los últimos 30 días
    const totalVentas30 = ventasAgrupadas.reduce((acc, venta) => acc + venta.totalVentaDia, 0);

    // Calcular la cantidad total de ventas de los últimos 30 días
    const cantidadTotalVentas = ventasAgrupadas.reduce((acc, venta) => acc + venta.cantidadVentasDia, 0);

    // Calcular el total de ganancias de los últimos 30 días
    const totalGanancias30 = ventasAgrupadas.reduce((acc, venta) => acc + venta.totalGananciasDia, 0);

    // Transformar el array de ventas agrupadas en un objeto
    const ventasDiarias = ventasAgrupadas.reduce((acc, venta) => {
      acc[venta._id] = venta.totalVentaDia;
      return acc;
    }, {});

    res.json({
      totalVentas30,
      ventasDiarias,
      cantidadTotalVentas,
      totalGanancias30
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener la cantidad total de ventas realizadas excluyendo las anuladas.
app.get('/ventas/total-cantidad', async (req, res) => {
  try {
    const totalVentas = await Venta.countDocuments({
      estado: { $ne: "anulado" } // Excluye las ventas anuladas
    });

    res.json({ totalCantidadVentas: totalVentas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/ventas/total-ultimos-30-dias-combinado', async (req, res) => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    // Obtener las ventas al contado
    const ventasContadoAgrupadas = await Venta.aggregate([
      {
        $match: {
          fechaVenta: { $gte: hace30Dias },
          estado: { $ne: "anulado" }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaVenta" } },
          totalVentaDia: { $sum: "$PrecioVentaTotal" },
          cantidadVentasDia: { $sum: 1 },
          totalGananciasDia: { $sum: "$Ganancias" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Obtener las ventas a crédito
    const ventasCreditoAgrupadas = await VentaCredito.aggregate([
      {
        $match: {
          fechaVenta: { $gte: hace30Dias },
          estado: { $ne: "anulado" }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaVenta" } },
          totalVentaDia: { $sum: "$PrecioVentaTotal" },
          cantidadVentasDia: { $sum: 1 },
          totalGananciasDia: { $sum: "$Ganancias" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Combinar las ventas diarias
    const ventasDiarias = {};

    ventasContadoAgrupadas.forEach((venta) => {
      ventasDiarias[venta._id] = (ventasDiarias[venta._id] || 0) + venta.totalVentaDia;
    });

    ventasCreditoAgrupadas.forEach((venta) => {
      ventasDiarias[venta._id] = (ventasDiarias[venta._id] || 0) + venta.totalVentaDia;
    });

    // Calcular los totales combinados
    const totalVentas30Gral = Object.values(ventasDiarias).reduce((acc, totalVentaDia) => acc + totalVentaDia, 0);
    const cantidadTotalVentasGral = ventasContadoAgrupadas.reduce((acc, venta) => acc + venta.cantidadVentasDia, 0) + ventasCreditoAgrupadas.reduce((acc, venta) => acc + venta.cantidadVentasDia, 0);
    const totalGanancias30Gral = ventasContadoAgrupadas.reduce((acc, venta) => acc + venta.totalGananciasDia, 0) + ventasCreditoAgrupadas.reduce((acc, venta) => acc + venta.totalGananciasDia, 0);

    res.json({
      totalVentas30Gral,
      ventasDiarias,
      cantidadTotalVentasGral,
      totalGanancias30Gral
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Obtener la cantidad total de ventas realizadas excluyendo las anuladas.
app.get('/ventas-credito/total-cantidad', async (req, res) => {
  try {
    const totalVentas = await VentaCredito.countDocuments({
      estado: { $ne: "anulado" } // Excluye las ventas anuladas
    });

    res.json({ totalCantidadVentas: totalVentas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/ventas/total-cantidad-combinado', async (req, res) => {
  try {
    const totalVentasContado = await Venta.countDocuments({
      estado: { $ne: "anulado" } // Excluye las ventas anuladas
    });

    const totalVentasCredito = await VentaCredito.countDocuments({
      estado: { $ne: "anulado" } // Excluye las ventas anuladas
    });

    const totalCantidadVentasGral = totalVentasContado + totalVentasCredito;

    res.json({ totalCantidadVentasGral });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una venta
app.delete('/ventas/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Venta.findByIdAndDelete(req.params.id, { session });

    await Contador.findByIdAndUpdate({ _id: 'numeroInterno' }, { $inc: { seq: -1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.send({ message: 'Venta eliminada' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
// CONTROLLER FIN VENTAS
app.post('/compras', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const productos = req.body.productos;
    const proveedor = req.body.proveedor;
    const productosCompra = [];

    let precioCompraTotal = 0;

    for (let i = 0; i < productos.length; i++) {
      let producto;
      if (productos[i].productoId) {
        producto = await Producto.findById(productos[i].productoId);
      } else {
        producto = new Producto({
          nombre: productos[i].nombreProducto,
          descripcion: productos[i].descripcionProducto,
          categoria: productos[i].categoriaProducto,
          proveedor: proveedor,
          precioCompra: productos[i].precioCompra,
          precioVenta: productos[i].precioVenta || producto.precioVenta,
        });
      }

      producto.stockActual += productos[i].cantidad;
      producto.precioVenta = productos[i].precioVentaActualizado || producto.precioVenta;
      producto.precioCompra = productos[i].precioCompra;

      productosCompra.push({
        producto: producto._id,
        nombreProducto: producto.nombreProducto,
        cantidad: productos[i].cantidad,
        precioCompra: productos[i].precioCompra,
      });

      precioCompraTotal += productos[i].precioCompra * productos[i].cantidad;

      await producto.save({ session });
    }

    const compra = new Compra({
      proveedor: proveedor,
      producto: productosCompra,
      precioCompraTotal: precioCompraTotal,
      facturaNumero: req.body.facturaNumero,
      Telefono: req.body.Telefono,
      Direccion: req.body.Direccion
    });

    await compra.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send({ message: 'Compras realizadas', compra });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
// Obtener el monto total de las compras del día
app.get('/compras/total-del-dia', async (req, res) => {
  // Obtener la fecha actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Obtener la fecha del día siguiente
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  // Buscar todas las compras realizadas hoy
  const compras = await Compra.find({
    fecha: {
      $gte: hoy,
      $lt: manana
    }
  });

  // Sumar los totales de las compras
  let total = 0;
  for (let compra of compras) {
    total += compra.precioCompraTotal;
  }

  // Enviar el total
  res.send({ total });
});
app.delete('/compras/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) return res.status(404).send('La compra con el ID dado no fue encontrada.');

    // Iterar sobre todos los productos asociados a la compra
    for (let i = 0; i < compra.producto.length; i++) {
      // Buscar el producto
      const producto = await Producto.findById(compra.producto[i].producto);
      if (!producto) return res.status(404).send('El producto asociado a la compra no fue encontrado.');

      // Actualizar el stock del producto
      producto.stockActual -= compra.producto[i].cantidad;

      // Guardar el producto actualizado
      await producto.save({ session });
    }

    // Eliminar la compra
    await Compra.deleteOne({ _id: compra._id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.send(compra);
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Algo salió mal.');
  }
});
// Controlador para obtener todas las compras
app.get('/compras', async (req, res) => {
  try {
    const compras = await Compra.find();
    res.send(compras);
  }
  catch (error) {
    res.status(500).send('Algo salió mal.');
  }
});

// Controlador para editar una compra
app.put('/compras/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(
      req.params.id,
      {
        proveedor: req.body.proveedor,
        producto: req.body.producto,
        cantidad: req.body.cantidad,
        precioCompra: req.body.precioCompra,
        precioCompraTotal: req.body.precioCompra * req.body.cantidad,
        facturaNumero: req.body.facturaNumero,
        Telefono: req.body.Telefono,
        Direccion: req.body.Direccion
      },
      { new: true }
    );

    if (!compra) return res.status(404).send('La compra con el ID dado no fue encontrada.');
    res.send(compra);
  } catch (error) {
    res.status(500).send('Algo salió mal.');
  }
});

//==== Controladores para el cliente =====
// Crear datos de cliente
app.post('/datos-cliente', async (req, res) => {
  const datosCliente = new DatosCliente(req.body);
  await datosCliente.save();
  res.status(201).send(datosCliente);
});

// Editar datos de cliente por ID
app.put('/datos-cliente/:id', async (req, res) => {
  const datosCliente = await DatosCliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(datosCliente);
});

// Eliminar datos de cliente
app.delete('/datos-cliente/:id', async (req, res) => {
  const datosCliente = await DatosCliente.findByIdAndDelete(req.params.id);
  res.send(datosCliente);
});

// Obtener todos los datos de cliente
app.get('/datos-cliente', async (req, res) => {
  const datosCliente = await DatosCliente.find();
  res.send(datosCliente);
});

// Obtener el último dato de cliente cargado
app.get('/datos-cliente/ultimo', async (req, res) => {
  const datosCliente = await DatosCliente.findOne().sort({ _id: -1 });
  res.send(datosCliente);
});
//====== Controladores para datos de Empresas ========
// Crear datos de empresa
app.post('/datos-empresa', async (req, res) => {
  const datosEmpresa = new DatosEmpresa(req.body);
  await datosEmpresa.save();
  res.status(201).send(datosEmpresa);
});

// Editar datos de empresa por ID
app.put('/datos-empresa/:id', async (req, res) => {
  const datosEmpresa = await DatosEmpresa.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(datosEmpresa);
});

// Eliminar datos de empresa
app.delete('/datos-empresa/:id', async (req, res) => {
  const datosEmpresa = await DatosEmpresa.findByIdAndDelete(req.params.id);
  res.send(datosEmpresa);
});

// Obtener todos los datos de empresa
app.get('/datos-empresa', async (req, res) => {
  const datosEmpresa = await DatosEmpresa.find();
  res.send(datosEmpresa);
});

// Obtener el último dato de empresa cargado
app.get('/datos-empresa/ultimo', async (req, res) => {
  const datosEmpresa = await DatosEmpresa.findOne().sort({ _id: -1 });
  res.send(datosEmpresa);
});
process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled Rejection:', reason);
});
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});