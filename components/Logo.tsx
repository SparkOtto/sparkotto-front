import React from 'react';
import Image from 'next/image';
import SparkLogo from '../public/images/logo.svg';

const Logo = React.memo(function Logo() {
    return (
        <Image src={SparkLogo} alt="Logo" priority={true} className='logo img-fluid' />
    );
});

export default Logo;
