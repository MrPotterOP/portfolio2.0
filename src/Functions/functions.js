import { prisma } from '@/lib/prisma';

import { addCalendarEvent } from '@/lib/calenderService';


export const makeResponse = ({status, msg, error = null, data}) =>{
    return{
        status,
        msg,
        error,
        data
    }
}

export const FD_ScheduleMeet =  {
    name: 'schedule_meet',
    description: 'Schedule a meeting with Shubham. Returns a message with the meeting details. If details are missing or incomplete or vague, ask follow-ups in short, clear messages.',
    parameters: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                description: 'Email of the user',
            },
            agenda: {
                type: 'string',
                description: 'Agenda/topic/reason for the meeting.',
            },
            tnd: {
                type: 'string',
                description: 'Time and date of the meeting in Asia/Kolkata timezone. Please provide the date and time in this example format: 2025-09-25T13:00:00+05:30. Time should be from 10:00 to 20:00(10AM to 8PM) and Date should be in the future',
            },
            name: {
                type: 'string',
                description: 'Name of the user',
            },
        },
        required: ['email', 'agenda', 'tnd', 'name'],
    }
};

export const schedule_meet = async (args) => {
    const { email, agenda, tnd, name } = args;
    
    let missingFields = [];
    if (!email) missingFields.push('email');
    if (!agenda) missingFields.push('agenda');
    if (!tnd) missingFields.push('tnd');
    if (!name) missingFields.push('name');

    if (missingFields.length > 0) {
        return makeResponse({status: 400, msg: 'Missing fields', error: missingFields.join(', ')});
    }


    // Validation Errors
    let validationErrors = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        validationErrors.push(makeResponse({status: 400, msg: 'Please provide a valid email', error: 'User error. Email is invalid'}));
    }

    // Time validation - Example: 2025-09-25T13:00:00+05:30
    const timeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
    if (!timeRegex.test(tnd)) {
        validationErrors.push(makeResponse({status: 400, msg: 'Please provide a valid time', error: 'Model error. Time format should be like ex. - 2025-09-25T13:00:00+05:30 . Asis/Kolkata timezone'}));
    }
    // Time Should be from 10:00 to 20:00
    if (new Date(tnd).getHours() < 10 || new Date(tnd).getHours() > 20) {
        validationErrors.push(makeResponse({status: 400, msg: 'Time Occupied', error: 'User error. Meeting time should be from 10:00 to 20:00 (Indian Time 10AM to 8PM)'}));
    }

    // Date should be in the future
    if (new Date(tnd).getTime() < Date.now()) {
        validationErrors.push(makeResponse({status: 400, msg: 'Date Occupied', error: 'User error. Meeting date should be in the future'}));
    }

    // Agenda validation
    if (agenda.length > 100) {
        validationErrors.push(makeResponse({status: 400, msg: 'Agenda is too long', error: 'Model/User error. Agenda should be less than 100 characters'}));
    }

    // Name validation
    if (name.length > 100) {
        validationErrors.push(makeResponse({status: 400, msg: 'Name is too long', error: 'Model/User error. Name should be less than 100 characters'}));
    }

    if (validationErrors.length > 0) {
        return makeResponse({status: 400, msg: 'Validation Errors', error: validationErrors.map(e => e.error).join(', ')});
    }


    // Check Time Slot Availability


    // Create Meeting
    const response = await addCalendarEvent({email, agenda, tnd, name});
    return response;

};



export const toolRegistery = {
    schedule_meet: schedule_meet,
}

