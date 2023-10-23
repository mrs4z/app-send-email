'use client';

import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";

interface IMailSelectorProps {
    emailSelected: string | number | undefined;
    emails: string[];
    onEmailSelected: (email: string) => void;
}

const MailSelector = ({ emailSelected, emails, onEmailSelected }: IMailSelectorProps) => {
    const onChange = (email: FormEvent<HTMLInputElement>) => {
        onEmailSelected(email.currentTarget.value);
    }

    return (
        <RadioGroup onChange={onChange} inline selectedValue={emailSelected}>
            { emails && emails.map((email: string, index: number) => (
                <Radio label={email} value={email} key={index} />
            )) }
        </RadioGroup>
    )
}

export default MailSelector;