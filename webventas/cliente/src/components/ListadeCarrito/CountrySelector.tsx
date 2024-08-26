import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAddressStore } from './useAddressStore';
import countryList from 'react-select-country-list';
import { useState } from 'react';

const CountrySelector = ({ onConfirm }: { onConfirm: () => void }) => {
  const [value, setValue] = useState<any>(null);  // Esto controla lo que se muestra en el Select
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [apto, setApto] = useState('');
  const [calle, setCalle] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigpostal, setCodigoPostal] = useState('');
  const setAddressData = useAddressStore((state) => state.setAddressData);
  const options = countryList().getData();

  const handleChange = (selectedOption: any) => {
    setValue(selectedOption);  // Actualiza el estado del Select para mostrar la selección
  };

  const handleChangePhone = (value: any) => {
    console.log("Datos de telefono", value);
    setPhone(value);
    console.log("PrimerNombre", firstName);
  };  

  const handleChangeData = () => {
    const newData = ([firstName,phone, apto, calle, provincia, ciudad, codigpostal, value!.label]);
    setAddressData(newData)
    onConfirm();
  }

  const styleInput = "border rounded-lg h-[40px] text-sm pl-2";
  const styleButton = "rounded-full bg-blue-400 text-white hover:scale-105 mb-3 mt-3";
  const styleButton2 = "rounded-full bg-green-500 text-white hover:scale-105 mb-3 mt-3";

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1'>
        <h2 className="font-bold text-base">País/Región</h2>
        <Select
          className='w-[180px] text-sm'
          options={options}
          value={value}  // Aquí el estado que se muestra
          onChange={handleChange}  // Maneja el cambio para actualizar el valor mostrado
        />
      </div>
      <div className='flex flex-col'>
        <h2 className="font-bold text-base mb-2">Información personal</h2>
        <div className='flex flex-row justify-between gap-3'>
          <div className='flex flex-col'>
            <input
              className={styleInput}
              type="text"
              onChange={(e) => { setFirstName(e.target.value); }}
              placeholder='Nombre de contacto'
            />
            <p className='text-gray-400 text-xs'>Por favor introduce un nombre de contacto</p>
          </div>
          <PhoneInput
            country={'us'} // Puedes establecer un país por defecto
            value={phone}
            placeholder='Teléfono de contacto'
            onChange={handleChangePhone}
            containerStyle={{ width: '100%' }}
            buttonStyle={{ height: '35px' }}
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <p className="font-bold text-base mb-2">Dirección</p>
        <div className='flex flex-row gap-3'>
          <input className={styleInput} type="text" onChange={(e)=>{setCalle(e.target.value)}} placeholder='Calle, casa/apartamento' />
          <input className={styleInput} type="text" onChange={(e)=>{setApto(e.target.value)}} placeholder='Apto., suite, unidad, etc. (opcional)' />
        </div>
        <div className='flex flex-row gap-3 mt-3 mb-3'>
          <input className={styleInput} type="text" onChange={(e)=>{setProvincia(e.target.value)}} placeholder='Provincia' />
          <input className={styleInput} type="text" onChange={(e)=>{setCiudad(e.target.value)}} placeholder='Ciudad' />
          <input className={styleInput} type="text" onChange={(e)=>{setCodigoPostal(e.target.value)}} placeholder='Código postal' />
        </div>
      </div>
      <div className='flex flex-row gap-3 mb-3'>
        <input type="checkbox" className='w-[15px] mt-1'/>
        <p>Establecer como dirección de envío predeterminada</p>
      </div>
      <div className='flex flex-row gap-4 justify-center'>
        <button onClick={handleChangeData} className={styleButton}>
          Confirmar
        </button>
        <button className={styleButton2}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CountrySelector;
