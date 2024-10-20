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

export function formatDate(dateString: string): string {
   const date = new Date(dateString);
   const options: Intl.DateTimeFormatOptions = {
     year: 'numeric',
     month: '2-digit',
     day: '2-digit',
     hour: 'numeric',
     minute: '2-digit',
     hour12: true,
   };
 
   const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
   return formattedDate.replace(',', ''); // Remove the comma for formatting
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

export function getGraphResult(records: any, start_date: any, end_date: any, schedule: any) {
    var data_sales = [];
    var user_ids: any = [];
    var total_sales: any = 0
    for(var i = 0; i < records.length; i++) {
        data_sales.push({
            user_id: records[i].user_id,
            date: new Date(records[i].invoice_date).toISOString().slice(0, 10),
            amount: records[i].total_amount
        })

        var user_id = records[i].user_id.toString()

        if(user_ids.indexOf(user_id) === -1) {
            user_ids.push(user_id)
        }
        total_sales += records[i].total_amount
    }

    var dates: any = getDaysArray(start_date, end_date)

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var data: any = [];
    var orders_data: any = [];

    for(var i = 0; i < dates.length; i++) {
        var day_name: any = i + 1
        if(schedule === 'weekly') {
            day_name = weekday[new Date(dates[i]).getDay()].toUpperCase().substring(0, 3)
        }

        data.push({
            sales: 0,
            day: day_name
        })

        orders_data.push({
            sales: 0,
            day: day_name
        })
    }

    for(var i = 0; i < dates.length; i++) {
        for(var j = 0; j < data_sales.length; j++) {
            if(data_sales[j].date === dates[i]) {
                data[i].sales += data_sales[j].amount
                orders_data[i].sales++
            }
        }
    }
    return {
        data: data,
        orders_data: orders_data,
        total_users: user_ids.length,
        total_sales: total_sales
    };
}

export function getStartEndDates(schedule: any) {
    
    var start_date = new Date().toISOString().slice(0, 10)
    var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var end_date = tomorrowDate.toISOString().slice(0, 10);

    if(schedule === 'weekly') {
        start_date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }

    if(schedule === 'monthly') {
        start_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }

    return {
        start_date,
        end_date
    }
}

const getDaysArray = function(start: any, end: any) {
    const arr = [];
    for(const dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt).toISOString().slice(0, 10));
    }
    return arr;
};


