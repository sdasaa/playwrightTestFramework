const basePath: string = '/api/ecom';
const authPath: string = `${basePath}/auth`;
const produtctPath: string = `${basePath}/product`;
const userPath: string = `${basePath}/user`;
const orderPath: string = `${basePath}/order`;

export const ENDPOINTS = {
    basePath,
    authPath,
    produtctPath,
    userPath,
    orderPath,
    auth : {
        login : `${authPath}/login`,
    },
    product :{
        getAllProducts : `${produtctPath}/get-all-products`
    },
    user : {
        addToCart : `${userPath}/add-to-cart`,
        getCartCount : (userID: string) => `${userPath}/get-cart-count/${userID}`,
        getCartProducts : (userID: string) => `${userPath}/get-cart-products/${userID}`,
        deleteAProduct: (userID: string, productID: string) => `${userPath}/remove-from-cart/${userID}/${productID}`
    },
    orders : {
        createOrder : `${orderPath}/create-order`,
        getOrderDetails : `${orderPath}/get-orders-details`,
        getAllOrdersForUser : (userID: string) => `${orderPath}/get-orders-for-customer/${userID}`
    }
} as const