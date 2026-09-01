"use client";

import { newId } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { TalentBooking } from "@/types";
import { useState } from "react";

const PERFORMANCE_TYPES = {
    //FILL THESE IN
}

export default function TalentBookingForm() {
    const { addBookingRequest } = useApp();
    const  [done, setDone ] = useState(false);
    const [checkedTypes, setCheckedTypes] = useState<Set<string>>(new Set());


    //add const handleTypeChange

    const handleTypeChange = (type: string) => {
        setCheckedTypes((prev) => {
            const next = new Set(prev);
            if(next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };





    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get("lastName") as string;
        const company = formData.get("company") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const estimatedBudget = formData.get("estimatedBudget") as string;
        const additionalNotes = formData.get("additionalNotes") as string;

        // handle form submission logic here
        const booking: TalentBooking = {
            id: newId("booking"),
            type: "talent",
            firstName: formData.get("firstName")as string,
            lastName: formData.get("lastName") as string,
            company: formData.get("company") as string,
            email: formData.get("email") as string,
            phoneNumber: parseInt(formData.get("phoneNumber") as string, 10),
            estimatedBudget: parseFloat(formData.get("estimatedBudget") as string),
            performanceType: Array.from(checkedTypes),
            additionalNotes: formData.get("additionalNotes") as string,
        };
        // handle form submission logic here
        addBookingRequest(booking);
        setDone(true);
    };




    return (
    <div className="glass">
        <p className="font">Talent Booking Form</p>
        <p className="mt-2">Please fill out the form below to book talent.</p>
    </div>
    );
}