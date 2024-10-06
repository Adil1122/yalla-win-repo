import { NextResponse } from "next/server";

export async function GET(request: any) {

    var monthly: any = {};
    for(var i = 1; i <= 30; i++) {
        monthly['Day ' + i] = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    }

    try {
        var data = 
    {
      "status": "success",
      "data": {
        "daily_report": [
          {
            "time_period": "8-10 AM",
            "sales": 3
          },
          {
            "time_period": "10-12 AM",
            "sales": 4
          },
          {
            "time_period": "12-2 PM",
            "sales": 2
          },
          {
            "time_period": "2-4 PM",
            "sales": 5
          },
          {
            "time_period": "4-6 PM",
            "sales": 4
          },
          {
            "time_period": "6-8 PM",
            "sales": 2
          }
        ],

        "weekly_report": [
            {
                "MON": 4,
                "TUE": 10,
                "WED": 2,
                "THU": 5,
                "FRI": 7,
                "SAT": 3,
                "SUN": 10,
            }
        ],

        "sales_till_today": [
            {
                "JAN": 4,
                "FEB": 10,
                "MAR": 2,
                "APR": 5,
                "MAY": 7,
                "JUN": 3,
                "JUL": 10,
                "AUG": 11,
                "SEP": 4
            }
        ],

        "monthly_report": [
            monthly
        ]
      }
    }
    return NextResponse.json({
        messge: "query success ....",
        data: data
      }, {status: 200});

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
          }, {status: 500});
    }
    
}