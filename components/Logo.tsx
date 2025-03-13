import React from 'react';
import Image from 'next/image';
import SparkLogo from '../public/images/logo.jpg';



export default function Logo() {
    return (
        <Image src={ SparkLogo } alt="Logo" className='logo img-fluid' />
    );
  }
  