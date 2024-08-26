import React from 'react';

interface SelectIVAProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectIVA: React.FC<SelectIVAProps> = ({ id, label, value, onChange }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <select
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                id={id}
                value={value}
                onChange={onChange}
            >
                <option value="5%">5%</option>
                <option value="10%">10%</option>

            </select>
        </div>
    );
}

export default SelectIVA;