const dotenv=require("dotenv");
dotenv.config({
    path:".env"
});
module.exports={
    AUTH_SERVICE_PATH:process.env.AUTH_SERVICE_PATH,
    Booking_Service:process.env.Booking_Service,
    PORT:process.env.PORT
}