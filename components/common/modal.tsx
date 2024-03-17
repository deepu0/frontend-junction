import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen'>
        <div
          className='fixed inset-0 bg-black opacity-50'
          onClick={onClose}
          aria-hidden='true'
        ></div>
        <div className='relative bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6'>
          <div className='absolute top-0 right-0 p-2'>
            <button
              className='text-gray-400 hover:text-gray-200'
              onClick={onClose}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='p-6'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
