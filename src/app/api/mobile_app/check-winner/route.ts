import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
import Invoice from "@/models/InvoiceModel";
import Winner from "@/models/WinnerModel";

export async function GET(request: any) {
    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var invoice_number = searchparams.get('invoice_number') + ''; 
        var invoice = await Invoice.find({invoice_number: invoice_number}).select(['_id']).limit(1)
        console.log('invoice: ', invoice[0]._id)
        if(invoice && invoice.length > 0) {

            const winner = await Winner
            .aggregate([
                {
                    $match:
                    {
                        invoice_id: invoice[0]._id   
                    }
                },
                {
                    $lookup: {
                        from: 'prizes',
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "winnerWithPrize",
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        localField: "game_id",
                        foreignField: "_id",
                        as: "winnerWithPrize",
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: "user_id",
                        foreignField: "_id",
                        as: "winnerWithUser",
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: "product_id",
                        foreignField: "_id",
                        as: "winnerWithProduct",
                    }
                }
            ]).sort({'winning_date': -1}).limit(1);

            if(winner && winner.length > 0) {
                return NextResponse.json({
                    messge: "query success ....",
                    winner: winner
                  }, {status: 200});
            } else {
                return NextResponse.json({
                    messge: "winner not found",
                    winner: []
                  }, {status: 200});
            }
        } else {
            return NextResponse.json({
                messge: "winner not found",
                winner: []
              }, {status: 500});
        }
        

    } catch (error) {
        return NextResponse.json({
            messge: "query error ....",
            error: JSON.stringify(error)
          }, {status: 500});
    }
}