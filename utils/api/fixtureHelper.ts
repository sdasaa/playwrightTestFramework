
/*
    fn: productSelector(createAnOrderOD)
    params:
        1.a) count: 2 OR productNames: ["ADDIDAS ORIGINAL", "ZARA COAT 3"]
        1.b) allProdcuts : {data[    {"ADDIDAS ORIGINAL"....}, {"ZARACOAT 3"....}, {"iphone 13 pro".....}    ]}

    Purpose:
        1) If overriden from test: Either select pdts based on (1.a)
            const count = createAnOrderOD.count ?? undefined;
            const productNames =  createAnOrderOD.productNames ?? "";
            const pdtsToSelect="";
            const allPdts = allProdcuts.data;
            *)if productNames? (find & filter()) -----------------------------------------------> productNames: ["ZARA COAT 3"]
                if (productNames.length == 1)
                    pdtsToSelect = allPdts.data.find(p => productNames.includes(p.productName))
                if else (productNames.length > 1) ----------------------------------------------> productNames: ["ADDIDAS ORIGINAL", "ZARA COAT 3"]
                    pdtsToSelect = allPdts.data.filter(p => productNames.includes(p.productName))
            *)else() --> obv count is passed
                if(count > allPdts.length)
                    throw new Error('The number of items to be selected is more than the available products, Try providing lesser value')
                elseif(count == 1)
                    pdtsToSelect = allPdts[Math.floor(Math.random * allPdts.length)]
                else
                    const shuffledPdts = allPdts.sort(() => Math.random() - 0.5) ----> range [-0.5 to 0.5]
                    pdtsToSelect = shuffledPdts.slice(0, count)
            return pdtsToSelect

    fixture:
        createAnOrder : ({request, authResp, getAllPdtsResp, createAnOrderOD}, use) => {
            const allPdts = getAllPdtsResp.data; --------------------> Ref(1.b) for shape, what gets assigned here? allPdts = data[{}..{}] OR allPdts = {..}...{..}
            const prodcutsToSelect = createAnOrderOD
                                        ? productSelector(createAnOrderOD)
                                        : allPdts[Math.floor((Math.random * allPdts.length))]
            const payLoad = createAnOrderPayload(pdtsToSelect);
            // invocation of post
        }

    test:
        test.use(createAnOrderOD : {count: 3})
        test.use(createAnOrderOD : {productNames : ["ADDIDAS ORIGINAL", "ZARA COAT 3"]})
        <no overrides> {}

        pseudocode:
            if('productsToBeOverridden' in override && )
                const selectedProducts = <filter condition>
                if(!selectedProdcuts.length === productsToBeOverridden.length)
                    error
                return selectedProducts
        
            const howMany = overridenProducts.count? overridenProducts.count : 1
                const shuffledProducts = [...allProducts].sort(Math.floor(Math.random - 0.5));
            return shuffledProducts.slice(0, count+1)
*/

import {GetAllProdcutApiRespType, AddProductToCartReqODType, CreateAnOrderApiReqODType} from '@myTypes/index'
import {logger, myTestConfig} from '@utils/index'

export function productSelector(allProducts: GetAllProdcutApiRespType, overridenProducts: Partial<AddProductToCartReqODType> | Partial<CreateAnOrderApiReqODType>): GetAllProdcutApiRespType["data"][0][]{
    logger.info("In productSelector fn, overridenProducts ->",overridenProducts);
    if('productsToOverride' in overridenProducts && overridenProducts.productsToOverride){
            logger.info("overridenProducts has key productsToOverride in it");
        const selectedProducts = allProducts.data.filter(p => overridenProducts.productsToOverride?.includes(p.productName));
            logger.info("selectedProducts ->",selectedProducts);
        if(selectedProducts.length !== overridenProducts.productsToOverride.length){
            throw new Error(`Some products not found: ${overridenProducts.productsToOverride.join(', ')}`)
        }
        logger.info("selectedProducts -> ",selectedProducts)
        return selectedProducts  
    }

    const count = 'count' in overridenProducts && overridenProducts.count? overridenProducts.count : 1;
        logger.info('count is -> ',count);
    if(count > allProducts.data.length){
            throw new Error(`Requested ${count} products, but only ${allProducts.data.length} are available.`);
    }

    const shuffledProducts = [...allProducts.data].sort(() => Math.random() - 0.5)
        logger.info('shuffledProducts ->', shuffledProducts);
    return shuffledProducts.slice(0, count)
}
