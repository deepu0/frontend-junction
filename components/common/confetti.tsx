import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Success = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const message = 'Thank you for contributing to the community!';

  // Close modal and redirect after 40 seconds
  setTimeout(() => {
    setShowModal(false);
    router.push('/');
  }, 7000);

  return (
    <>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h1>{message}</h1>
      <p> Your submission will be reviewed and will be live soon.</p>
    </>
  );
};

export default Success;
