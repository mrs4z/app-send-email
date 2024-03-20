'use client';

import { EmailTemplate } from "@/components/email-template";
import { FormGroup, InputGroup, Button, Divider } from "@blueprintjs/core";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import useLocalStorage from "./hooks/useLocalStorage";
import MailAdd from "@/components/mail-add";
import MailSelector from "@/components/mail-selector";
import { GlobalVars } from '@/components/global-vars';

export default function Home() {
  const [activeItemStorage, setActiveItemStorage] = useLocalStorage("activeItem", null);
  const [emailStorage, setEmailStorage] = useLocalStorage("email", "");
  const [emailListStorage, setEmailListStorage] = useLocalStorage("emailList", []);

  const [emails, setEmails] = useState([]);
  const [activeItem, setActiveItem] = useState(activeItemStorage);
  const [email, setEmail] = useState(emailStorage);
  const [emailsList, setEmailsList] = useState<string[]>(emailListStorage);
  const [valueState, setValueState] = useState<string>('');

  // validation
  const [isValidItem, setIsValidItem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupVars = async () => {
      const response = await fetch('/api/setup', { cache: 'no-store' });
      const data = await response.json();
      return data;
    }

    setValueState('Проверяем, все ли глобальные переменные записаны.')
    setupVars()
      .then((data) => {
        setValueState('Начинаю загрузку шаблонов для отправки.')
        fetchData()
          .then(() => {
            setValueState('')
          });
      })
  }, []);

  const fetchData = async () => {
    setEmails([]);
    const response = await fetch('/api/all-files', { cache: 'no-store' });
    const data = await response.json();
    setEmails(data);
    return data;
  }

  const onSend = async () => {
    setIsLoading(true);
    fetch('/api/send-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        template: activeItem
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      toast('Письмо отправлено', { autoClose: 2000, type: 'success', position: 'top-center' });
    })

    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      toast(`${error}`, { autoClose: 2000, type: 'error', position: 'top-center' });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const onChangeItem = (e: any) => {
    setActiveItem(e);
    setActiveItemStorage(e);
  }

  useEffect(() => {
    setIsValidItem(!!activeItem);
  }, [activeItem]);

  const onAddEmail = (emailItem: string) => {
    if (!emailsList.includes(emailItem)) {
      setEmailsList([...emailsList, emailItem]);
      setEmailListStorage([...emailsList, emailItem]);
      if(!email) onEmailSelect(emailItem);
    } else {
      toast('Почта уже добавлена', { autoClose: 2000, type: 'error', position: 'top-center' });
    }
  }

  const onEmailSelect = (email: string) => {
    setEmail(email);
    setEmailStorage(email);
  }


  return (
    <div className="form__added">
      <div>
        <GlobalVars onSave={fetchData} />
      </div>
      <div>
        <MailAdd onAddEmail={onAddEmail} />
      </div>
      <Divider />
      {valueState && <div>{valueState}</div>}
      <div>
        <MailSelector emailSelected={email} emails={emailsList} onEmailSelected={onEmailSelect} />
      </div>
      <form>
        <FormGroup
          label="Выберите шаблон"
          labelInfo="(обязательно)"
        >
          <div>
            {emails.map((email, index) => (
              <EmailTemplate  activeItem={activeItem} key={index} email={email} onChange={(e: any) => onChangeItem(e)} />
              )
              )}
          </div>
        </FormGroup>
        <Button onClick={onSend} disabled={!isValidItem || !email} loading={isLoading}>Отправить</Button>
      </form>
    </div>
  )
}
