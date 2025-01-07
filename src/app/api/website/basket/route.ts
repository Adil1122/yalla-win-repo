import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongoosdb";
// @ts-ignore
import Basket from "@/models/BasketModel";
import mongoose from "mongoose";
import Draw from "@/models/DrawModel";
import Product from "@/models/ProductModel";

export async function GET(request: NextRequest) {

    try {
        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var user_id = searchparams.get('user_id') + '';
        const products_in_basket = await Basket
              .aggregate([
                  {
                      $match: { user_id: new mongoose.Types.ObjectId(user_id)  },
                  },
                  {
                      $lookup: {
                          from: "products",
                          localField: "product_id",
                          foreignField: "_id",
                          as: "productInBasket",
                      },
                  },
                  {
                    $lookup: {
                        from: "prizes",
                        localField: "prize_id",
                        foreignField: "_id",
                        as: "prizeInBasket",
                    },
                }
              ]).sort({'createdAt': -1}).limit(100);

              //console.log('here: ', products_in_basket)

              if(products_in_basket && products_in_basket.length > 0) {
                var product_ids = [];
                for (var i = 0; i < products_in_basket.length; i++) {
                    if(products_in_basket[i].productInBasket.length > 0) {
                      product_ids.push(new mongoose.Types.ObjectId(products_in_basket[i].productInBasket[0]._id + ''));
                    }
                }
                console.log('draw found ...')

                var draws = await Draw.find({product_id: {$in: product_ids}});
                if(draws && draws.length > 0) {
                  return NextResponse.json({
                    message: "query successful ....",
                    result: products_in_basket,
                    product_ids: product_ids,
                    draws: draws
                  }, {status: 200});
                } else {
                  return NextResponse.json({
                    message: "No draw found ....",
                  }, {status: 500});
                }
            } else {
              return NextResponse.json({
                message: "basket is empty ....",
              }, {status: 500});
            }
      } catch (error) {
          return NextResponse.json({
            message: "error query ....",
            error: JSON.stringify(error)
          }, {status: 500});
      }
  }

export async function POST(request: NextRequest) {

  try {
    await connectMongoDB();
    let {
        product_id, 
        user_id,
        quantity
    } = await request.json();

    return NextResponse.json({
      message: "successful query ....",
      product_id: product_id,
      user_id: user_id,
      quantity: quantity
    }, {status: 200});

    var product = await Product.findOne({_id: product_id}).select(['_id', 'prize_id']);


    let basketDocument = {
        product_id: product_id, 
        user_id: user_id, 
        quantity: quantity,
        prize_id: product.prize_id
    }

    let basket:any = await Basket.find({
      user_id: new mongoose.Types.ObjectId(user_id + ''),
      product_id: new mongoose.Types.ObjectId(product_id + '')
    }).limit(1);

    if(basket && basket.length > 0) {
      console.log(1)
      var basket_quantity = basket[0].quantity;
      const query = { 
        _id: new mongoose.Types.ObjectId(basket[0]._id + '')
      };
      const updates = {
        $set: {
          quantity: quantity + basket_quantity,
        },
      };

      let basketResult = await Basket.updateOne(query, updates);

      if(basketResult) {
        return NextResponse.json({
            message: "successful query ....",
            basketResult: basketResult
          }, {status: 200});
      } else {
        return NextResponse.json({
          message: "Could not add to cart ....",
          basketResult: basketResult
        }, {status: 500});
      }

    } else {

      console.log('basketDocument: ', basketDocument)

      let basketResult = await Basket.create(basketDocument);

      if(basketResult && basketResult._id) {
        return NextResponse.json({
            message: "successful query ....",
            basketResult: basketResult
          }, {status: 200});
      } else {
        return NextResponse.json({
          message: "Could not add to cart ....",
          basketResult: basketResult
        }, {status: 500});
      }
    }


    } catch (error) {
        return NextResponse.json({
          message: "error query ....",
          error: error
        }, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    try {

        await connectMongoDB();
        var url = new URL(request.url);
        var searchparams = new URLSearchParams(url.searchParams);
        var id = searchparams.get('id') + '';
        var user_id = searchparams.get('user_id') + '';
        let query = { _id: new mongoose.Types.ObjectId(id) };
        let deleteResult = await Basket.deleteOne(query);

        if(deleteResult) {

            const products_in_basket = await Basket
              .aggregate([
                  {
                      $match: { user_id: new mongoose.Types.ObjectId(user_id) },
                  },
                  {
                      $lookup: {
                          from: "products",
                          localField: "product_id",
                          foreignField: "_id",
                          as: "productInBasket",
                      },
                  }
              ]).sort({'createdAt': -1}).limit(100);

            return NextResponse.json({
                message: "item deleted from cart ....",
                result: products_in_basket
              }, {status: 200});
          } else {
            return NextResponse.json({
              message: "Could not delete the item from to cart ....",
            }, {status: 500});
        }

    } catch (error) {
        return NextResponse.json({
            message: "There was an error in deleting the item from cart ....",
          }, {status: 500});
    }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectMongoDB();
    var url = new URL(request.url);
    var searchparams = new URLSearchParams(url.searchParams);
    var id = searchparams.get('id') + '';
    var quantity = parseInt(searchparams.get('quantity') + '');
    var operation = searchparams.get('operation') + '';

    var updated_quantity = quantity;
    if(operation === 'add') {
      updated_quantity++;
    } else if(quantity > 1){
      updated_quantity--;
    }
    const query = { 
      _id: new mongoose.Types.ObjectId(id)
    };
    const updates = {
      $set: {
        quantity: updated_quantity,
      },
    };
    let basketResult = await Basket.updateOne(query, updates);

    if(basketResult) {
      var user_id = searchparams.get('user_id') + '';
      const products_in_basket = await Basket
        .aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(user_id)  },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "productInBasket",
                },
            },
            {
                $lookup: {
                    from: "prizes",
                    localField: "prize_id",
                    foreignField: "_id",
                    as: "prizeInBasket",
                },
            }
        ]).sort({'createdAt': -1}).limit(100);
        
      return NextResponse.json({
        message: "Item updated from cart ....",
        result: products_in_basket
      }, {status: 200});
    } else {

      return NextResponse.json({
        message: "Item cound not be updated ....",
      }, {status: 500});

    }



  } catch (error) {
    return NextResponse.json({
      message: "Server error ....",
      result: error
    }, {status: 500});
  }
}

