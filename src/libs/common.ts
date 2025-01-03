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

    //console.log(`Difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
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

export function getCurrentDateTime(timeZone: string): string {
   const now = new Date();
    
   const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
   });

   const formatted = formatter.format(now);

   const [date, time] = formatted.split(', ');
   const [day, month, year] = date.split('/');

   return `${year}-${month}-${day} ${time}`;
}

export function formatDateOnly(dateString: string): string {
   const date = new Date(dateString);
 
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
 
   return `${day}-${month}-${year}`;
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

    if(schedule === 'till_date') {
        start_date = new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }

    return {
        start_date,
        end_date
    }
}

export function getGraphResult(records: any, start_date: any, end_date: any, schedule: any) {
    var data_sales = [];
    var user_ids: any = [];
    var total_sales: any = 0
    for(var i = 0; i < records.length; i++) {
        let date = new Date(records[i].invoice_date);
        let timezoneOffset = date.getTimezoneOffset();
        let pstOffset = -300; // this is the offset for the Pacific Standard Time timezone
        let adjustedTime = new Date(date.getTime() + (pstOffset + timezoneOffset) * 60 * 1000);

        data_sales.push({
            user_id: records[i].user_id,
            date: new Date(records[i].invoice_date).toISOString().slice(0, 10),
            amount: records[i].total_amount,
            time: getTime(new Date(records[i].invoice_date))
        })

        var user_id = records[i].user_id.toString()

        if(user_ids.indexOf(user_id) === -1) {
            user_ids.push(user_id)
        }
        total_sales += records[i].total_amount
    }

    var dates: any = getDaysArray(start_date, end_date)

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthday = ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var data: any = [];
    var orders_data: any = [];

    var daily_data = [
        {
            "day": "8-10 AM",
            "sales": 0
        },
        {
            "day": "10-12 AM",
            "sales": 0
        },
        {
            "day": "12-2 PM",
            "sales": 0
        },
        {
            "day": "2-4 PM",
            "sales": 0
        },
        {
            "day": "4-6 PM",
            "sales": 0
        },
        {
            "day": "6-8 PM",
            "sales": 0
        },
        {
            "day": "8-10 PM",
            "sales": 0
        },
        {
            "day": "10-12 PM",
            "sales": 0
        }
    ]
    var daily_order_data = daily_data
    var total_daily_sales: any = 0
    var daily_user_ids: any = []




    if(schedule === 'daily') {
        var today = new Date().toISOString().slice(0, 10)
        for(var i = 0; i < data_sales.length; i++) {
            if(data_sales[i].date === today) {

                console.log('time: ', data_sales[i].time)
                var time = data_sales[i].time
                var time_split = time.split(':')
                var time_int = parseInt(time_split[0])
                var time_matched = false;

                if(time.includes('AM')) {
                    if(time_int >= 8 && time_int < 10) {
                        daily_data[0].sales += data_sales[i].amount - 1
                        daily_order_data[0].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 10 && time_int < 12) {
                        daily_data[1].sales += data_sales[i].amount - 1
                        daily_order_data[1].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }
                } else if(time.includes('PM')) {

                    if(time_int >= 12 && time_int < 2) {
                        daily_data[2].sales += data_sales[i].amount - 1
                        daily_order_data[2].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 2 && time_int < 4) {
                        daily_data[3].sales += data_sales[i].amount - 1
                        daily_order_data[3].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 4 && time_int < 6) {
                        daily_data[4].sales += data_sales[i].amount - 1
                        daily_order_data[4].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 6 && time_int < 8) {
                        daily_data[5].sales += data_sales[i].amount - 1
                        daily_order_data[5].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 8 && time_int < 10) {
                        daily_data[6].sales += data_sales[i].amount - 1
                        daily_order_data[6].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_int >= 10 && time_int < 12) {
                        daily_data[7].sales += data_sales[i].amount - 1
                        daily_order_data[7].sales ++
                        total_daily_sales += data_sales[i].amount
                        time_matched = true
                    }

                    if(time_matched = true) {
                        var user_id = data_sales[i].user_id.toString()
                        if(daily_user_ids.indexOf(user_id) === -1) {
                            daily_user_ids.push(user_id)
                        }
                    }
                    
                }
            }
        
        }

        data = daily_data
        orders_data = daily_order_data
        total_sales = total_daily_sales
        user_ids = daily_user_ids
    } else {

        for(var i = 0; i < dates.length; i++) {
            if(schedule === 'monthly') {
                var day_name: any = i + 1
            }
            
            if(schedule === 'weekly') {
                day_name = weekday[new Date(dates[i]).getDay()].toUpperCase().substring(0, 3)
            }

            if(schedule === 'till_date') {
                day_name = monthday[new Date(dates[i]).getMonth()].toUpperCase()//.substring(0, 3)
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

    }
    return {
        data: data,
        orders_data: orders_data,
        total_users: user_ids.length,
        total_sales: total_sales,
        data_sales: data_sales
    };
}

const getDaysArray = function(start: any, end: any) {
    const arr = [];
    for(const dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt).toISOString().slice(0, 10));
    }
    return arr;
};

function getTime(date: any) {
    return date.toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: 'numeric', hour12: true })
}

export var total_records_limit = 1000


