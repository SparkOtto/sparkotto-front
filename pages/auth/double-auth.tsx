import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import DoubleAuth from '../../components/DoubleAuth';

export default function DAuth() {
    return (
        <>
            <AuthLayout>
                <DoubleAuth />
            </AuthLayout>
        </>
    )
  }