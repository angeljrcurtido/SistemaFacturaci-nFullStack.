import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';

interface Imagenes {
  _id: string;
  imagensuperior: string[];
  stylebotonesdebajo: string[];
}

const ConfigWeb = () => {
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [color1, setColor1] = useState<string>('#ffffff');
  const [color2, setColor2] = useState<string>('#ffffff');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/imagenes');
        setImagenes(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        try {
          await axios.post('http://localhost:3001/imagenes', {
            imagensuperior: [base64String],
            stylebotonesdebajo: [color1, color2],
          });

          // Fetch and update the list of images after uploading
          const response = await axios.get('http://localhost:3001/imagenes');
          setImagenes(response.data);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleMoveToEnd = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/imagenes/move-to-end/${id}`);
      setImagenes(response.data); // Update the images list with the new order
    } catch (error) {
      console.error('Error moving image to end:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Levantar y mostrar imágenes</h1>
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold">Seleccionar Colores para los Botones</h2>
        <div className="flex flex-row gap-5">
          <div>
            <label className="font-semibold">Color del Botón 1:</label>
            <SketchPicker
              color={color1}
              onChangeComplete={(color) => setColor1(color.hex)}
            />
            <div className="mt-2 w-full h-10" style={{ backgroundColor: color1 }} />
          </div>

          <div>
            <label className="font-semibold">Color del Botón 2:</label>
            <SketchPicker
              color={color2}
              onChangeComplete={(color) => setColor2(color.hex)}
            />
            <div className="mt-2 w-full h-10" style={{ backgroundColor: color2 }} />
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colores</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {imagenes.map((image, index) => (
            <tr key={image._id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={image.imagensuperior[0]} alt={`Uploaded ${index}`} className="w-24 h-24 object-cover" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  {image.stylebotonesdebajo.map((color, i) => (
                    <div key={i} className="w-8 h-8" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleMoveToEnd(image._id)}
                  className="text-green-600 hover:text-green-900"
                >
                  Mover al Final
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfigWeb;
