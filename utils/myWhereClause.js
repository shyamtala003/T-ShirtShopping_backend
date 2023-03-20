exports.myWhereClause=(productModel,query)=>
{
    let searchObj={price:{},ratings:{}};
    
    //configure object for category wise search 
    if(query.category)
    {
        searchObj.category = query.category;
    }

    // configure object for price filtering
    if(query.price)
    {
        if(query.price.gte)
        {
            searchObj.price.$gte=query.price.gte;
        }
        if(query.price.lte)
        {
            searchObj.price.$lte=query.price.lte;
        }
    }else
    {
        delete searchObj.price;
    }

    // configure object for rating wise filtering
    if(query.ratings)
    {
        if(query.ratings.gte)
        {
            searchObj.ratings.$gte=query.ratings.gte;
        }
        if(query.ratings.lte)
        {
            searchObj.ratings.$lte=query.ratings.lte;
        }
        // if(query.rating.gt)
        // {
        //     searchObj.rating.$gt=query.rating.gt
        // }
        // if(query.rating.lt)
        // {
        //     searchObj.rating.$lt=query.rating.lt
        // }
    }else
    {
        delete searchObj.ratings;
    }

    // search product using name
    if(query.search)
    {
        searchObj.name={
            $regex:query.search,
            $options:'i'
        }
    }



    return searchObj;
}
