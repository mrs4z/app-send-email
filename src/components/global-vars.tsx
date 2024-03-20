'use client';

import { Overlay, SwitchCard, Classes, Card, Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core"
import { useEffect, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { toast } from "react-toastify";

type GlobalVarsProps = {
    onSave: () => void;
};

export const GlobalVars: React.FC<GlobalVarsProps> = ({ onSave }) => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState('{}');

    useEffect(() => {
        const fetchData = async () => {
            fetch('/api/global-vars', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                  }
                  return response.json();
            })
            .then((data) => {
                setData(JSON.stringify(data, null, 2));
            })

        }

        if(show) {
            fetchData();
        }
    }, [show])

    const onSaveParams = () => {
        fetch('/api/global-vars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
            cache: 'no-store'
        })
        .then((response) => response.json())
        .then((res) => {
            if(!res.ok) {
                console.error('There has been a problem with your fetch operation:', res.error);
                toast(`${res.error}`, { autoClose: 2000, type: 'error', position: 'top-center' });
            } else {
                toast(`Успешно выполнено`, { autoClose: 2000, type: 'success', position: 'top-center' });
                setShow(false);
            }
            onSave()
        })
    }

    const toggleShow = () => {
        setShow(!show);
    }

    return (
        <>
        <Button onClick={() => setShow(true)}>Редактирование переменных</Button>
        <Dialog title="Редактирование переменных" isOpen={show} onClose={toggleShow}>
            <DialogBody>
                <Editor
                height="90vh"
                defaultLanguage="json"
                defaultValue="{}"
                value={data}
                onChange={(val: any) => setData(val)}/>
            </DialogBody>
            <DialogFooter>
                <Button type="submit" onClick={onSaveParams}>Сохранить</Button>
            </DialogFooter>
        </Dialog>
        </>
    )
}
