'use client';

import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { FormEvent, isValidElement, useEffect, useState } from "react";

interface IMailAddProps {
    onAddEmail: (email: string) => void;
}

const MailAdd = ({ onAddEmail }: IMailAddProps) => {
    const [ email, setEmail ] = useState('');
    const [ emailValid, setEmailValid ] = useState(false);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

    useEffect(() => {
        setEmailValid(validateEmail(email));
    }, [email]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        onAddEmail(email);
        setEmail('');
    }

    return (
        <form onSubmit={onSubmit} >
            <FormGroup
                label="Укажите почту"
                labelFor="email-input"
                labelInfo="(обязательно)">
                <InputGroup id="email-input" placeholder="Email" type="email" value={email} onValueChange={setEmail} />
            </FormGroup>
            <Button type="submit" disabled={!emailValid}>Добавить почту</Button>
        </form>
    )
}

export default MailAdd;