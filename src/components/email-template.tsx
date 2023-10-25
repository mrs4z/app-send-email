import { Overlay, SwitchCard, Classes, Card, Dialog, DialogBody } from "@blueprintjs/core"
import { useEffect, useState } from "react";
import Image from 'next/image'

interface IProps {
    email: string;
    activeItem: string | null;
    onChange: (email: string | null) => void;
}

export const EmailTemplate = ({ email, activeItem, onChange }: IProps) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isShowPreview, setIsShowPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`/api/screens/${email}`, { cache: 'no-store' });
          const blob = await response.blob();
            const objectURL: any = URL.createObjectURL(blob);
            setImageSrc(objectURL);
        }
    
        fetchData();
    
      }, []);
    
    const togglePreview = () => {
        setIsShowPreview(!isShowPreview);
    
    }

    const onChangeItem = () => {
        if(activeItem === email) {
            onChange(null);
        } else {
            onChange(email);
        }
    }

    return (
        <>
            <SwitchCard checked={activeItem === email} onChange={onChangeItem}>
                <div className="email-label">
                    <div onClick={togglePreview}>{imageSrc ? <Image src={imageSrc} width={25} height={25} alt='' /> : 'Load...'}</div>
                    <div>{email}</div>
                </div>
            </SwitchCard>
            <Dialog title="Просмотр миниатюры" isOpen={isShowPreview} onClose={togglePreview}>
                <DialogBody>
                {imageSrc ? <Image src={imageSrc} width={500} height={500} alt='' /> : 'Load...'}
                </DialogBody>
            </Dialog>
        </>
    )
}