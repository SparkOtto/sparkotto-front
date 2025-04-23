import React from 'react';
import Image from 'next/image';
import SparkLogo from '../public/images/logo.svg';



export default function Logo() {
    return (
        <Image src={ SparkLogo } alt="Logo" priority={true} className='logo img-fluid' />
    );
  }
  