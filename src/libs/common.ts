export default function getDaysHoursMinsSecs(date1: any, date2: any) {
    // Calculate the difference in milliseconds
    const diffInMs = date2 - date1;

    // Convert milliseconds to seconds
    const diffInSeconds = Math.floor(diffInMs / 1000);

    // Convert seconds to minutes, hours, days
    var seconds: any = diffInSeconds % 60;
    var minutes: any = Math.floor((diffInSeconds % 3600) / 60);
    var hours: any = Math.floor((diffInSeconds % 86400) / 3600);
    var days: any = Math.floor(diffInSeconds / 86400);

    console.log(`Difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    days = days < 10 ? '0' + days : days;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    }
}

export function formatISODate(date: any) {
    //const date = new Date(isoString);

    // Array of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Extracting date components
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Construct the formatted date string
    return {
        monthName: monthName,
        day: day,
        year: year,
        hours: hours,
        formattedMinutes: formattedMinutes,
        ampm: ampm,
        fomattedDate: `${day} ${monthName}, ${year} ${hours}:${formattedMinutes} ${ampm}`,
        formatedDateOnly: `${day} ${monthName}, ${year}`
    }
    //return `${monthName} ${day}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
}


