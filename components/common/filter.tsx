import React, { useState } from 'react';

type Option = {
  value: string;
  label: string;
};
interface Company {
  value: string;
  label: string;
  logo: string;
}

interface Role {
  value: string;
  label: string;
}

const companies: Company[] = [
  {
    value: 'company1',
    label: 'Company 1',
    logo: 'https://example.com/company1-logo.png',
  },
  {
    value: 'company2',
    label: 'Company 2',
    logo: 'https://example.com/company2-logo.png',
  },
  {
    value: 'company3',
    label: 'Company 3',
    logo: 'https://example.com/company3-logo.png',
  },
];

const roles: Role[] = [
  {
    value: 'softwareEngineer',
    label: 'Software Engineer',
  },
  {
    value: 'productManager',
    label: 'Product Manager',
  },
  {
    value: 'designer',
    label: 'Designer',
  },
  {
    value: 'dataScientist',
    label: 'Data Scientist',
  },
];

type FilterProps = {
  searchText: string;
  companies?: Company[];
  roles?: Role[];
  onFilterChange: (filter: {
    searchText: string;
    company?: string;
    role?: string;
  }) => void;
};

const Filter: React.FC<FilterProps> = ({
  searchText,
  //companies,
  //roles,
  onFilterChange,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchText: event.target.value });
  };

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ company: event.target.value });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ role: event.target.value });
  };

  return (
    <div className='flex flex-col md:flex-row items-center md:items-start justify-between space-y-4 md:space-y-0 gap-4 m-4'>
      <input
        type='text'
        placeholder='Search...'
        value={searchText}
        onChange={handleSearchChange}
        className='border border-gray-300 rounded-lg py-2 px-4 w-full md:w-auto focus:outline-none focus:ring focus:border-blue-500 transition duration-200 ease-in-out'
      />
      <select
        value={''}
        onChange={handleCompanyChange}
        className='border border-gray-300 rounded-lg py-2 px-4 w-full md:w-auto focus:outline-none focus:ring focus:border-blue-500 transition duration-200 ease-in-out'
      >
        <option value=''>All Companies</option>
        {companies.map((company) => (
          <option key={company.value} value={company.value}>
            {company.label}
          </option>
        ))}
      </select>
      <select
        value={''}
        onChange={handleRoleChange}
        className='border border-gray-300 rounded-lg py-2 px-4 w-full md:w-auto focus:outline-none focus:ring focus:border-blue-500 transition duration-200 ease-in-out'
      >
        <option value=''>All Roles</option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
