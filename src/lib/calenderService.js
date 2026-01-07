import { CONSTANTS } from "@/app/config/CONSTANTS";
import { makeResponse } from "@/Functions/functions";
import { google } from "googleapis";



const authenticate = async () => {
    const auth = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT_URI
    )

      auth.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
      });

      const calendar = google.calendar({ version: 'v3', auth });
      if(!calendar) throw new Error('Calendar not found');

      return calendar;
};

export const addCalendarEvent = async ({email, agenda, tnd, name}) => {

    // Authenticate
    let calendar = null;
    try {
        calendar = await authenticate();
    }catch(e){
        console.error(e);
        return makeResponse({status: 500, msg: 'Service Down', error: 'System error. Authentication failed'});
    }
    
    // Event Config

    // Add 30 Mins to Tnd
    const date = new Date(tnd);
    date.setMinutes(date.getMinutes() + 30);
    const tnd30 = date.toISOString();

    const event = {
        summary: agenda,
        description: `Meeting with ${name}, for ${agenda}. Scheduled by ${CONSTANTS.ASSISTANT_NAME}`,
        location: "Online",
        start: {
            dateTime: tnd,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: tnd30,
            timeZone: 'Asia/Kolkata',
        },
        attendees: [
            {
                email: email,
            },
            {
                email: CONSTANTS.USER_EMAIL,
                organizer: true,
            }
        ],

        conferenceData: {
            createRequest: {
                requestId: `meet-unq-id-${Math.random().toString(36).substring(2)}`, 
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
            },
        },
    };

     try {
        // Create Event
        const createdEvent = await calendar.events.insert({
            calendarId: CONSTANTS.CALENDER_ID,
            resource: event,
            conferenceDataVersion: 1,
            sendNotifications: true,
            sendUpdates: 'all',
        });

        return makeResponse({status: 200, msg: 'Event Created', data: createdEvent});

     }catch(e){
         return makeResponse({status: 500, msg: 'Service Down', error: `System/Model error. Event creation failed. Error: ${JSON.stringify(e)}`});
     }
};